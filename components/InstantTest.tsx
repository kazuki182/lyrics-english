"use client";

import { naturalPatternText } from "@/lib/display";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getVerb, getTestItemById, getTestItemsForVerb, type TestItem, type TestSection } from "@/lib/data";
import SpeakButton from "./SpeakButton";
import { clearTestSession, getCurrentProgress, getTestSession, recordReviewResult, recordSectionClear, recordTestCompletion, recordTestResult, recordVerbMastery, saveProgress, saveTestSession, type UserProgress } from "@/lib/account";

type InstantTestProps = {
  verbId?: string;
  section?: TestSection;
  itemIds?: string[];
  title?: string;
  description?: string;
  reviewMode?: boolean;
  finishHref?: string;
  finishLabel?: string;
};


function answerUnderline(sentence: string) {
  const words = sentence.trim().split(/\s+/).filter(Boolean);
  return words.map((_, i) => (
    <span key={i} className="inline-block h-3 w-14 max-w-[22vw] rounded-full border-b-4 border-cyan-300/70" />
  ));
}


type TestSnapshot = {
  index: number;
  shown: boolean;
  correct: number;
  wrong: number;
  progress: UserProgress | null;
};

function cloneProgress(progress: UserProgress | null): UserProgress | null {
  return progress ? JSON.parse(JSON.stringify(progress)) : null;
}

function shuffleItems(items: TestItem[]) {
  return [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((entry) => entry.item);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isDueReview(progress: UserProgress | null, item: TestItem) {
  const review = progress?.reviewItems?.[item.id];
  if (!review) return false;
  return review.lastResult === "wrong" || review.nextReviewAt <= todayKey();
}

function itemScore(progress: UserProgress | null, item: TestItem) {
  if (!progress) return Math.random();
  const stat = progress.testItemStats?.[item.id];
  const weak = progress.weakItems?.includes(item.id) ? 1000 : 0;
  const due = isDueReview(progress, item) ? 1200 : 0;
  const untested = !stat ? 700 : 0;
  const wrong = (stat?.wrong || 0) * 80;
  const correct = (stat?.correct || 0) * -15;
  const lastAnswered = stat?.lastAnsweredAt ? new Date(stat.lastAnsweredAt).getTime() : 0;
  const stale = lastAnswered ? Math.min(180, Math.floor((Date.now() - lastAnswered) / 86400000)) : 120;
  return due + weak + untested + wrong + correct + stale + Math.random();
}

function takeRanked(source: TestItem[], count: number, used: Set<string>, progress: UserProgress | null) {
  const ranked = [...source]
    .filter((item) => !used.has(item.id))
    .sort((a, b) => itemScore(progress, b) - itemScore(progress, a));
  const picked = ranked.slice(0, count);
  picked.forEach((item) => used.add(item.id));
  return picked;
}

function balancedTen(items: TestItem[], progress: UserProgress | null) {
  const limit = Math.min(10, items.length);
  if (items.length <= limit) return [...items].sort((a, b) => itemScore(progress, b) - itemScore(progress, a));

  const due = items.filter((item) => isDueReview(progress, item) || progress?.weakItems?.includes(item.id));
  const untested = items.filter((item) => !progress?.testItemStats?.[item.id]);
  const sections: Record<string, TestItem[]> = { basic: [], phrasal: [] };
  for (const item of items) sections[item.section].push(item);

  const used = new Set<string>();
  const selected: TestItem[] = [];

  selected.push(...takeRanked(due, 4, used, progress));
  selected.push(...takeRanked(untested, Math.max(0, 7 - selected.length), used, progress));

  for (const section of ["basic", "phrasal"] as const) {
    if (selected.length >= limit) break;
    if (!selected.some((item) => item.section === section) && sections[section].length > 0) {
      selected.push(...takeRanked(sections[section], 1, used, progress));
    }
  }

  selected.push(...takeRanked(items, limit - selected.length, used, progress));
  return selected.slice(0, limit);
}

function testSummary(items: TestItem[], progress: UserProgress | null) {
  const weak = items.filter((item) => progress?.weakItems?.includes(item.id)).length;
  const due = items.filter((item) => isDueReview(progress, item)).length;
  const untested = items.filter((item) => !progress?.testItemStats?.[item.id]).length;
  return { weak, due, untested };
}

function sectionName(section: TestSection) {
  if (section === "basic" || section === "idioms") return "基本テスト";
  if (section === "phrasal") return "句動詞テスト";
  return "総合テスト";
}

function sectionReward(section: TestSection) {
  if (section === "basic") return 20;
  if (section === "idioms") return 20;
  if (section === "phrasal") return 30;
  return 100;
}

export default function InstantTest({
  verbId = "get",
  section = "all",
  itemIds,
  title,
  description,
  reviewMode = false,
  finishHref,
  finishLabel
}: InstantTestProps) {
  const baseItems = useMemo<TestItem[]>(() => {
    if (itemIds && itemIds.length > 0) {
      return itemIds.map((id) => getTestItemById(id)).filter(Boolean) as TestItem[];
    }
    return getTestItemsForVerb(verbId, section);
  }, [itemIds, verbId, section]);

  const [items, setItems] = useState<TestItem[]>([]);
  const verb = getVerb(baseItems[0]?.verbId || verbId);
  const sessionKey = useMemo(() => {
    const ids = itemIds && itemIds.length > 0 ? itemIds.join("|") : "all";
    return reviewMode ? `review:${ids}` : `test:${verb.id}:${section}`;
  }, [itemIds, reviewMode, section, verb.id]);
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [rewardShown, setRewardShown] = useState(false);
  const [completionRewardShown, setCompletionRewardShown] = useState(false);
  const [loadedSession, setLoadedSession] = useState(false);
  const [resumed, setResumed] = useState(false);
  const [history, setHistory] = useState<TestSnapshot[]>([]);
  const item = items[index];
  const finished = items.length > 0 && index >= items.length;
  const allCorrect = items.length > 0 && correct === items.length && wrong === 0;
  const reward = sectionReward(section);
  const activeSummary = useMemo(() => testSummary(items, getCurrentProgress()), [items, correct, wrong, index]);

  useEffect(() => {
    if (baseItems.length === 0) return;
    const saved = getTestSession(sessionKey);
    const savedItems = saved?.itemIds
      .map((id) => getTestItemById(id))
      .filter(Boolean) as TestItem[] | undefined;
    const progress = getCurrentProgress();
    const nextItems = savedItems && savedItems.length > 0 ? savedItems.slice(0, 10) : balancedTen(baseItems, progress);
    setItems(nextItems);
    if (saved && savedItems && savedItems.length > 0) {
      setIndex(Math.min(saved.index, nextItems.length));
      setShown(saved.shown);
      setCorrect(saved.correct);
      setWrong(saved.wrong);
      setResumed(saved.index > 0 || saved.correct > 0 || saved.wrong > 0);
    } else {
      setIndex(0);
      setShown(false);
      setCorrect(0);
      setWrong(0);
      setResumed(false);
    }
    setHistory([]);
    setLoadedSession(true);
  }, [baseItems, sessionKey]);

  useEffect(() => {
    if (!loadedSession || items.length === 0 || finished) return;
    saveTestSession({
      key: sessionKey,
      verbId: verb.id,
      section,
      itemIds: items.map((i) => i.id),
      index,
      shown,
      correct,
      wrong
    });
  }, [loadedSession, items, finished, sessionKey, verb.id, section, index, shown, correct, wrong]);

  const restart = () => {
    clearTestSession(sessionKey);
    setItems(balancedTen(baseItems, getCurrentProgress()));
    setIndex(0);
    setShown(false);
    setCorrect(0);
    setWrong(0);
    setRewardShown(false);
    setCompletionRewardShown(false);
    setResumed(false);
    setHistory([]);
  };

  const next = () => {
    setShown(false);
    setIndex((i) => Math.min(i + 1, items.length));
  };

  useEffect(() => {
    if (finished) clearTestSession(sessionKey);
    if (finished && !completionRewardShown) {
      setCompletionRewardShown(true);
      recordTestCompletion(section, reviewMode ? 5 : 10);
    }
    if (finished && allCorrect && !reviewMode && !rewardShown) {
      setRewardShown(true);
      if (section === "all") recordVerbMastery(verb.id);
      else recordSectionClear(verb.id, section, reward);
    }
  }, [finished, allCorrect, reviewMode, rewardShown, completionRewardShown, section, verb.id, reward, sessionKey]);

  if (!loadedSession && items.length > 0) {
    return <div className="card p-6 text-muted">テストを読み込んでいます...</div>;
  }

  if (!item || finished) {
    return (
      <div className="space-y-5 pb-24">
        <section className="card p-6 text-center">
          <p className="text-sm text-muted">{reviewMode ? "復習" : sectionName(section)}</p>
          <h1 className="mt-2 text-3xl font-bold">{reviewMode ? "復習完了" : `${verb.word} テスト完了`}</h1>
          <p className="mt-3 text-muted">できた {correct}問 / だめ {wrong}問</p>
          <p className="mt-2 text-sm font-bold text-cyan-100">完了ボーナス +{reviewMode ? 5 : 10}XP。テストは何回でも受けられ、正解XPも毎回加算されます。</p>
          {reviewMode && correct > 0 && (
            <p className="mt-2 text-sm font-bold text-cyan-200">復習で正解した問題は苦手リストから外れます。+8XP</p>
          )}
          {allCorrect && !reviewMode && (
            <div className="point-card mt-5">
              <p className="text-lg font-bold">満点クリア</p>
              <p className="mt-1">{section === "all" ? `${verb.word} MASTER 獲得 / +${reward}XP` : `このセクションをクリア / +${reward}XP`}</p>
            </div>
          )}
          <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-slate-950/50 p-4 text-left text-sm">
            <p className="font-bold text-cyan-100">次のおすすめ</p>
            <p className="mt-2 text-muted">
              {wrong > 0
                ? "間違えた問題は復習リストに入ります。あとで復習テストで確認しましょう。"
                : activeSummary.untested > 0
                  ? "未出題の問題がまだあります。もう一度テストすると別の問題が出やすくなります。"
                  : "よくできています。次の動詞または句動詞テストへ進みましょう。"}
            </p>
          </div>
          <div className="mt-6 grid gap-3">
            <button type="button" onClick={restart} className="btn btn-primary block text-center">もう一度ランダム10問を受ける</button>
            {finishHref && <Link href={finishHref} className="btn btn-soft block text-center">{finishLabel || "次へ進む"}</Link>}
            <Link href={`/verbs/${verb.id}`} className="btn btn-soft block text-center">{verb.word} を再学習する</Link>
            <Link href="/tests" className="btn btn-soft block text-center">単語別テストへ</Link>
            <Link href="/review" className="btn btn-soft block text-center">復習リストを見る</Link>
          </div>
        </section>
      </div>
    );
  }

  const mark = (isCorrect: boolean) => {
    setHistory((list) => [
      ...list,
      { index, shown, correct, wrong, progress: cloneProgress(getCurrentProgress()) },
    ].slice(-5));
    reviewMode ? recordReviewResult(item.verbId, item.id, isCorrect) : recordTestResult(item.verbId, item.id, isCorrect);
    if (isCorrect) {
      setCorrect((n) => n + 1);
      next();
    } else {
      setWrong((n) => n + 1);
      setShown(false);
    }
  };

  const undoLast = () => {
    const last = history[history.length - 1];
    if (!last) return;
    if (last.progress) saveProgress(last.progress);
    setIndex(last.index);
    setShown(last.shown);
    setCorrect(last.correct);
    setWrong(last.wrong);
    setHistory((list) => list.slice(0, -1));
  };

  return (
    <div className="space-y-5 pb-24">
      <div className="card p-5">
        <p className="text-sm text-muted">{reviewMode ? "復習" : sectionName(section)}</p>
        <h1 className="mt-1 text-3xl font-bold">{title || <><span className="verb-red">{verb.word}</span> 日本語 → 英語</>}</h1>
        <p className="mt-2 text-muted">{description || "日本語を見て、すぐ英語で言ってから答えを確認します。"}</p>
        <p className="mt-2 text-sm font-bold text-cyan-100">出題は最大10問です。毎回ランダムで、未出題・苦手・復習対象・最近やっていない問題を混ぜて出します。</p>
        <p className="mt-1 text-xs text-slate-400">途中で閉じても保存され、次回は続きから再開できます。完了後は何回でも再挑戦できます。</p>
        {items.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl border border-cyan-300/15 bg-slate-950/50 p-2"><p className="text-muted">未出題</p><p className="font-bold text-cyan-100">{activeSummary.untested}</p></div>
            <div className="rounded-xl border border-cyan-300/15 bg-slate-950/50 p-2"><p className="text-muted">苦手</p><p className="font-bold text-cyan-100">{activeSummary.weak}</p></div>
            <div className="rounded-xl border border-cyan-300/15 bg-slate-950/50 p-2"><p className="text-muted">復習</p><p className="font-bold text-cyan-100">{activeSummary.due}</p></div>
          </div>
        )}
        {resumed && (
          <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-slate-950/60 p-4 text-sm text-cyan-100">
            前回の続きから再開しています。
            <button type="button" onClick={restart} className="ml-2 font-bold underline">最初からやり直す</button>
          </div>
        )}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>{Math.min(index + 1, items.length)} / {items.length}</span>
          <span>{item.meaningTitle}</span>
        </div>
        <div className="mt-8 rounded-2xl bg-slate-950/60 p-5">
          <p className="text-sm font-bold text-muted">日本語</p>
          <p className="mt-2 text-2xl font-bold leading-relaxed">{item.ja}</p>
          <p className="mt-4 text-xs text-slate-400">英語で言ってから「答えを見る」を押します。</p>
        </div>
        {!shown ? (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl border border-cyan-300/20 bg-slate-950/50 p-5">
              <p className="text-sm font-bold text-cyan-100">英語の語数ヒント</p>
              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-4">
                {answerUnderline(item.en)}
              </div>
              <p className="mt-3 text-xs text-slate-400">下線の数だけ英単語を入れて考えます。</p>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-slate-950/50 p-4">
              <p className="mb-3 text-sm font-bold text-cyan-100">リスニング確認</p>
              <SpeakButton text={item.en} label="英文を聞く" slowLabel="ゆっくり" lang="en-US" />
            </div>
            <button className="btn btn-primary w-full" onClick={() => setShown(true)}>答えを見る</button>
            {history.length > 0 && (
              <button onClick={undoLast} className="btn btn-soft w-full">1つ前の回答に戻る</button>
            )}
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl bg-slate-950/60 p-5">
              <p className="text-sm font-bold text-muted">正解</p>
              <p className="mt-2 text-xl font-bold">{item.en}</p>
              <p className="mt-2 text-sm text-muted">型：{naturalPatternText(item.pattern)}</p>
              <div className="mt-4"><SpeakButton text={item.en} label="通常" slowLabel="ゆっくり" lang="en-US" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => mark(true)} className="btn bg-green-600 text-white">○ できた</button>
              <button onClick={() => mark(false)} className="btn bg-red-600 text-white">× だめ</button>
            </div>
            <button onClick={next} className="btn btn-soft w-full">スキップして次へ</button>
            {history.length > 0 && (
              <button onClick={undoLast} className="btn btn-soft w-full">1つ前の回答に戻る</button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4"><p className="text-sm text-muted">できた</p><p className="text-2xl font-bold">{correct}</p></div>
        <div className="card p-4"><p className="text-sm text-muted">だめ</p><p className="text-2xl font-bold">{wrong}</p></div>
      </div>
    </div>
  );
}
