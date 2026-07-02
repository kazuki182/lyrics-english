import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PAYMENT_PLANS } from "@/lib/paymentConfig";

export const runtime = "nodejs";

type StripeEvent = {
  id?: string;
  type?: string;
  data?: { object?: Record<string, any> };
};

function timingSafeEqualHex(a: string, b: string) {
  const bufferA = Buffer.from(a, "hex");
  const bufferB = Buffer.from(b, "hex");
  if (bufferA.length !== bufferB.length) return false;
  return crypto.timingSafeEqual(bufferA, bufferB);
}

function verifyStripeSignature(payload: string, signatureHeader: string | null, secret: string) {
  if (!signatureHeader) return false;
  const parts = signatureHeader.split(",").reduce<Record<string, string[]>>((acc, part) => {
    const [key, value] = part.split("=");
    if (!key || !value) return acc;
    acc[key] = [...(acc[key] || []), value];
    return acc;
  }, {});
  const timestamp = parts.t?.[0];
  const signatures = parts.v1 || [];
  if (!timestamp || signatures.length === 0) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  return signatures.some((signature) => timingSafeEqualHex(signature, expected));
}

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function planLabelForCount(count: number) {
  const plan = PAYMENT_PLANS.find((item) => item.count === count);
  return plan?.label || `${count}動詞パック`;
}

function totalForCount(count: number) {
  const normalized = Math.max(0, Math.min(120, Math.floor(count)));
  if (normalized <= 3) return 0;
  if (normalized <= 30) return 500;
  if (normalized <= 60) return 1000;
  if (normalized <= 90) return 1500;
  return 2000;
}

function planName(count: number) {
  if (count >= 120) return "all_access";
  if (count >= 90) return "premium_90";
  if (count >= 60) return "premium_60";
  if (count >= 30) return "premium_30";
  return "free";
}

async function recordCheckoutCompleted(event: StripeEvent) {
  const session = event.data?.object || {};
  const metadata = (session.metadata || {}) as Record<string, string>;
  const username = metadata.username || "";
  const planId = metadata.plan_id || "unknown";
  const unlockedVerbCount = Number(metadata.unlocked_verb_count || 0);
  const stripeSessionId = String(session.id || "");
  const paymentIntentId = String(session.payment_intent || "");
  const paymentStatus = String(session.payment_status || "paid");
  const amountYen = totalForCount(unlockedVerbCount);

  if (!username || !unlockedVerbCount) {
    return { ok: false, message: "metadata.username または unlocked_verb_count が不足しています。" };
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return { ok: false, message: "Supabase環境変数が未設定です。" };
  }

  const premiumPayload = {
    username,
    plan: planName(unlockedVerbCount),
    unlocked_verb_count: unlockedVerbCount,
    purchase_total_yen: amountYen,
    lyrics_english_access: unlockedVerbCount >= 120,
    provider: "stripe",
    source: "stripe_webhook",
    stripe_session_id: stripeSessionId,
    payment_status: paymentStatus === "paid" || paymentStatus === "no_payment_required" ? "paid" : paymentStatus,
    updated_at: new Date().toISOString(),
  };

  const { error: entitlementError } = await supabase
    .from("premium_entitlements")
    .upsert(premiumPayload, { onConflict: "username" });
  if (entitlementError) throw entitlementError;

  await supabase.from("payment_events").insert({
    username,
    provider: "stripe",
    mode: "payment",
    plan_id: planId,
    unlocked_verb_count: unlockedVerbCount,
    amount_yen: amountYen,
    status: "checkout.session.completed",
    stripe_session_id: stripeSessionId,
    stripe_payment_intent_id: paymentIntentId || null,
    raw_event: event as any,
    updated_at: new Date().toISOString(),
  });

  await supabase.from("purchase_events").insert({
    username,
    unlocked_verb_count: unlockedVerbCount,
    purchase_total_yen: amountYen,
    plan_label: planLabelForCount(unlockedVerbCount),
    source: "stripe_webhook",
    note: `Stripe Webhookで支払い完了を確認しました。session=${stripeSessionId}`,
  });

  return { ok: true, message: `${username} を ${unlockedVerbCount}動詞まで解放しました。` };
}

async function recordSimplePaymentEvent(event: StripeEvent, status: string) {
  const object = event.data?.object || {};
  const metadata = (object.metadata || {}) as Record<string, string>;
  const username = metadata.username || "unknown";
  const unlockedVerbCount = Number(metadata.unlocked_verb_count || 0);
  const supabase = getServerSupabase();
  if (!supabase) return { ok: false, message: "Supabase環境変数が未設定です。" };
  await supabase.from("payment_events").insert({
    username,
    provider: "stripe",
    mode: "payment",
    plan_id: metadata.plan_id || "unknown",
    unlocked_verb_count: unlockedVerbCount,
    amount_yen: totalForCount(unlockedVerbCount),
    status,
    stripe_session_id: String(object.id || ""),
    raw_event: event as any,
    updated_at: new Date().toISOString(),
  });
  return { ok: true, message: `${status} を記録しました。` };
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const payload = await request.text();

  if (!webhookSecret) {
    return NextResponse.json(
      {
        ok: false,
        message: "STRIPE_WEBHOOK_SECRETが未設定です。Stripe登録後にVercelへ設定するとWebhook検証が有効になります。",
      },
      { status: 501 },
    );
  }

  if (!verifyStripeSignature(payload, request.headers.get("stripe-signature"), webhookSecret)) {
    return NextResponse.json({ ok: false, message: "Stripe署名の検証に失敗しました。" }, { status: 400 });
  }

  try {
    const event = JSON.parse(payload) as StripeEvent;
    if (event.type === "checkout.session.completed") {
      const result = await recordCheckoutCompleted(event);
      return NextResponse.json({ ok: result.ok, handled: event.type, message: result.message });
    }
    if (event.type === "checkout.session.expired" || event.type === "payment_intent.payment_failed" || event.type === "charge.refunded") {
      const result = await recordSimplePaymentEvent(event, event.type);
      return NextResponse.json({ ok: result.ok, handled: event.type, message: result.message });
    }
    return NextResponse.json({ ok: true, handled: false, type: event.type || "unknown" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Webhook処理中にエラーが発生しました。" },
      { status: 500 },
    );
  }
}
