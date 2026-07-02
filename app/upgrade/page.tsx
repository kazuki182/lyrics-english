"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FREE_VERB_LIMIT,
  TOTAL_VERB_TARGET,
  getAccounts,
  getCurrentUsername,
  getPurchasePlanSummary,
  grantThirtyVerbPack,
  hasLyricsEnglishAccess,
  setUserUnlockLevel,
} from "@/lib/account";
import { PAYMENT_PLANS } from "@/lib/paymentConfig";

type PlanSummary = ReturnType<typeof getPurchasePlanSummary>;

const displayPlans = [
  { count: 0, label: "無料", price: 0, range: `1〜${FREE_VERB_LIMIT}`, note: "基本動詞をしっかり試せる範囲" },
  ...PAYMENT_PLANS.map((plan) => ({ count: plan.count, label: plan.label, price: plan.price, range: plan.range, note: plan.recommend })),
];

function isAdminUser(username: string | null) {
  if (!username) return false;
  return getAccounts().some((account) => account.username === username && account.role === "admin");
}

function getNextPlan(unlocked: number) {
  return PAYMENT_PLANS.find((plan) => plan.count > Math.max(FREE_VERB_LIMIT, unlocked)) || PAYMENT_PLANS[PAYMENT_PLANS.length - 1];
}

export default function UpgradePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [summary, setSummary] = useState<PlanSummary | null>(null);
  const [message, setMessage] = useState("");

  const refresh = () => setSummary(getPurchasePlanSummary());

  useEffect(() => {
    const user = getCurrentUsername();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setUsername(user);
    setSummary(getPurchasePlanSummary());
  }, []);

  const nextPlan = useMemo(() => summary ? getNextPlan(summary.rawUnlocked) : null, [summary]);

  if (!username || !summary || !nextPlan) return <p className="text-muted">読み込み中...</p>;

  const isAdmin = isAdminUser(username);
  const lyricsUnlocked = hasLyricsEnglishAccess();
  const progressPercent = Math.min(100, Math.round((summary.unlocked / TOTAL_VERB_TARGET) * 100));

  const simulatePremium = () => {
    grantThirtyVerbPack(username);
    refresh();
    setMessage("開発確認用：Premium範囲を反映しました。正式版では決済後に自動反映します。");
  };

  const setLevel = (count: number) => {
    setUserUnlockLevel(username, count);
    refresh();
    setMessage(count === 0 ? "開発確認用：無料状態に戻しました。" : `開発確認用：${count}動詞解放に変更しました。`);
  };

  return (
    <div className="space-y-5 pb-24">
      <header className="card p-5">
        <p className="text-sm font-bold text-cyan-200">UPGRADE / PREMIUM</p>
        <h1 className="mt-2 text-3xl font-black">Premium</h1>
        <p className="mt-2 text-sm text-slate-300">
          Ver.73では、30・60・90・120の段階課金に合わせて、動詞データを120語まで完成し、Ver.82で仕事向け追加4語を加えました。
          91番以降は、120語パック対象として学習できます。
        </p>
      </header>

      <section className="digital-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-cyan-200">CURRENT PLAN</p>
            <h2 className="mt-2 text-2xl font-black">{summary.unlocked} / {TOTAL_VERB_TARGET} 動詞 解放中</h2>
          </div>
          <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950">
            {summary.hasPremium ? `Step ${summary.paidPacks}` : "Free 3"}
          </span>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-950">
          <div className="h-full rounded-full bg-cyan-300" style={{ width: `${progressPercent}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted">無料：1〜{FREE_VERB_LIMIT} / Step1：30 / Step2：60 / Step3：90 / Step4：120（91〜120を解放）</p>

        {summary.unlocked >= TOTAL_VERB_TARGET ? (
          <div className="mt-4 rounded-2xl bg-emerald-950/30 p-4 text-sm font-bold text-emerald-100">全動詞が解放されています。</div>
        ) : (
          <div className="mt-5 rounded-3xl border border-amber-300/25 bg-amber-950/20 p-5">
            <p className="text-sm font-bold text-amber-100">おすすめ</p>
            <p className="mt-1 text-3xl font-black">{nextPlan.label}</p>
            <p className="mt-1 text-2xl font-black">¥{nextPlan.price.toLocaleString()}</p>
            <p className="mt-2 text-sm text-amber-100/80">{nextPlan.range}動詞まで解放。追加範囲：{nextPlan.addRange}。{nextPlan.recommend}</p>
            <Link className="btn btn-primary mt-4 block text-center" href={`/checkout?plan=${nextPlan.count}`}>購入確認へ進む</Link>
          </div>
        )}
        {message && <p className="mt-3 rounded-2xl bg-slate-950/50 p-3 text-sm font-bold text-cyan-100">{message}</p>}
      </section>



      <section className="card p-5">
        <h2 className="text-xl font-bold">解放ステップ</h2>
        <div className="mt-4 grid gap-3 text-sm">
          <div className="rounded-2xl bg-paper p-4"><b>無料</b><br />1〜3番：まず試せる基本動詞</div>
          <div className="rounded-2xl bg-paper p-4"><b>Step 1</b><br />4〜30番：最初の課金で残り27動詞を解放</div>
          <div className="rounded-2xl bg-paper p-4"><b>Step 2</b><br />31〜60番：仕事と日常で使う基本動詞を拡張</div>
          <div className="rounded-2xl bg-paper p-4"><b>Step 3</b><br />61〜90番：主要動詞90語まで解放</div>
          <div className="rounded-2xl border border-amber-300/25 bg-amber-950/20 p-4 text-amber-100"><b>Step 4</b><br />91番以降：120語パック対象。Ver.82で追加4語を含めて124語まで確認できます。</div>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-xl font-bold">無料とPremiumの違い</h2>
        <div className="mt-4 grid gap-3 text-sm">
          <div className="rounded-2xl bg-paper p-4">
            <p className="font-black text-white">無料</p>
            <p className="mt-1 text-muted">1〜{FREE_VERB_LIMIT}番の基本動詞、基本学習、10問テスト、通常音声を利用できます。</p>
          </div>
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-950/20 p-4">
            <p className="font-black text-cyan-100">Premium</p>
            <p className="mt-1 text-slate-300">課金ごとに30→60→90→120動詞へ段階解放。91番以降は120語パック対象です。日常例文、0.5倍速音声、フレーズ保存、シャッフルテスト、復習強化、クラウド保存・復元を利用できます。</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">プラン</h2>
        {displayPlans.map((plan) => {
          const active = plan.count === 0 ? summary.rawUnlocked <= FREE_VERB_LIMIT : summary.rawUnlocked >= plan.count;
          const targetCount = plan.count || FREE_VERB_LIMIT;
          return (
            <article key={plan.count} className={`card p-5 ${active ? "border-cyan-300/50" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-cyan-200">{plan.label}</p>
                  <p className="mt-1 text-3xl font-black">{plan.price === 0 ? "無料" : `¥${plan.price.toLocaleString()}`}</p>
                  <p className="mt-2 text-sm text-muted">{plan.range}動詞 / {plan.note}</p>
                  {plan.count === 120 && <p className="mt-2 rounded-xl border border-amber-300/25 bg-amber-950/20 p-2 text-xs font-bold text-amber-100">91番以降も学習できます。120語パックで現在の全動詞を解放します。</p>}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">{targetCount}</p>
                  <p className="text-xs font-bold text-cyan-200">動詞</p>
                  {active && <p className="mt-2 rounded-full bg-cyan-300 px-3 py-1 text-xs font-bold text-slate-950">解放中</p>}
                </div>
              </div>
              {plan.count > 0 && !active && (
                <Link className="btn btn-primary mt-4 block text-center" href={`/checkout?plan=${plan.count}`}>
                  このプランを購入確認
                </Link>
              )}
            </article>
          );
        })}
      </section>

      <section className="card p-5">
        <h2 className="text-xl font-bold">有料パックで解放される機能</h2>
        <div className="mt-4 grid gap-3 text-sm">
          {["🐢 0.5倍速音声", "🏠 日常例文", "⭐ フレーズ登録帳", "🔀 シャッフルテスト", "📘 構造 / Pattern表示", "📈 復習強化機能", "☁️ クラウド保存・復元"].map((item) => (
            <div key={item} className="rounded-2xl bg-paper p-3 font-bold">{item}</div>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-xl font-bold">Lyrics English</h2>
        {lyricsUnlocked ? (
          <div className="mt-3">
            <p className="text-sm text-slate-300">120語パックが解放済みのため、Lyrics Englishリンクを表示しています。</p>
            <a className="btn btn-primary mt-4 block text-center" href="#" onClick={(e) => e.preventDefault()}>Lyrics Englishを開く</a>
            <p className="mt-2 text-xs text-muted">正式URL設定後にリンクを接続します。</p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-300">🔒 120語パックまで解放すると、Lyrics Englishリンクが表示されます。</p>
        )}
      </section>

      {isAdmin && (
        <section className="card p-5">
          <h2 className="text-xl font-bold">管理者用テスト操作</h2>
          <p className="mt-2 text-sm text-muted">正式決済前の表示確認用です。通常ユーザーには表示されません。</p>
          <button className="btn btn-primary mt-4 block w-full" onClick={simulatePremium}>次の段階を反映</button>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {[0, 30, 60, 90, 120].map((count) => (
              <button key={count} className="rounded-xl bg-paper px-3 py-2 text-sm font-bold" onClick={() => setLevel(count)}>{count === 0 ? "無料" : count}</button>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-3">
        <Link href="/purchases" className="btn btn-soft block text-center">購入履歴・復元を見る</Link>
        <Link href="/profile" className="btn btn-soft block text-center">マイページへ戻る</Link>
      </div>
    </div>
  );
}
