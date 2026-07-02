"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getAccounts, getCurrentUsername } from "@/lib/account";
import { getAllVerbQualityAudits, getQualitySummary, type QualityLevel } from "@/lib/verbQuality";

type FilterKey = "all" | QualityLevel | "lowUsage" | "caps" | "placeholder" | "grammar";

function isAdminUser(username: string | null) {
  if (!username) return false;
  return getAccounts().some((account) => account.username === username && account.role === "admin");
}

function statusClass(status: QualityLevel) {
  if (status === "公開OK") return "bg-emerald-500/15 text-emerald-200 border-emerald-300/20";
  if (status === "確認中") return "bg-amber-500/15 text-amber-100 border-amber-300/20";
  return "bg-rose-500/15 text-rose-100 border-rose-300/20";
}

function issueClass(level: "high" | "medium" | "low") {
  if (level === "high") return "bg-rose-500/15 text-rose-100";
  if (level === "medium") return "bg-amber-500/15 text-amber-100";
  return "bg-slate-700/60 text-slate-200";
}

function MiniStat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/55 p-4">
      <p className="text-xs font-bold tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 text-3xl font-black text-cyan-100">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

function CheckRow({ ok, label, value }: { ok: boolean; label: string; value: string | number }) {
  return (
    <div className={`rounded-xl px-3 py-2 text-xs font-bold ${ok ? "bg-emerald-500/10 text-emerald-100" : "bg-amber-500/10 text-amber-100"}`}>
      <span>{ok ? "✓" : "要確認"}</span> <span>{label}</span> <span className="text-slate-100">{value}</span>
    </div>
  );
}

export default function VerbQualityAdminPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    setUsername(getCurrentUsername());
    setReady(true);
  }, []);

  const rows = useMemo(() => getAllVerbQualityAudits(), []);
  const summary = useMemo(() => getQualitySummary(rows), [rows]);
  const admin = ready && isAdminUser(username);

  const filteredRows = useMemo(() => {
    if (filter === "all") return rows;
    if (filter === "lowUsage") return rows.filter((row) => !row.usageCountOk);
    if (filter === "caps") return rows.filter((row) => !row.casingOk);
    if (filter === "placeholder") return rows.filter((row) => !row.placeholderOk);
    if (filter === "grammar") return rows.filter((row) => row.grammarNeedsManualReview);
    return rows.filter((row) => row.status === filter);
  }, [filter, rows]);

  if (!ready) return <p className="text-muted">読み込み中...</p>;

  if (!admin) {
    return (
      <div className="space-y-5">
        <h1 className="text-3xl font-black">動詞品質管理</h1>
        <section className="card p-5">
          <p className="text-lg font-bold">管理者専用ページです。</p>
          <p className="mt-2 text-sm text-muted">現在のアカウント：{username || "未ログイン"}</p>
          <Link href="/" className="btn btn-primary mt-5 inline-block">ホームへ戻る</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-10">
      <header className="space-y-2">
        <p className="text-sm font-bold tracking-[0.22em] text-cyan-200">ADMIN QUALITY CONTROL</p>
        <h1 className="text-3xl font-black">動詞品質チェック</h1>
        <p className="text-sm text-muted">有料アプリとして公開する前に、動詞ごとの不足・大文字表記・仮文・テスト文を管理します。</p>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <Link className="rounded-full bg-paper px-3 py-2 text-cyan-100" href="/admin">管理画面へ戻る</Link>
          <Link className="rounded-full bg-paper px-3 py-2 text-cyan-100" href="/verbs">動詞一覧を確認</Link>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="動詞数" value={summary.total} sub="現在の登録数" />
        <MiniStat label="修正必要" value={summary.needsFix} sub="高優先度あり" />
        <MiniStat label="確認中" value={summary.checking} sub="中優先度あり" />
        <MiniStat label="平均品質" value={`${summary.averageScore}%`} sub="自動監査ベース" />
      </section>

      <section className="rounded-3xl border border-cyan-300/15 bg-slate-950/60 p-5">
        <h2 className="text-xl font-black">確認ルール</h2>
        <div className="mt-4 grid gap-2 text-sm text-slate-200 md:grid-cols-2">
          <p className="rounded-2xl bg-paper p-3">基本の使い方は5〜10種類。自然なら10種類に近づける。</p>
          <p className="rounded-2xl bg-paper p-3">各使い方にビジネス例文3つ。Premium用日常例文2つ。</p>
          <p className="rounded-2xl bg-paper p-3">句動詞も最大10種類を目標。無理な水増しはしない。</p>
          <p className="rounded-2xl bg-paper p-3">大文字だけの英語、仮文、自動生成っぽい文を残さない。</p>
          <p className="rounded-2xl bg-paper p-3">テスト日本語は主語・時制・目的語が分かる文にする。</p>
          <p className="rounded-2xl bg-paper p-3">SV/SVO/SVC/SVOCは手動確認済み以外、ユーザー画面に出さない。</p>
        </div>
      </section>

      {summary.duplicateWords.length > 0 && (
        <section className="rounded-3xl border border-rose-300/20 bg-rose-950/25 p-5">
          <h2 className="text-xl font-black text-rose-100">重複動詞あり</h2>
          <p className="mt-2 text-sm text-rose-100/80">{summary.duplicateWords.map((item) => `${item.word}: #${item.ranks.join("/#")}`).join(" / ")}</p>
        </section>
      )}

      <section className="rounded-3xl border border-cyan-300/15 bg-slate-950/60 p-3">
        <div className="flex gap-2 overflow-x-auto pb-1 text-sm font-bold">
          {[
            ["all", "すべて"],
            ["修正必要", "修正必要"],
            ["確認中", "確認中"],
            ["公開OK", "公開OK"],
            ["lowUsage", "使い方不足"],
            ["caps", "大文字"],
            ["placeholder", "仮文"],
            ["grammar", "構造要確認"]
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key as FilterKey)}
              className={`shrink-0 rounded-2xl px-4 py-2 ${filter === key ? "bg-cyan-300 text-slate-950" : "bg-paper text-slate-200"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        {filteredRows.map((row) => (
          <article key={row.verb.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-bold text-muted">#{row.verb.rank} / {row.accessLabel}</p>
                <h2 className="mt-1 text-2xl font-black">{row.verb.word.toLowerCase()}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{row.verb.core}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-3xl font-black text-cyan-100">{row.score}%</p>
                <span className={`mt-1 inline-block rounded-full border px-3 py-1 text-xs font-bold ${statusClass(row.status)}`}>{row.status}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
              <CheckRow ok={row.usageCountOk} label="使い方" value={`${row.usageCount}/10`} />
              <CheckRow ok={row.businessExamplesOk} label="仕事例文" value={`${row.businessExampleTotal}`} />
              <CheckRow ok={row.premiumDailyExamplesOk} label="日常例文" value={`${row.premiumDailyExampleTotal}`} />
              <CheckRow ok={row.testsOk} label="テスト" value={`${row.testTotal}`} />
              <CheckRow ok={row.phrasalOk} label="句動詞" value={`${row.phrasalCount}/10`} />
              <CheckRow ok={row.casingOk} label="大文字" value={row.casingOk ? "OK" : "要修正"} />
              <CheckRow ok={row.placeholderOk} label="仮文" value={row.placeholderOk ? "OK" : "要修正"} />
            </div>

            {row.issues.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {row.issues.slice(0, 8).map((issue, index) => (
                  <span key={`${issue.label}-${index}`} className={`rounded-full px-3 py-1 text-xs font-bold ${issueClass(issue.level)}`} title={issue.detail}>
                    {issue.label}
                  </span>
                ))}
              </div>
            )}

            <details className="mt-4 rounded-2xl border border-white/10 bg-slate-950/35 p-3">
              <summary className="cursor-pointer text-sm font-bold text-cyan-100">詳細を見る</summary>
              <div className="mt-3 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-paper p-3"><p className="text-muted">Basic</p><p className="text-lg font-black">{row.basicTestTotal}</p></div>
                  <div className="rounded-xl bg-paper p-3"><p className="text-muted">Phrasal</p><p className="text-lg font-black">{row.phrasalTestTotal}</p></div>
                </div>
                <ul className="space-y-2">
                  {row.issues.map((issue, index) => (
                    <li key={`${issue.label}-detail-${index}`} className="rounded-xl bg-paper p-3">
                      <p className="font-bold">{issue.label}</p>
                      <p className="mt-1 text-xs text-muted">{issue.detail}</p>
                    </li>
                  ))}
                </ul>
                <Link className="btn btn-soft inline-block" href={`/verbs/${row.verb.id}`}>学習ページで確認</Link>
              </div>
            </details>
          </article>
        ))}
      </section>
    </div>
  );
}
