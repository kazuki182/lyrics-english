"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getVerb, verbs } from "@/lib/data";
import VerbProgressPanel, {
  getTotalVerbProgress,
} from "@/components/VerbProgressPanel";
import { HOME_NEWS } from "@/lib/news";
import { restoreLearningDataFromSupabase, syncCurrentUserToSupabase } from "@/lib/cloudSync";
import {
  getComputedBadges,
  getCurrentProgress,
  getCurrentUsername,
  getDueReviewItems,
  getLearningPlan,
  getSeasonRankSummary,
  getEffectiveUnlockedVerbCount,
  getStudyDaysSetting,
  setStudyDaysSetting,
  getStudyPaceSetting,
  setStudyPaceSetting,
  getCurrentBookmark,
  getBookmarkSectionLabel,
  getLatestTestSession,
  getTestSectionLabel,
  getTestSessionHref,
  getTargetDate,
  initAdminAccount,
  logout,
  setTargetDate,
  type UserProgress,
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
  const [bookmark, setBookmark] =
    useState<ReturnType<typeof getCurrentBookmark>>(null);
  const [testSession, setTestSession] =
    useState<ReturnType<typeof getLatestTestSession>>(null);
  const [studyMode, setStudyMode] = useState<
    "everyday" | "weekdays" | "custom"
  >("everyday");
  const [customDays, setCustomDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [paceDays, setPaceDays] = useState("3");
  const [paceVerbs, setPaceVerbs] = useState("1");
  const [paceSaveMessage, setPaceSaveMessage] = useState("");
  const [paceSaving, setPaceSaving] = useState(false);
  const [isPaceEditing, setIsPaceEditing] = useState(false);
  const [isTargetEditing, setIsTargetEditing] = useState(false);
  const [showBadgeSheet, setShowBadgeSheet] = useState(false);

  useEffect(() => {
    initAdminAccount();
    const user = getCurrentUsername();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const loadLocalState = () => {
      setUsername(user);
      setProgress(getCurrentProgress());
      setTarget(getTargetDate());
      setReviewCount(getDueReviewItems().length);
      setBookmark(getCurrentBookmark());
      setTestSession(getLatestTestSession());
      const savedStudyDays = getStudyDaysSetting();
      setStudyMode(savedStudyDays.mode);
      setCustomDays(savedStudyDays.days);
      const savedPace = getStudyPaceSetting();
      setPaceDays(String(savedPace.days));
      setPaceVerbs(String(savedPace.verbs));
    };

    loadLocalState();
    void restoreLearningDataFromSupabase(user)
      .then(() => loadLocalState())
      .catch(() => undefined);
  }, []);

  if (!username || !progress) return <p className="text-muted">Loading...</p>;

  const unlockedVerbTotal = Math.min(verbs.length, getEffectiveUnlockedVerbCount());
  const learningTargetVerbs = verbs.slice(0, unlockedVerbTotal);
  const learningTargetIds = new Set(learningTargetVerbs.map((verb) => verb.id));
  const completed = progress.studiedVerbIds.filter((verbId) =>
    learningTargetIds.has(verbId),
  ).length;
  const plan = getLearningPlan(unlockedVerbTotal, completed);
  const testVerb = testSession ? getVerb(testSession.verbId) : null;
  const bookmarkVerb = bookmark ? getVerb(bookmark.verbId) : null;
  const activeVerb =
    testVerb ||
    bookmarkVerb ||
    learningTargetVerbs.find((verb) => !progress.studiedVerbIds.includes(verb.id)) ||
    learningTargetVerbs[0] ||
    verbs[0];
  const activeBookmark = testSession
    ? {
        verbId: testSession.verbId,
        section: "test" as const,
        label: `${activeVerb.word} ${getTestSectionLabel(testSession.section)}`,
        href: getTestSessionHref(testSession),
        itemTitle: `${Math.min(testSession.index + 1, testSession.itemIds.length)} / ${testSession.itemIds.length}問目`,
        itemIndex: testSession.index + 1,
        savedAt: testSession.updatedAt,
      }
    : bookmark;
  const activeProgress = getTotalVerbProgress(
    activeVerb,
    progress,
    activeBookmark,
  );
  const targetParts = splitTarget(plan.targetDate);
  const updateTarget = (value: string) => {
    setTarget(value);
    setSaveMessage("");
  };

  const saveTarget = async () => {
    if (!target) return;
    setTargetDate(target);
    const latest = getCurrentProgress();
    setProgress(latest);
    setSaveMessage("保存しました。クラウドへ反映中...");
    setIsTargetEditing(false);
    if (latest) {
      const result = await syncCurrentUserToSupabase(latest);
      setSaveMessage(result.stats === "saved" ? "目標日をクラウド保存しました" : "端末に保存しました。クラウド保存は要確認です");
    }
    window.setTimeout(() => setSaveMessage(""), 3000);
  };

  const updateStudyMode = (
    mode: "everyday" | "weekdays" | "custom",
    days = customDays,
  ) => {
    const nextDays =
      mode === "everyday"
        ? [0, 1, 2, 3, 4, 5, 6]
        : mode === "weekdays"
          ? [1, 2, 3, 4, 5]
          : days;
    setStudyMode(mode);
    setCustomDays(nextDays);
    setStudyDaysSetting({ mode, days: nextDays });
    const latest = getCurrentProgress();
    setProgress(latest);
    if (latest) void syncCurrentUserToSupabase(latest);
  };

  const toggleCustomDay = (day: number) => {
    const exists = customDays.includes(day);
    const next = exists
      ? customDays.filter((value) => value !== day)
      : [...customDays, day].sort((a, b) => a - b);
    const safeNext = next.length ? next : [day];
    updateStudyMode("custom", safeNext);
  };

  const cancelStudyPaceEdit = () => {
    const savedPace = getStudyPaceSetting();
    setPaceDays(String(savedPace.days));
    setPaceVerbs(String(savedPace.verbs));
    setPaceSaveMessage("");
    setIsPaceEditing(false);
  };

  const parsePositiveNumber = (value: string) => Math.max(1, Number(value) || 1);

  const saveStudyPace = () => {
    const nextDays = parsePositiveNumber(paceDays);
    const nextVerbs = parsePositiveNumber(paceVerbs);
    setPaceDays(String(nextDays));
    setPaceVerbs(String(nextVerbs));
    setPaceSaving(true);
    setStudyPaceSetting({ days: nextDays, verbs: nextVerbs });
    const latest = getCurrentProgress();
    setProgress(latest);
    if (latest) void syncCurrentUserToSupabase(latest);
    setPaceSaveMessage("学習ペースを保存しました");
    setIsPaceEditing(false);
    window.setTimeout(() => setPaceSaving(false), 350);
    window.setTimeout(() => setPaceSaveMessage(""), 2500);
  };

  const cancelTargetEdit = () => {
    setTarget(getTargetDate());
    setSaveMessage("");
    setIsTargetEditing(false);
  };

  const paceMessage =
    plan.paceStatus === "ahead"
      ? `予定より${plan.paceDiff}動詞進んでいます`
      : plan.paceStatus === "behind"
        ? `予定より${Math.abs(plan.paceDiff)}動詞遅れています`
        : "予定通りです";

  const paceTone =
    plan.paceStatus === "ahead"
      ? "text-emerald-300"
      : plan.paceStatus === "behind"
        ? "text-amber-300"
        : "text-cyan-200";
  const selectedPaceTone =
    plan.selectedPaceStatus === "ok" ? "text-emerald-300" : "text-amber-300";
  const selectedPaceSummary =
    plan.selectedPaceStatus === "ok"
      ? "このペースなら目標日に間に合います。"
      : "このペースだと目標日に間に合いません。";
  const selectedPaceResult =
    plan.selectedPaceStatus === "ok"
      ? `残り${plan.remaining}語に対して、目標日までに最大${plan.selectedPaceCapacity}語まで学習できます。`
      : `目標日までに学習できる見込みは${plan.selectedPaceCapacity}語です。残り${plan.remaining}語なので、あと${Math.abs(plan.selectedPaceDiff)}語分ペースアップが必要です。`;
  const recommendedAction =
    plan.selectedPaceStatus === "ok"
      ? "今の設定のまま進めれば大丈夫です。"
      : `${plan.recommendedPaceLabel}に近づけると、目標に間に合いやすくなります。`;
  const badges = getComputedBadges(progress);
  const nextLevelXp = progress.level * 100;
  const xpToNextLevel = Math.max(0, nextLevelXp - (progress.xp || 0));
  const displayName = progress.displayName || username;
  const seasonSummary = getSeasonRankSummary(username);
  const leagueLine = seasonSummary?.total
    ? `${seasonSummary.season.label} / XP ${seasonSummary.xpRank}位`
    : seasonSummary?.season.label ?? "リーグ未参加";

  return (
    <div className="space-y-5 pb-28">
      <header className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-muted">Know the verb. Use the verb.</p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight">
            Verb Master
          </h1>
          <p className="mt-2 text-sm text-muted">
            社会人向け・基本動詞トレーニング
          </p>
        </div>
      </header>

      {HOME_NEWS.enabled && HOME_NEWS.text && (
        HOME_NEWS.href ? (
          <Link
            className="block rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-100"
            href={HOME_NEWS.href}
          >
            新着：{HOME_NEWS.text}
          </Link>
        ) : (
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-100">
            新着：{HOME_NEWS.text}
          </div>
        )
      )}

      <section className="home-level-card p-4">
        <div className="flex items-center gap-4">
          <Link
            className="home-level-avatar flex h-[106px] w-[106px] shrink-0 items-center justify-center overflow-hidden rounded-[26px] border border-cyan-300/30 bg-slate-900 text-4xl shadow-lg"
            href="/profile"
            aria-label="マイページを開く"
          >
            {progress.avatarDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={progress.avatarDataUrl} alt="プロフィール画像" className="h-full w-full object-cover" />
            ) : (
              <span>👤</span>
            )}
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white/95">{displayName}</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="home-level-main">Lv.{progress.level}</p>
              <button
                className="home-badge-pill"
                type="button"
                onClick={() => setShowBadgeSheet(true)}
                aria-label="獲得バッジの詳細を開く"
              >
                🏅 {badges.length}
              </button>
            </div>
            <p className="mt-1 text-xs font-bold text-cyan-100">{leagueLine}</p>
            <div className="mt-2 space-y-0.5 leading-tight">
              <p className="text-base font-extrabold leading-tight text-white">XP {progress.xp}</p>
              <p className="text-xs font-bold text-cyan-100">次のレベルまで {xpToNextLevel} XP</p>
              <p className="text-xs font-bold text-slate-300">連続学習 <span className="text-white">{progress.currentStreak}日</span></p>
            </div>
          </div>
        </div>
      </section>


      {showBadgeSheet && (
        <div className="fixed inset-0 z-[80] flex items-end bg-black/55 px-4 pb-4" onClick={() => setShowBadgeSheet(false)}>
          <div
            className="mx-auto w-full max-w-xl rounded-t-3xl border border-cyan-300/20 bg-slate-950 p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-600" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-cyan-200">BADGES</p>
                <h2 className="mt-1 text-2xl font-extrabold text-white">獲得バッジ</h2>
                <p className="mt-1 text-sm text-slate-300">レベルカード内のバッジ詳細です。</p>
              </div>
              <button
                className="rounded-full border border-cyan-300/20 px-3 py-1.5 text-sm font-bold text-cyan-100"
                type="button"
                onClick={() => setShowBadgeSheet(false)}
              >
                閉じる
              </button>
            </div>
            <div className="mt-4 grid gap-2">
              {badges.length ? badges.map((badge) => (
                <div key={badge} className="rounded-2xl border border-cyan-300/15 bg-slate-900/80 px-4 py-3 text-sm font-bold text-cyan-50">
                  {badge}
                </div>
              )) : (
                <p className="rounded-2xl border border-cyan-300/15 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                  まだ獲得バッジはありません。
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <section className="resume-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-cyan-200">現在攻略中</p>
            <p className="mt-1 text-3xl font-extrabold uppercase">
              {activeVerb.word}
            </p>
            <p className="mt-1 text-sm text-slate-300">
              基本・句動詞の進捗を合算
            </p>
          </div>
          <Link
            className="shrink-0 rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950"
            href={activeBookmark?.href ?? `/verbs/${activeVerb.id}`}
          >
            {testSession ? "テスト再開" : activeBookmark ? "続きから" : "開く"}
          </Link>
        </div>

        <div className="mt-4">
          <VerbProgressPanel
            verb={activeVerb}
            compact
            bookmarkOverride={activeBookmark}
          />
        </div>

        <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-slate-950/60 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-[0.16em] text-cyan-200">
                前回の続き
              </p>
              {activeBookmark ? (
                <p className="mt-1 truncate text-sm text-slate-300">
                  {testSession
                    ? getTestSectionLabel(testSession.section)
                    : getBookmarkSectionLabel(activeBookmark.section)}
                  {activeBookmark.itemTitle
                    ? ` / ${activeBookmark.itemTitle}`
                    : ""}
                </p>
              ) : (
                <p className="mt-1 text-sm text-slate-300">
                  まだしおりはありません。
                </p>
              )}
            </div>
            <p className="shrink-0 text-right text-sm font-bold text-cyan-100">
              達成率 {activeProgress}%
            </p>
          </div>
        </div>
      </section>

      <section className="digital-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-cyan-200">
              DASHBOARD
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-white">学習状況</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              隙間時間に必要な情報だけを表示します。
            </p>
          </div>
          <span className="rounded-full border border-cyan-300/30 px-3 py-1 text-xs font-bold text-cyan-100">
            {plan.progressPercent}%
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
          <div className="digital-panel">
            <p className="digital-label">登録動詞</p>
            <p className="digital-number">{unlockedVerbTotal}</p>
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

        <div className="mt-4 grid grid-cols-1 gap-3 text-center">
          <div className="digital-panel digital-panel-wide">
            <p className="digital-label">学習日数</p>
            <p className="digital-number">{plan.studyDaysLeft}</p>
            <p className="text-xs text-cyan-200">日</p>
          </div>
        </div>

      </section>

      <section className="card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-cyan-200">目標日設定</p>
            <h2 className="mt-1 text-2xl font-extrabold text-white">{targetParts.year}/{targetParts.day.replace(".", "/")}</h2>
            <p className="mt-1 text-sm text-slate-300">目標日と学習ペースをここで調整します。</p>
          </div>
          <span className="rounded-full border border-cyan-300/20 px-3 py-1 text-xs font-bold text-cyan-100">残り {plan.remaining}語</span>
        </div>
        <details className="mt-4 rounded-2xl border border-cyan-300/15 bg-slate-950/55 p-4 text-sm text-slate-300">
          <summary className="cursor-pointer font-bold text-cyan-100">目標日を変更する</summary>
          <div className="mt-3 rounded-2xl border border-cyan-300/10 bg-slate-950/60 p-3">
            <input
              className="date-input-safe block min-w-0 w-full max-w-full box-border rounded-xl border border-cyan-300/20 bg-slate-950 px-3 py-3 text-center text-white"
              type="date"
              value={target}
              onChange={(e) => updateTarget(e.target.value)}
            />
            <button
              type="button"
              className="mt-3 w-full rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950"
              onClick={saveTarget}
            >
              保存
            </button>
            {saveMessage && (
              <p className="mt-2 text-xs font-bold text-cyan-200">
                ✅ {saveMessage}
              </p>
            )}
          </div>
        </details>
      </section>

      <section className="grid grid-cols-1 gap-3">
        {reviewCount > 0 && (
          <Link
            className="card block border-cyan-300/40 bg-cyan-300/10 p-5"
            href="/review"
          >
            <p className="text-sm font-bold text-cyan-200">復習あり</p>
            <p className="mt-1 text-2xl font-extrabold">{reviewCount}問</p>
            <p className="mt-1 text-sm text-slate-300">間違えた問題だけを短時間で確認できます。</p>
          </Link>
        )}
        <Link
          className="btn btn-primary block text-center text-base"
          href="/verbs"
        >
          学習を始める
        </Link>
      </section>

      <section className="card p-5">
        <p className="text-sm font-bold text-muted">設定</p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold">
          <Link className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-3 text-center text-slate-200" href="/study-method">
            勉強方法
          </Link>
          <Link className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-3 text-center text-slate-200" href="/about">
            このアプリについて
          </Link>
        </div>
        <button
          className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm font-bold text-slate-300"
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
          type="button"
        >
          ログアウト
        </button>
      </section>
    </div>
  );
}
