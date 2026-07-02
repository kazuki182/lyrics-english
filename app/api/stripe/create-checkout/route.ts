import { NextResponse } from "next/server";
import { PAYMENT_PLANS } from "@/lib/paymentConfig";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const planCount = Number(body.plan || 90);
    const username = String(body.username || "guest");
    const plan = PAYMENT_PLANS.find((item) => item.count === planCount) || PAYMENT_PLANS[0];

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = plan.stripePriceId;

    if (!secretKey || !priceId) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Stripe環境変数が未設定です。STRIPE_SECRET_KEY と各NEXT_PUBLIC_STRIPE_PRICE_XXをVercelに設定してください。",
          required: ["STRIPE_SECRET_KEY", plan.stripePriceEnvName],
        },
        { status: 501 },
      );
    }

    const origin = new URL(request.url).origin;
    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("line_items[0][price]", priceId);
    params.set("line_items[0][quantity]", "1");
    params.set("success_url", `${origin}/checkout/complete?plan=${plan.count}&mode=stripe&session_id={CHECKOUT_SESSION_ID}`);
    params.set("cancel_url", `${origin}/checkout/cancel?plan=${plan.count}`);
    params.set("metadata[username]", username);
    params.set("metadata[plan_id]", plan.planId);
    params.set("metadata[unlocked_verb_count]", String(plan.count));

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const data = await stripeResponse.json();
    if (!stripeResponse.ok) {
      return NextResponse.json(
        { ok: false, message: data?.error?.message || "Stripe Checkoutの作成に失敗しました。" },
        { status: stripeResponse.status },
      );
    }

    return NextResponse.json({ ok: true, url: data.url, sessionId: data.id });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Stripe Checkout準備中にエラーが発生しました。" },
      { status: 500 },
    );
  }
}
