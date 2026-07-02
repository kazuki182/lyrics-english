"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  TOTAL_VERB_TARGET,
  getCurrentUsername,
  getPurchasePlanSummary,
  setUserUnlockLevel,
} from "@/lib/account";
import { syncCurrentUserToSupabase } from "@/lib/cloudSync";
import { getPaymentPlan } from "@/lib/paymentConfig";

function planFromQuery() {
  if (typeof window === "undefined") return 30;
  const value = Number(new URLSearchParams(window.location.search).get("plan") || "30");
  return [30, 60, 90, 120].includes(value) ? value : 30;
}

function modeFromQuery() {
  if (typeof window === "undefined") return "mock";
  return new URLSearchParams(window.location.search).get("mode") === "stripe" ? "stripe" : "mock";
}

function sessionFromQuery() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("session_id") || "";
}

export default function CheckoutCompletePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [targetPlan, setTargetPlan] = useState(30);
  const [mode, setMode] = useState("mock");
  const [sessionId, setSessionId] = useState("");
  const [message, setMessage] = useState("購入状態を確認しています...");
  const [summary, setSummary] = useState(getPurchasePlanSummary());

  useEffect(() => {
    const user = getCurrentUsername();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    const planCount = planFromQuery();
    const paymentMode = modeFromQuery();
    const stripeSessionId = sessionFromQuery();
    const plan = getPaymentPlan(planCount);
    setUsername(user);
    setTargetPlan(planCount);
    setMode(paymentMode);
    setSessionId(stripeSessionId);

    const before = getPurchasePlanSummary();
    if (before.rawUnlocked >= planCount) {
      setSummary(before);
      setMessage("このプランはすでに解放済みです。");
      return;
    }

    if (paymentMode === "stripe") {
      setSummary(before);
      setMessage(
        "Stripeから戻りました。Ver.73以降はWebhookで支払い完了を検証してから解放します.購入履歴・復元ページでSupabaseから復元してください。",
      );
      return;
    }

    const note = `仮購入：${plan.label}を反映しました。正式決済接続前の確認用です。`;
    const progress = setUserUnlockLevel(user, planCount, "checkout_ready", note);
    setSummary(getPurchasePlanSummary());
    setMessage("購入履歴とPremium状態に反映しました。");
    syncCurrentUserToSupabase(progress).catch(() => undefined);
  }, []);

  const plan = useMemo(() => getPaymentPlan(targetPlan), [targetPlan]);

  if (!username) return <p className="text-muted">読み込み中...</p>;

  return (
    <div className="space-y-5 pb-24">
      <header className="digital-card p-6 text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-cyan-200">COMPLETE</p>
        <h1 className="mt-3 text-3xl font-black text-white">
          {mode === "stripe" ? "決済確認中" : "購入が完了しました"}
        </h1>
        <p className="mt-3 text-sm text-slate-300">{message}</p>
      </header>

      <section className="card p-5">
        <h2 className="text-xl font-bold">購入内容</h2>
        <div className="mt-4 grid gap-3 text-sm">
          <div className="rounded-2xl bg-paper p-4 font-bold">決済モード：{mode === "stripe" ? "Stripe" : "仮購入"}</div>
          <div className="rounded-2xl bg-paper p-4 font-bold">プラン：{plan.label}</div>
          <div className="rounded-2xl bg-paper p-4 font-bold">現在：{summary.unlocked} / {TOTAL_VERB_TARGET} 動詞 解放中</div>
          <div className="rounded-2xl bg-paper p-4 font-bold">購入総額：¥{summary.purchaseTotal.toLocaleString()}</div>
          {sessionId && <div className="rounded-2xl bg-slate-950/50 p-4 text-xs font-bold text-cyan-100">Stripe Session ID：{sessionId}</div>}
        </div>
      </section>

      {mode === "stripe" && (
        <section className="card p-5">
          <h2 className="text-xl font-bold">Webhook反映について</h2>
          <p className="mt-2 text-sm text-muted">
            本番決済では、画面に戻っただけでは解放しません。Stripe Webhookで支払い完了を検証し、SupabaseのPremium状態を更新します。
          </p>
          <Link className="btn btn-primary mt-4 block text-center" href="/purchases">購入状態を復元する</Link>
        </section>
      )}

      <section className="card p-5">
        <h2 className="text-xl font-bold">次にすること</h2>
        <div className="mt-4 grid gap-3">
          <Link className="btn btn-primary block text-center" href="/verbs">動詞を学習する</Link>
          <Link className="btn btn-soft block text-center" href="/purchases">購入履歴を確認する</Link>
          <Link className="btn btn-soft block text-center" href="/profile">マイページへ戻る</Link>
        </div>
      </section>

      <p className="text-center text-xs text-muted">Verb Master Version 72</p>
    </div>
  );
}
