"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getVerb, getTestItemById, getTestItemsForVerb, type TestItem, type TestSection } from "@/lib/data";
import SpeakButton from "./SpeakButton";
import { recordSectionClear, recordTestResult, recordVerbMastery } from "@/lib/account";

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

function sectionName(section: TestSection) {
  if (section === "basic") return "基本動詞テスト";
  if (section === "idioms") return "熟語テスト";
  if (section === "phrasal") return "句動詞テスト";
  return "総合テスト";
}

function sectionReward(section: TestSection) {
  if (section === "basic") return 20;
  if (section === "idioms") return 30;
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
  const items = useMemo<TestItem[]>(() => {
    if (itemIds && itemIds.length > 0) {
      return itemIds.map((id) => getTestItemById(id)).filter(Boolean) as TestItem[];
    }
    return getTestItemsForVerb(verbId, section);
  }, [itemIds, verbId, section]);

  const verb = getVerb(items[0]?.verbId || verbId);
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [rewardShown, setRewardShown] = useState(false);
  const item = items[index];
  const finished = items.length > 0 && index >= items.length;
  const allCorrect = items.length > 0 && correct === items.length && wrong === 0;
  const reward = sectionReward(section);

  const next = () => {
    setShown(false);
    setIndex((i) => Math.min(i + 1, items.length));
  };

  useEffect(() => {
    if (finished && allCorrect && !reviewMode && !rewardShown) {
      setRewardShown(true);
      if (section === "all") recordVerbMastery(verb.id);
      else recordSectionClear(verb.id, section, reward);
    }
  }, [finished, allCorrect, reviewMode, rewardShown, section, verb.id, reward]);

  if (!item || finished) {
    return (
      <div className="space-y-5 pb-24">
        <section className="card p-6 text-center">
          <p className="text-sm text-muted">{reviewMode ? "復習" : sectionName(section)}</p>
          <h1 className="mt-2 text-3xl font-bold">{reviewMode ? "復習完了" : `${verb.word} テスト完了`}</h1>
          <p className="mt-3 text-muted">できた {correct}問 / だめ {wrong}問</p>
          {allCorrect && !reviewMode && (
            <div className="point-card mt-5">
              <p className="text-lg font-bold">満点クリア</p>
              <p className="mt-1">{section === "all" ? `${verb.word} MASTER 獲得 / +${reward}XP` : `このセクションをクリア / +${reward}XP`}</p>
            </div>
          )}
          <div className="mt-6 grid gap-3">
            {finishHref && <Link href={finishHref} className="btn btn-primary block text-center">{finishLabel || "次へ進む"}</Link>}
            <Link href={`/verbs/${verb.id}`} className="btn btn-soft block text-center">{verb.word} を再学習する</Link>
            <Link href="/tests" className="btn btn-soft block text-center">単語別テストへ</Link>
            <Link href="/review" className="btn btn-soft block text-center">復習リストを見る</Link>
          </div>
        </section>
      </div>
    );
  }

  const mark = (isCorrect: boolean) => {
    recordTestResult(item.verbId, item.id, isCorrect);
    if (isCorrect) {
      setCorrect((n) => n + 1);
      next();
    } else {
      setWrong((n) => n + 1);
      setShown(false);
    }
  };

  return (
    <div className="space-y-5 pb-24">
      <div className="card p-5">
        <p className="text-sm text-muted">{reviewMode ? "復習" : sectionName(section)}</p>
        <h1 className="mt-1 text-3xl font-bold">{title || <><span className="verb-red">{verb.word}</span> 日本語 → 英語</>}</h1>
        <p className="mt-2 text-muted">{description || "日本語を見て、すぐ英語で言ってから答えを確認します。"}</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>{Math.min(index + 1, items.length)} / {items.length}</span>
          <span>{item.meaningTitle}</span>
        </div>
        <div className="mt-8 rounded-2xl bg-slate-950/60 p-5">
          <p className="text-sm font-bold text-muted">日本語</p>
          <p className="mt-2 text-2xl font-bold leading-relaxed">{item.ja}</p>
          <div className="mt-4"><SpeakButton text={item.ja} label="通常" slowLabel="ゆっくり" lang="ja-JP" rate={0.95} slowRate={0.5} /></div>
        </div>
        {!shown ? (
          <button className="btn btn-primary mt-8 w-full" onClick={() => setShown(true)}>答えを見る</button>
        ) : (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl bg-slate-950/60 p-5">
              <p className="text-sm font-bold text-muted">正解</p>
              <p className="mt-2 text-xl font-bold">{item.en}</p>
              <p className="mt-2 text-sm text-muted">型：{item.pattern}</p>
              <div className="mt-4"><SpeakButton text={item.en} label="通常" slowLabel="ゆっくり" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => mark(true)} className="btn bg-green-600 text-white">○ できた</button>
              <button onClick={() => mark(false)} className="btn bg-red-600 text-white">× だめ</button>
            </div>
            <button onClick={next} className="btn btn-soft w-full">スキップして次へ</button>
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
