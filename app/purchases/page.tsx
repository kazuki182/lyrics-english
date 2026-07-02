"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FREE_VERB_LIMIT,
  TOTAL_VERB_TARGET,
  formatDateTime,
  getAccounts,
  getCurrentUsername,
  getPremiumSafetySummary,
  getPurchaseHistory,
  getPurchasePlanSummary,
  restorePremiumEntitlement,
  setUserUnlockLevel,
  type PurchaseRecord,
} from "@/lib/account";
import {
  restorePremiumFromSupabase,
  syncCurrentUserToSupabase,
} from "@/lib/cloudSync";

const planLabels: Record<number, string> = {
  0: "無料プラン",
  3: "無料3動詞プラン",
  30: "Step 1：30動詞パック",
  60: "Step 2：60動詞パック",
  90: "Step 3：90動詞パック",
  120: "Step 4：120動詞パック",
};

function isAdminUser(username: string | null) {
  if (!username) return false;
  return getAccounts().some(
    (account) => account.username === username && account.role === "admin",
  );
}

function sourceLabel(source?: PurchaseRecord["source"]) {
  if (source === "admin_test") return "管理者テスト";
  if (source === "restore") return "復元";
  return "決済準備";
}

function getNextUnlock(current: number) {
  if (current < 30) return 30;
  if (current < 60) return 60;
  if (current < 90) return 90;
  if (current < TOTAL_VERB_TARGET) return TOTAL_VERB_TARGET;
  return TOTAL_VERB_TARGET;
}

export default function PurchaseHistoryPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [summary, setSummary] = useState(getPurchasePlanSummary());
  const [history, setHistory] = useState<PurchaseRecord[]>([]);
  const [safety, setSafety] = useState(getPremiumSafetySummary());
  const [message, setMessage] = useState("");
  const [restoring, setRestoring] = useState(false);

  const reload = () => {
    setSummary(getPurchasePlanSummary());
    setHistory(getPurchaseHistory());
    setSafety(getPremiumSafetySummary());
  };

  useEffect(() => {
    const user = getCurrentUsername();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setUsername(user);
    reload();
  }, []);

  const nextUnlock = useMemo(
    () => getNextUnlock(summary.rawUnlocked),
    [summary.rawUnlocked],
  );
  const isAdmin = isAdminUser(username);

  const restoreFromSupabase = async () => {
    if (!username) return;
    setRestoring(true);
    setMessage("購入状態をSupabaseから確認しています...");
    const result = await restorePremiumFromSupabase(username);
    setMessage(result.message);
    setRestoring(false);
    reload();
  };

  const localSafeRestore = () => {
    if (!username) return;
    const keep = Math.max(summary.rawUnlocked || 0, FREE_VERB_LIMIT);
    restorePremiumEntitlement(
      username,
      keep,
      summary.purchaseTotal,
      "ローカルの購入状態を安全に再保存しました。",
    );
    reload();
    setMessage(
      "ローカルに残っている購入状態を再保存しました。Supabase未設定時の安全確認用です。",
    );
  };

  const adminSetLevel = async (count: number) => {
    if (!username) return;
    const progress = setUserUnlockLevel(
      username,
      count,
      "admin_test",
      `開発確認用：${count === 0 ? "無料" : `${count}動詞`}に変更しました。`,
    );
    await syncCurrentUserToSupabase(progress);
    reload();
    setMessage(
      count === 0
        ? "管理者テスト：無料状態に戻しました。"
        : `管理者テスト：${count}動詞解放に変更しました。`,
    );
  };

  if (!username) return <p className="text-muted">読み込み中...</p>;

  const currentPlan =
    planLabels[summary.rawUnlocked] || `${summary.rawUnlocked}動詞解放`;

  return (
    <div className="space-y-5 pb-24">
      <header className="card p-5">
        <p className="text-sm font-bold text-cyan-200">PURCHASE / RESTORE</p>
        <h1 className="mt-2 text-3xl font-black">購入履歴・復元</h1>
        <p className="mt-2 text-sm text-slate-300">
          有料化前の安全対策ページです。購入状態、復元、Premium整合性をここで確認します。
        </p>
      </header>

      <section className="digital-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-cyan-200">
              CURRENT PLAN
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">
              {currentPlan}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              {summary.unlocked} / {TOTAL_VERB_TARGET} 動詞 解放中
            </p>
          </div>
          <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950">
            {summary.hasPremium ? `Step ${summary.paidPacks}` : "Free 3"}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
          <div className="digital-panel">
            <p className="digital-label">購入額</p>
            <p className="digital-number text-3xl">
              ¥{summary.purchaseTotal.toLocaleString()}
            </p>
          </div>
          <div className="digital-panel">
            <p className="digital-label">次の解放</p>
            <p className="digital-number text-3xl">
              {summary.rawUnlocked >= TOTAL_VERB_TARGET ? "完了" : nextUnlock}
            </p>
            <p className="text-xs text-cyan-200">
              {summary.rawUnlocked >= TOTAL_VERB_TARGET
                ? "All Access"
                : "動詞まで"}
            </p>
          </div>
        </div>
        <Link
          className="btn btn-primary mt-4 block text-center"
          href="/upgrade"
        >
          アップグレード画面へ
        </Link>
      </section>

      <section className="card p-5">
        <h2 className="text-xl font-bold">購入状態を復元</h2>
        <p className="mt-2 text-sm text-muted">
          スマホ変更、ログアウト、別端末利用時にPremium状態を戻すためのボタンです。正式決済接続後は決済情報を優先して復元します。
        </p>
        <div className="mt-4 grid gap-3">
          <button
            className="btn btn-primary w-full"
            type="button"
            onClick={restoreFromSupabase}
            disabled={restoring}
          >
            {restoring ? "Supabase確認中..." : "Supabaseから購入状態を復元"}
          </button>
          <button
            className="btn btn-soft w-full"
            type="button"
            onClick={localSafeRestore}
          >
            ローカル購入状態を安全に再保存
          </button>
        </div>
        {message && (
          <p className="mt-3 rounded-2xl bg-slate-950/50 p-3 text-sm font-bold text-cyan-100">
            {message}
          </p>
        )}
      </section>

      <section className="digital-card p-5">
        <p className="text-xs font-bold tracking-[0.25em] text-cyan-200">
          SAFETY CHECK
        </p>
        <h2 className="mt-2 text-xl font-bold text-white">Premium整合性</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm">
          <div className="digital-panel">
            <p className="digital-label">ローカル値</p>
            <p className="digital-number text-2xl">{safety.localUnlocked}</p>
            <p className="text-xs text-cyan-200">動詞</p>
          </div>
          <div className="digital-panel">
            <p className="digital-label">有効値</p>
            <p className="digital-number text-2xl">
              {safety.effectiveUnlocked}
            </p>
            <p className="text-xs text-cyan-200">動詞</p>
          </div>
          <div className="digital-panel">
            <p className="digital-label">更新元</p>
            <p className="mt-1 font-extrabold text-cyan-100">
              {sourceLabel(safety.source as PurchaseRecord["source"])}
            </p>
          </div>
          <div className="digital-panel">
            <p className="digital-label">状態</p>
            <p className="mt-1 font-extrabold text-cyan-100">
              {safety.isConsistent ? "正常" : "要確認"}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          最終更新：{formatDateTime(safety.updatedAt)}
        </p>
      </section>

      <section className="card p-5">
        <h2 className="text-xl font-bold">購入履歴</h2>
        {history.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-paper p-4 text-sm text-muted">
            まだ購入履歴はありません。無料プランで利用中です。
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {history.map((item) => (
              <article key={item.id} className="rounded-2xl bg-paper p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{item.planLabel}</p>
                    <p className="mt-1 text-sm text-muted">
                      {formatDateTime(item.createdAt)} /{" "}
                      {sourceLabel(item.source)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black">
                      {item.unlockedVerbCount || FREE_VERB_LIMIT}
                    </p>
                    <p className="text-xs text-muted">動詞</p>
                  </div>
                </div>
                <p className="mt-2 text-sm font-bold text-cyan-100">
                  ¥{item.purchaseTotalYen.toLocaleString()}
                </p>
                {item.note && (
                  <p className="mt-1 text-xs text-muted">{item.note}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {isAdmin && (
        <section className="card p-5">
          <h2 className="text-xl font-bold">管理者用テスト</h2>
          <p className="mt-2 text-sm text-muted">
            通常ユーザーには表示されません。正式決済前にロック・復元・履歴を確認するための操作です。
          </p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {[0, 30, 60, 90, 120].map((count) => (
              <button
                key={count}
                className="rounded-xl bg-paper px-3 py-2 text-sm font-bold"
                type="button"
                onClick={() => adminSetLevel(count)}
              >
                {count === 0 ? "無料" : count}
              </button>
            ))}
          </div>
        </section>
      )}

      <Link className="btn btn-soft block text-center" href="/profile">
        マイページへ戻る
      </Link>
      <p className="pb-4 text-center text-xs text-muted">
        Verb Master Version 48
      </p>
    </div>
  );
}
