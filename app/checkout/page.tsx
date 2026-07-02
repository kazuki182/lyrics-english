"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FREE_VERB_LIMIT,
  TOTAL_VERB_TARGET,
  getCurrentUsername,
  getPurchasePlanSummary,
} from "@/lib/account";
import { PAYMENT_PLANS, getPaymentMode, getPaymentModeLabel, getPaymentPlan, getPaymentReadiness } from "@/lib/paymentConfig";

function planFromQuery() {
  if (typeof window === "undefined") return 30;
  const value = Number(new URLSearchParams(window.location.search).get("plan") || "30");
  return [30, 60, 90, 120].includes(value) ? value : 30;
}

function canceledFromQuery() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("canceled") === "1";
}

export default function CheckoutPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [targetPlan, setTargetPlan] = useState(30);
  const [summary, setSummary] = useState(getPurchasePlanSummary());
  const [message, setMessage] = useState("");
  const [loadingStripe, setLoadingStripe] = useState(false);

  useEffect(() => {
    const user = getCurrentUsername();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setUsername(user);
    setTargetPlan(planFromQuery());
    setSummary(getPurchasePlanSummary());
    if (canceledFromQuery()) setMessage("Stripe決済をキャンセルしました。プランを確認して再度進めます。");
  }, []);

  const plan = useMemo(() => getPaymentPlan(targetPlan), [targetPlan]);
  const readiness = useMemo(() => getPaymentReadiness(), []);
  const paymentMode = getPaymentMode();
  const alreadyUnlocked = summary.rawUnlocked >= plan.count;
  const additionalPrice = Math.max(0, plan.cumulativePrice - summary.purchaseTotal);
  const currentText = summary.rawUnlocked > 0 ? `${summary.rawUnlocked}動詞解放中` : `${FREE_VERB_LIMIT}動詞まで無料`;

  const startStripeCheckout = async () => {
    if (!username) return;
    setLoadingStripe(true);
    setMessage("Stripe Checkoutを準備しています...");
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.count, username }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok || !data.url) {
        throw new Error(data.message || "Stripe Checkoutを開始できませんでした。");
      }
      window.location.href = data.url;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Stripe Checkout準備中にエラーが発生しました。");
    } finally {
      setLoadingStripe(false);
    }
  };

  if (!username) return <p className="text-muted">読み込み中...</p>;

  return (
    <div className="space-y-5 pb-24">
      <header className="card p-5">
        <p className="text-sm font-bold text-cyan-200">CHECKOUT / PAYMENT READY</p>
        <h1 className="mt-2 text-3xl font-black">購入確認</h1>
        <p className="mt-2 text-sm text-slate-300">
          Ver.73では動詞データを120語まで完成し、Ver.82で仕事向け追加4語を加えました。30・60・90・120の段階課金に合わせて、購入後は対象範囲まで解放されます。Stripe登録後はWebhookで支払い完了を検証して購入パックを反映します。
        </p>
      </header>

      <section className="digital-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-cyan-200">PAYMENT MODE</p>
            <h2 className="mt-2 text-2xl font-black text-white">{getPaymentModeLabel(paymentMode)}</h2>
            <p className="mt-2 text-sm text-slate-300">
              {paymentMode === "stripe" ? "Stripe Checkoutに接続する準備モードです。" : "今は本番決済を行わない安全な仮購入モードです。"}
            </p>
          </div>
          <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950">Ver.73</span>
        </div>
        <div className="mt-4 grid gap-2 text-sm">
          <div className="rounded-2xl bg-slate-950/50 p-3 font-bold">公開キー：{readiness.publishableKeyReady ? "設定済み" : "未設定"}</div>
          <div className="rounded-2xl bg-slate-950/50 p-3 font-bold">Price ID：{readiness.priceIdsReady ? "設定済み" : "未設定あり"}</div>
          {!readiness.priceIdsReady && (
            <p className="rounded-2xl bg-amber-950/30 p-3 text-xs font-bold text-amber-100">
              未設定：{readiness.missingPublicPriceIds.join(" / ")}
            </p>
          )}
        </div>
      </section>

      <section className="digital-card p-5">
        <p className="text-xs font-bold tracking-[0.25em] text-cyan-200">ORDER</p>
        <h2 className="mt-2 text-2xl font-black text-white">{plan.label}</h2>
        <p className="mt-2 text-sm text-slate-300">{plan.range}動詞まで解放 / {plan.recommend}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-center">
          <div className="digital-panel">
            <p className="digital-label">このパック</p>
            <p className="digital-number text-3xl">¥{plan.price.toLocaleString()}</p>
          </div>
          <div className="digital-panel">
            <p className="digital-label">今回の支払い</p>
            <p className="digital-number text-3xl">¥{additionalPrice.toLocaleString()}</p>
          </div>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-xl font-bold">解放される内容</h2>
        <div className="mt-4 grid gap-3 text-sm">
          <div className="rounded-2xl bg-paper p-4 font-bold">現在：{currentText}</div>
          <div className="rounded-2xl bg-paper p-4 font-bold">追加解放：{plan.addRange}番の動詞</div>
          <div className="rounded-2xl bg-paper p-4 font-bold">購入後の累計：¥{plan.cumulativePrice.toLocaleString()}</div>
          <div className="rounded-2xl bg-paper p-4 font-bold">Premium機能：0.5倍速音声 / 日常例文 / フレーズ帳 / シャッフルテスト / 文法パターン / 復習強化</div>
          {plan.count >= TOTAL_VERB_TARGET && (
            <div className="rounded-2xl bg-amber-950/30 p-4 font-bold text-amber-100">91番以降も学習できます。120語パック解放でLyrics Englishリンクも表示対象になります。</div>
          )}
        </div>
      </section>

      {alreadyUnlocked ? (
        <section className="card p-5">
          <h2 className="text-xl font-bold">すでに解放済みです</h2>
          <p className="mt-2 text-sm text-muted">このプランはすでに利用できます。購入履歴または学習画面へ進んでください。</p>
          <div className="mt-4 grid gap-3">
            <Link className="btn btn-primary block text-center" href="/verbs">動詞一覧へ</Link>
            <Link className="btn btn-soft block text-center" href="/purchases">購入履歴を見る</Link>
          </div>
        </section>
      ) : (
        <section className="card p-5">
          <h2 className="text-xl font-bold">購入前の確認</h2>
          <p className="mt-2 text-sm text-muted">仮購入では即時解放します。Stripe決済モードではCheckout画面に移動します。</p>
          {paymentMode === "stripe" ? (
            <button className="btn btn-primary mt-4 block w-full text-center" onClick={startStripeCheckout} disabled={loadingStripe}>
              {loadingStripe ? "Stripe準備中..." : "Stripe Checkoutへ進む"}
            </button>
          ) : (
            <Link className="btn btn-primary mt-4 block text-center" href={`/checkout/complete?plan=${plan.count}&mode=mock`}>
              仮購入を確定する
            </Link>
          )}
          <Link className="btn btn-soft mt-3 block text-center" href="/upgrade">プランを選び直す</Link>
          {message && <p className="mt-3 rounded-2xl bg-slate-950/50 p-3 text-sm font-bold text-cyan-100">{message}</p>}
        </section>
      )}

      <section className="card p-5">
        <h2 className="text-xl font-bold">プランID確認</h2>
        <div className="mt-3 grid gap-2 text-xs">
          {PAYMENT_PLANS.map((item) => (
            <div key={item.count} className="rounded-2xl bg-paper p-3 font-bold">
              {item.planId} / {item.label} / {item.stripePriceId ? "Price ID設定済み" : item.stripePriceEnvName + " 未設定"}
            </div>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-muted">Verb Master Version 72</p>
    </div>
  );
}
