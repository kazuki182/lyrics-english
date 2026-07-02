"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { FREE_VERB_LIMIT, TOTAL_VERB_TARGET, getPurchasePlanSummary } from "@/lib/account";

type Status = {
  loaded: boolean;
  unlocked: number;
  locked: boolean;
  purchaseTotal: number;
  hasPremium: boolean;
};

export default function VerbAccessGuard({
  rank,
  verbWord,
  children,
}: {
  rank: number;
  verbWord: string;
  children: ReactNode;
}) {
  const [status, setStatus] = useState<Status>({
    loaded: false,
    unlocked: FREE_VERB_LIMIT,
    locked: false,
    purchaseTotal: 0,
    hasPremium: false,
  });

  useEffect(() => {
    const summary = getPurchasePlanSummary();
    setStatus({
      loaded: true,
      unlocked: summary.unlocked,
      locked: rank > summary.unlocked,
      purchaseTotal: summary.purchaseTotal,
      hasPremium: summary.hasPremium,
    });
  }, [rank]);

  if (!status.loaded) {
    return <div className="card p-6 text-muted">Premium状態を確認しています...</div>;
  }

  if (!status.locked) return <>{children}</>;

  const nextPlan = rank <= 30 ? 30 : rank <= 60 ? 60 : rank <= 90 ? 90 : 120;
  const nextPrice = nextPlan === 30 ? 500 : nextPlan === 60 ? 1000 : nextPlan === 90 ? 1500 : 2000;
  const stepLabel = nextPlan === 30 ? "Step 1：30語パック" : nextPlan === 60 ? "Step 2：60語パック" : nextPlan === 90 ? "Step 3：90語パック" : "Step 4：120語パック";
  const futureNote = rank > 90 ? "91番以降は120語パック対象です。Ver.82では120語パック購入者向けの追加4語も学習できます。" : "";

  return (
    <div className="space-y-5 pb-24">
      <section className="card p-6 text-center">
        <p className="text-sm font-bold text-amber-100">🔒 Premium Verb</p>
        <h1 className="mt-2 text-4xl font-black verb-red">{verbWord}</h1>
        <p className="mt-3 text-muted">
          この動詞は No.{String(rank).padStart(2, "0")} です。現在は {status.unlocked} / {TOTAL_VERB_TARGET} 動詞まで解放されています。
        </p>
        <div className="mt-5 rounded-3xl border border-amber-300/20 bg-amber-950/20 p-4 text-left text-sm text-amber-100">
          <p className="font-bold">おすすめ解放プラン</p>
          <p className="mt-2">
            {stepLabel}（¥{nextPrice.toLocaleString()}）で {nextPlan} 動詞まで解放すると、この動詞を学習できます。
          </p>
          {futureNote && <p className="mt-2 text-xs text-amber-100/80">{futureNote}</p>}
        </div>
        <Link href="/upgrade" className="btn btn-primary mt-5 block">アップグレードを見る</Link>
        <Link href="/verbs" className="btn btn-soft mt-3 block">動詞一覧へ戻る</Link>
      </section>

      <section className="digital-card p-5">
        <p className="text-xs font-bold tracking-[0.25em] text-cyan-200">CURRENT ACCESS</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
          <div className="digital-panel">
            <p className="digital-label">解放済み</p>
            <p className="digital-number text-3xl">{status.unlocked}</p>
            <p className="text-xs text-cyan-200">/ {TOTAL_VERB_TARGET} 動詞</p>
          </div>
          <div className="digital-panel">
            <p className="digital-label">購入額</p>
            <p className="digital-number text-3xl">¥{status.purchaseTotal.toLocaleString()}</p>
            <p className="text-xs text-cyan-200">買い切り</p>
          </div>
        </div>
      </section>
    </div>
  );
}
