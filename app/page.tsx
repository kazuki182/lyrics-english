"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getVerb, verbs } from "@/lib/data";
import VerbProgressPanel, { getTotalVerbProgress } from "@/components/VerbProgressPanel";
import {
  getCurrentProgress,
  getCurrentUsername,
  getDueReviewItems,
  getLearningPlan,
  getStudyDaysSetting,
  setStudyDaysSetting,
  getCurrentBookmark,
  getBookmarkSectionLabel,
  getLatestTestSession,
  getTestSectionLabel,
  getTestSessionHref,
  getTargetDate,
  initAdminAccount,
  logout,
  setTargetDate,
  type UserProgress
} from "@/lib/account";

function splitTarget(value: string) {
  if (!value) return { year: "----", day: "--.--" };
  const [year, month, day] = value.split("-");
  return { year: year ?? "----", day: `${month ?? "--"}.${day ?? "--"}` };
}

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [target, setTarget] = useState("");
  const [reviewCount, setReviewCount] = useState(0);
  const [saveMessage, setSaveMessage] = useState("");
  const [bookmark, setBookmark] = useState<ReturnType<typeof getCurrentBookmark>>(null);
  const [testSession, setTestSession] = useState<ReturnType<typeof getLatestTestSession>>(null);
  const [studyMode, setStudyMode] = useState<"everyday" | "weekdays" | "custom">("everyday");
  const [customDays, setCustomDays] = useState<number[]>([1, 2, 3, 4, 5]);

  useEffect(() => {
    initAdminAccount();
    const user = getCurrentUsername();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setUsername(user);
    setProgress(getCurrentProgress());
    setTarget(getTargetDate());
    setReviewCount(getDueReviewItems().length);
    setBookmark(getCurrentBookmark());
    setTestSession(getLatestTestSession());
    const savedStudyDays = getStudyDaysSetting();
    setStudyMode(savedStudyDays.mode);
    setCustomDays(savedStudyDays.days);
  }, []);

  if (!username || !progress) return <p className="text-muted">Loading...</p>;

  const completed = progress.studiedVerbIds.length;
  const plan = getLearningPlan(verbs.length, completed);
  const testVerb = testSession ? getVerb(testSession.verbId) : null;
  const bookmarkVerb = bookmark ? getVerb(bookmark.verbId) : null;
  const activeVerb = testVerb || bookmarkVerb || verbs.find((verb) => !progress.studiedVerbIds.includes(verb.id)) || verbs[0];
  const activeBookmark = testSession
    ? {
        verbId: testSession.verbId,
        section: "test" as const,
        label: `${activeVerb.word} ${getTestSectionLabel(testSession.section)}`,
        href: getTestSessionHref(testSession),
        itemTitle: `${Math.min(testSession.index + 1, testSession.itemIds.length)} / ${testSession.itemIds.length}問目`,
        itemIndex: testSession.index + 1,
        savedAt: testSession.updatedAt
      }
    : bookmark;
  const activeProgress = getTotalVerbProgress(activeVerb, progress, activeBookmark);
  const targetParts = splitTarget(plan.targetDate);
  const updateTarget = (value: string) => {
    setTarget(value);
    setSaveMessage("");
  };

  const saveTarget = () => {
    if (!target) return;
    setTargetDate(target);
    setProgress(getCurrentProgress());
    setSaveMessage("保存しました");
  };

  const updateStudyMode = (mode: "everyday" | "weekdays" | "custom", days = customDays) => {
    const nextDays = mode === "everyday" ? [0, 1, 2, 3, 4, 5, 6] : mode === "weekdays" ? [1, 2, 3, 4, 5] : days;
    setStudyMode(mode);
    setCustomDays(nextDays);
    setStudyDaysSetting({ mode, days: nextDays });
    setProgress(getCurrentProgress());
  };

  const toggleCustomDay = (day: number) => {
    const exists = customDays.includes(day);
    const next = exists ? customDays.filter((value) => value !== day) : [...customDays, day].sort((a, b) => a - b);
    const safeNext = next.length ? next : [day];
    updateStudyMode("custom", safeNext);
  };

  const paceMessage = plan.paceStatus === "ahead"
    ? `予定より${plan.paceDiff}動詞進んでいます`
    : plan.paceStatus === "behind"
      ? `予定より${Math.abs(plan.paceDiff)}動詞遅れています`
      : "予定通りです";

  const paceTone = plan.paceStatus === "ahead" ? "text-emerald-300" : plan.paceStatus === "behind" ? "text-amber-300" : "text-cyan-200";

  return (
    <div className="space-y-5 pb-28">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-muted">Know the verb. Use the verb.</p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight">Verb Master</h1>
          <p className="mt-2 text-sm text-muted">社会人向け・基本動詞トレーニング</p>
        </div>
        <button className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm" onClick={() => { logout(); window.location.href = "/login"; }}>ログアウト</button>
      </header>

      <section className="card p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted">{username}</p>
            <p className="mt-1 text-3xl font-bold">Lv.{progress.level}</p>
          </div>
          <div className="text-right text-sm text-muted">
            <p>XP <span className="font-bold text-ink">{progress.xp}</span></p>
            <p>Streak <span className="font-bold text-ink">{progress.currentStreak} days</span></p>
          </div>
        </div>
      </section>

      <section className="digital-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-cyan-200">LEARNING DASHBOARD</p>
            <p className="mt-2 text-sm text-slate-300">目標日と学習曜日から、必要なペースだけを自動計算します。</p>
          </div>
          <span className="rounded-full border border-cyan-300/30 px-3 py-1 text-xs font-bold text-cyan-100">{plan.progressPercent}%</span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
          <div className="digital-panel">
            <p className="digital-label">登録動詞</p>
            <p className="digital-number">{verbs.length}</p>
            <p className="text-xs text-cyan-200">語</p>
          </div>
          <div className="digital-panel">
            <p className="digital-label">習得済み</p>
            <p className="digital-number">{completed}</p>
            <p className="text-xs text-cyan-200">語</p>
          </div>
          <div className="digital-panel">
            <p className="digital-label">残り</p>
            <p className="digital-number">{plan.remaining}</p>
            <p className="text-xs text-cyan-200">語</p>
          </div>
        </div>

        <div className="mt-4 space-y-3 text-center">
          <div className="digital-panel digital-panel-wide">
            <p className="digital-label">目標日</p>
            <p className="target-date-line">{targetParts.year}/{targetParts.day.replace('.', '/')}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="digital-panel">
              <p className="digital-label">学習日数</p>
              <p className="digital-number">{plan.studyDaysLeft}</p>
              <p className="text-xs text-cyan-200">日</p>
            </div>
            <div className="digital-panel">
              <p className="digital-label">推奨ペース</p>
              <p className="daily-goal-main">1日{plan.dailyGoal}語</p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-cyan-200">PACE CHECK</p>
              <p className={`mt-2 text-lg font-extrabold ${paceTone}`}>{paceMessage}</p>
            </div>
            <div className="text-right text-xs text-slate-300">
              <p>予定目安</p>
              <p className="text-base font-bold text-white">{plan.expectedCompleted}語</p>
            </div>
          </div>
          {plan.paceStatus === "behind" && (
            <p className="mt-3 text-sm text-slate-300">焦らなくて大丈夫です。推奨ペース通り進めれば目標日に間に合います。</p>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-4">
          <p className="text-xs font-bold tracking-[0.18em] text-cyan-200">学習する曜日</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
            <button type="button" className={`rounded-xl px-3 py-2 font-bold ${studyMode === "everyday" ? "bg-cyan-300 text-slate-950" : "bg-slate-900 text-slate-200"}`} onClick={() => updateStudyMode("everyday")}>毎日</button>
            <button type="button" className={`rounded-xl px-3 py-2 font-bold ${studyMode === "weekdays" ? "bg-cyan-300 text-slate-950" : "bg-slate-900 text-slate-200"}`} onClick={() => updateStudyMode("weekdays")}>平日</button>
            <button type="button" className={`rounded-xl px-3 py-2 font-bold ${studyMode === "custom" ? "bg-cyan-300 text-slate-950" : "bg-slate-900 text-slate-200"}`} onClick={() => updateStudyMode("custom")}>曜日指定</button>
          </div>
          {studyMode === "custom" && (
            <div className="mt-3 grid grid-cols-7 gap-1 text-xs">
              {["日", "月", "火", "水", "木", "金", "土"].map((label, index) => (
                <button key={label} type="button" className={`rounded-lg py-2 font-bold ${customDays.includes(index) ? "bg-cyan-300 text-slate-950" : "bg-slate-900 text-slate-400"}`} onClick={() => toggleCustomDay(index)}>{label}</button>
              ))}
            </div>
          )}
          <p className="mt-3 text-sm text-slate-300">現在の設定：{plan.studyDayLabel}</p>
        </div>

        <div className="mt-5 block text-sm text-slate-300">
          <div className="flex items-center justify-between gap-3">
            <span>目標日を変更</span>
            {saveMessage && <span className="text-xs font-bold text-cyan-200">{saveMessage}</span>}
          </div>
          <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <input
              className="date-input-safe block min-w-0 w-full max-w-full box-border rounded-xl border border-cyan-300/20 bg-slate-950 px-3 py-3 text-center text-white"
              type="date"
              value={target}
              onChange={(e) => updateTarget(e.target.value)}
            />
            <button
              type="button"
              className="shrink-0 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950"
              onClick={saveTarget}
            >
              保存
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">変更後は保存ボタンを押すと反映されます。</p>
        </div>
      </section>

      <section className="resume-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-cyan-200">現在攻略中</p>
            <p className="mt-1 text-3xl font-extrabold uppercase">{activeVerb.word}</p>
            <p className="mt-1 text-sm text-slate-300">基本動詞・熟語・句動詞の進捗を合算</p>
          </div>
          <Link
            className="shrink-0 rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950"
            href={activeBookmark?.href ?? `/verbs/${activeVerb.id}`}
          >
            {testSession ? "テスト再開" : activeBookmark ? "続きから" : "開く"}
          </Link>
        </div>

        <div className="mt-4">
          <VerbProgressPanel verb={activeVerb} compact bookmarkOverride={activeBookmark} />
        </div>

        <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-slate-950/60 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-[0.16em] text-cyan-200">前回の続き</p>
              {activeBookmark ? (
                <p className="mt-1 truncate text-sm text-slate-300">
                  {testSession ? getTestSectionLabel(testSession.section) : getBookmarkSectionLabel(activeBookmark.section)}{activeBookmark.itemTitle ? ` / ${activeBookmark.itemTitle}` : ""}
                </p>
              ) : (
                <p className="mt-1 text-sm text-slate-300">まだしおりはありません。</p>
              )}
            </div>
            <p className="shrink-0 text-right text-sm font-bold text-cyan-100">達成率 {activeProgress}%</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3">
        <Link className="btn btn-primary block text-center text-base" href="/verbs">学習を始める</Link>
        {reviewCount > 0 && <Link className="btn btn-soft block text-center text-base" href="/review">復習する {reviewCount}問</Link>}
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Link className="card block p-5 font-bold" href="/verbs">動詞一覧</Link>
        <Link className="card block p-5 font-bold" href="/tests">瞬発英作文テスト</Link>
        <Link className="card block p-5 font-bold" href="/profile">進捗</Link>
        <Link className="card block p-5 font-bold" href="/study-method">勉強方法</Link>
        <Link className="card block p-5 font-bold" href="/phrase-book">フレーズ帳</Link>
      </section>

      <section className="card p-5">
        <p className="text-sm font-bold text-muted">コンセプト</p>
        <p className="mt-2 leading-relaxed">基本動詞を、型・例文・音声・瞬発英作文で使える形にします。</p>
        <Link className="mt-4 inline-block font-bold text-accent" href="/about">このアプリについて</Link>
      </section>
    </div>
  );
}
