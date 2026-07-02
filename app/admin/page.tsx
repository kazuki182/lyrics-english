"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  formatDateTime,
  getAccounts,
  getAllProgress,
  getComputedBadges,
  getCurrentUsername,
  getDueReviewItems,
  getFutureReviewItems,
  setUserUnlockLevel,
  type Account,
  type UserProgress,
} from "@/lib/account";
import { verbs, testItems, type Verb } from "@/lib/data";
import { PAYMENT_PLANS, getPaymentReadiness } from "@/lib/paymentConfig";

type AdminTab = "dashboard" | "verbs" | "users" | "payments";

type VerbQuality = {
  verb: Verb;
  coreOk: boolean;
  meaningsOk: boolean;
  workExamplesOk: boolean;
  dailyExamplesOk: boolean;
    phrasalOk: boolean;
  testsOk: boolean;
  score: number;
  missing: string[];
  accessLabel: string;
};

function isAdmin(accounts: Account[], username: string | null) {
  if (!username) return false;
  return accounts.some((account) => account.username === username && account.role === "admin");
}

function percent(okCount: number, total: number) {
  return Math.round((okCount / total) * 100);
}

function checkVerbQuality(verb: Verb): VerbQuality {
  const missing: string[] = [];
  const coreOk = Boolean(verb.core && verb.coreDetail);
  if (!coreOk) missing.push("コアイメージ");

  const meaningsOk = verb.meanings.length >= 10;
  if (!meaningsOk) missing.push(`基本 ${verb.meanings.length}/10`);

  const workExamplesOk = verb.meanings.every((meaning) => meaning.examples.length >= 3);
  if (!workExamplesOk) missing.push("仕事例文3つ");

  const dailyExamplesOk = verb.meanings.every((meaning) => (meaning.dailyExamples || []).length >= 2);
  if (!dailyExamplesOk) missing.push("日常例文2つ");

  const phrasalOk =
    verb.phrasalVerbs.length >= 10 &&
    verb.phrasalVerbs.slice(0, 10).every((item) => item.examples.length >= 3);
  if (!phrasalOk) missing.push(`句動詞 ${verb.phrasalVerbs.length}/10`);

  const testsOk = testItems.some((item) => item.verbId === verb.id && item.section === "basic") &&
    testItems.some((item) => item.verbId === verb.id && item.section === "phrasal");
  if (!testsOk) missing.push("テスト");

  const checks = [coreOk, meaningsOk, workExamplesOk, dailyExamplesOk, phrasalOk, testsOk];
  const score = percent(checks.filter(Boolean).length, checks.length);
  const accessLabel = verb.rank <= 3 ? "無料" : verb.rank <= 30 ? "30語" : verb.rank <= 60 ? "60語" : verb.rank <= 90 ? "90語" : "120語";

  return {
    verb,
    coreOk,
    meaningsOk,
    workExamplesOk,
    dailyExamplesOk,
    phrasalOk,
    testsOk,
    score,
    missing,
    accessLabel,
  };
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-bold tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-2 text-3xl font-black text-cyan-100">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

function QualityPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${ok ? "bg-emerald-500/15 text-emerald-200" : "bg-amber-500/15 text-amber-200"}`}>
      {ok ? "✓" : "要確認"} {label}
    </span>
  );
}

export default function AdminPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [progressRows, setProgressRows] = useState<UserProgress[]>([]);
  const [tab, setTab] = useState<AdminTab>("dashboard");

  const updateUnlock = (targetUsername: string, count: number) => {
    setUserUnlockLevel(targetUsername, count);
    setProgressRows(getAllProgress());
  };

  useEffect(() => {
    const current = getCurrentUsername();
    const accountRows = getAccounts();
    setUsername(current);
    setAccounts(accountRows);
    setProgressRows(getAllProgress());
    if (!current) {
      window.location.href = "/login";
    }
  }, []);

  const qualityRows = useMemo(() => verbs.map(checkVerbQuality), []);
  const admin = isAdmin(accounts, username);
  const paidUsers = progressRows.filter((progress) => (progress.purchaseTotalYen || 0) > 0).length;
  const totalSales = progressRows.reduce((sum, progress) => sum + (progress.purchaseTotalYen || 0), 0);
  const averageQuality = qualityRows.length
    ? Math.round(qualityRows.reduce((sum, row) => sum + row.score, 0) / qualityRows.length)
    : 0;
  const readyCount = qualityRows.filter((row) => row.score >= 100).length;
  const reviewCount = admin ? getDueReviewItems().length : 0;
  const futureReviewCount = admin ? getFutureReviewItems().length : 0;

  if (!username) return <p className="text-muted">読み込み中...</p>;

  if (!admin) {
    return (
      <div className="space-y-5">
        <h1 className="text-3xl font-bold">管理画面</h1>
        <section className="card p-5">
          <p className="text-lg font-bold">管理者専用ページです。</p>
          <p className="mt-2 text-sm text-muted">現在のアカウント：{username}</p>
          <Link className="btn btn-primary mt-5 inline-block" href="/">ホームへ戻る</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      <header className="space-y-2">
        <p className="text-sm font-bold tracking-[0.2em] text-cyan-200">ADMIN DASHBOARD</p>
        <h1 className="text-3xl font-black">管理画面</h1>
        <p className="text-sm text-muted">教材品質・ユーザー状況・Premium管理の土台です。</p>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <Link className="rounded-full bg-paper px-3 py-2 text-cyan-100" href="/admin/verb-quality">動詞品質チェック</Link>
          <Link className="rounded-full bg-paper px-3 py-2 text-cyan-100" href="/verbs">動詞一覧</Link>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-2 rounded-2xl bg-slate-950/70 p-2 text-center text-sm font-bold">
        <button className={`rounded-xl px-3 py-2 ${tab === "dashboard" ? "bg-cyan-300 text-slate-950" : "text-slate-200"}`} onClick={() => setTab("dashboard")}>概要</button>
        <button className={`rounded-xl px-3 py-2 ${tab === "verbs" ? "bg-cyan-300 text-slate-950" : "text-slate-200"}`} onClick={() => setTab("verbs")}>動詞</button>
        <button className={`rounded-xl px-3 py-2 ${tab === "users" ? "bg-cyan-300 text-slate-950" : "text-slate-200"}`} onClick={() => setTab("users")}>ユーザー</button>
        <button className={`rounded-xl px-3 py-2 ${tab === "payments" ? "bg-cyan-300 text-slate-950" : "text-slate-200"}`} onClick={() => setTab("payments")}>決済</button>
      </div>

      {tab === "dashboard" && (
        <>
          <section className="grid grid-cols-2 gap-3">
            <StatCard label="登録ユーザー" value={accounts.length} sub="ローカル保存ベース" />
            <StatCard label="有料ユーザー" value={paidUsers} sub="購入額あり" />
            <StatCard label="売上" value={`¥${totalSales.toLocaleString()}`} sub="手動付与含む" />
            <StatCard label="教材完成度" value={`${averageQuality}%`} sub={`${readyCount}/${verbs.length} 動詞 完成`} />
            <StatCard label="復習対象" value={reviewCount} sub={`復習予定 ${futureReviewCount}問`} />
            <StatCard label="テスト数" value={testItems.length} sub="全動詞合計" />
          </section>

          <section className="digital-card p-5">
            <p className="text-xs font-bold tracking-[0.25em] text-cyan-200">QUALITY CHECK</p>
            <h2 className="mt-2 text-2xl font-black">公開前チェック</h2>
            <div className="mt-4 space-y-3">
              {qualityRows.slice(0, 8).map((row) => (
                <div key={row.verb.id} className="rounded-2xl border border-cyan-300/15 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-cyan-200">#{row.verb.rank} {row.accessLabel}</p>
                      <p className="text-xl font-black">{row.verb.word}</p>
                    </div>
                    <p className="text-2xl font-black text-cyan-100">{row.score}%</p>
                  </div>
                  {row.missing.length > 0 && <p className="mt-2 text-xs text-amber-200">要確認：{row.missing.join(" / ")}</p>}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {tab === "verbs" && (
        <section className="space-y-3">
          {qualityRows.map((row) => (
            <article key={row.verb.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-muted">#{row.verb.rank} / {row.accessLabel}</p>
                  <h2 className="mt-1 text-2xl font-black">{row.verb.word}</h2>
                  <p className="mt-1 text-sm text-muted">{row.verb.core}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-cyan-100">{row.score}%</p>
                  <p className="text-xs text-muted">完成度</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <QualityPill ok={row.coreOk} label="コアイメージ" />
                <QualityPill ok={row.meaningsOk} label="基本10個" />
                <QualityPill ok={row.workExamplesOk} label="仕事例文" />
                <QualityPill ok={row.dailyExamplesOk} label="日常例文" />
                <QualityPill ok={row.phrasalOk} label="句動詞" />
                <QualityPill ok={row.testsOk} label="テスト" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl bg-paper p-3"><p className="text-muted">基本</p><p className="text-lg font-black">{row.verb.meanings.length}</p></div>
                <div className="rounded-xl bg-paper p-3"><p className="text-muted">句動詞</p><p className="text-lg font-black">{row.verb.phrasalVerbs.length}</p></div>
              </div>
              <Link className="btn btn-soft mt-4 inline-block" href={`/verbs/${row.verb.id}`}>学習ページを確認</Link>
            </article>
          ))}
        </section>
      )}

      {tab === "payments" && (
        <section className="space-y-4">
          <div className="digital-card p-5">
            <p className="text-xs font-bold tracking-[0.25em] text-cyan-200">PAYMENT READINESS</p>
            <h2 className="mt-2 text-2xl font-black">Stripe本番決済準備</h2>
            {(() => {
              const readiness = getPaymentReadiness();
              return (
                <div className="mt-4 grid gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-950/50 p-3 font-bold">モード：{readiness.modeLabel}</div>
                  <div className="rounded-2xl bg-slate-950/50 p-3 font-bold">公開キー：{readiness.publishableKeyReady ? "設定済み" : "未設定"}</div>
                  <div className="rounded-2xl bg-slate-950/50 p-3 font-bold">Price ID：{readiness.priceIdsReady ? "設定済み" : "未設定あり"}</div>
                  {!readiness.priceIdsReady && <p className="rounded-2xl bg-amber-950/30 p-3 text-xs font-bold text-amber-100">未設定：{readiness.missingPublicPriceIds.join(" / ")}</p>}
                </div>
              );
            })()}
          </div>

          <div className="card p-5">
            <h2 className="text-xl font-bold">Webhook確認</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-2xl bg-paper p-4 font-bold">Webhook URL：/api/stripe/webhook</div>
              <div className="rounded-2xl bg-paper p-4 font-bold">未登録でもOK：今は仮購入モードで開発できます</div>
              <div className="rounded-2xl bg-amber-950/30 p-4 text-xs font-bold text-amber-100">Stripe登録後に STRIPE_WEBHOOK_SECRET と SUPABASE_SERVICE_ROLE_KEY をVercelへ設定します。</div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-xl font-bold">Stripeプラン定義</h2>
            <div className="mt-4 grid gap-3">
              {PAYMENT_PLANS.map((plan) => (
                <div key={plan.planId} className="rounded-2xl bg-paper p-4 text-sm">
                  <p className="font-black">{plan.label} / ¥{plan.price.toLocaleString()}</p>
                  <p className="mt-1 text-xs text-muted">{plan.planId} / {plan.range}動詞 / {plan.stripePriceId ? "Price ID設定済み" : `${plan.stripePriceEnvName} 未設定`}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-xl font-bold">ユーザー購入状態</h2>
            <div className="mt-4 space-y-3">
              {progressRows.map((progress) => (
                <div key={progress.username} className="rounded-2xl bg-paper p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black">{progress.username}</p>
                      <p className="text-xs text-muted">source: {progress.premiumSource || "未記録"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-cyan-100">{progress.unlockedVerbCount || 0}動詞</p>
                      <p className="text-xs text-muted">¥{(progress.purchaseTotalYen || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted">購入履歴：{progress.purchaseHistory?.length || 0}件 / 更新：{formatDateTime(progress.premiumUpdatedAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {tab === "users" && (
        <section className="space-y-3">
          {progressRows.map((progress) => {
            const account = accounts.find((item) => item.username === progress.username);
            const badges = getComputedBadges(progress);
            const inactiveDays = progress.lastLoginAt
              ? Math.floor((Date.now() - new Date(progress.lastLoginAt).getTime()) / 86400000)
              : null;
            return (
              <article key={progress.username} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-muted">{account?.role === "admin" ? "管理者" : "ユーザー"}</p>
                    <h2 className="mt-1 text-2xl font-black">{progress.username}</h2>
                    <p className="mt-1 text-sm text-muted">最終ログイン：{formatDateTime(progress.lastLoginAt)}</p>
                    <p className="mt-1 text-xs text-muted">未ログイン日数：{inactiveDays == null ? "未記録" : `${inactiveDays}日`}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-cyan-100">Lv.{progress.level}</p>
                    <p className="text-sm font-bold">{progress.xp} XP</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-paper p-3"><p className="text-muted">習得</p><p className="text-lg font-black">{progress.studiedVerbIds.length}</p></div>
                  <div className="rounded-xl bg-paper p-3"><p className="text-muted">継続</p><p className="text-lg font-black">{progress.currentStreak}日</p></div>
                  <div className="rounded-xl bg-paper p-3"><p className="text-muted">購入額</p><p className="text-lg font-black">¥{(progress.purchaseTotalYen || 0).toLocaleString()}</p></div>
                </div>
                <div className="mt-3 rounded-2xl border border-cyan-300/20 bg-slate-950/40 p-3">
                  <p className="text-xs font-bold text-cyan-200">Premium手動付与</p>
                  <div className="mt-2 grid grid-cols-5 gap-2 text-xs">
                    {[0, 30, 60, 90, 120].map((count) => (
                      <button key={count} className="rounded-xl bg-paper px-2 py-2 font-bold" onClick={() => updateUnlock(progress.username, count)}>
                        {count === 0 ? "無料" : count}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-paper p-3"><p className="text-muted">しおり</p><p className="font-bold">{progress.bookmark ? `${progress.bookmark.verbId.toUpperCase()} / ${progress.bookmark.label}` : "なし"}</p></div>
                  <div className="rounded-xl bg-paper p-3"><p className="text-muted">苦手問題</p><p className="font-bold">{progress.weakItems.length}問</p></div>
                  <div className="rounded-xl bg-paper p-3"><p className="text-muted">保存フレーズ</p><p className="font-bold">{progress.savedPhrases?.length || 0}件</p></div>
                  <div className="rounded-xl bg-paper p-3"><p className="text-muted">バッジ</p><p className="font-bold">{badges.length}個</p></div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
