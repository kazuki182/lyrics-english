"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SpeakButton from "./SpeakButton";
import { clearTestSession, getSavedPhrases, getTestSession, recordTestResult, saveTestSession, type SavedPhrase } from "@/lib/account";

function answerUnderline(sentence: string) {
  const words = sentence.trim().split(/\s+/).filter(Boolean);
  return words.map((_, i) => (
    <span key={i} className="inline-block h-3 w-14 max-w-[22vw] rounded-full border-b-4 border-cyan-300/70" />
  ));
}

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const SESSION_KEY = "phrase-book:test";

export default function PhraseShuffleTest() {
  const [phrases, setPhrases] = useState<SavedPhrase[]>([]);
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [loadedSession, setLoadedSession] = useState(false);
  const [resumed, setResumed] = useState(false);

  useEffect(() => {
    const savedPhrases = getSavedPhrases();
    const saved = getTestSession(SESSION_KEY);
    if (saved && saved.itemIds.length > 0) {
      const ordered = saved.itemIds
        .map((id) => savedPhrases.find((phrase) => phrase.id === id))
        .filter(Boolean) as SavedPhrase[];
      if (ordered.length > 0) {
        setPhrases(ordered);
        setIndex(Math.min(saved.index, ordered.length));
        setShown(saved.shown);
        setCorrect(saved.correct);
        setWrong(saved.wrong);
        setResumed(saved.index > 0 || saved.correct > 0 || saved.wrong > 0);
        setLoadedSession(true);
        return;
      }
    }
    setPhrases(shuffle(savedPhrases).slice(0, 20));
    setIndex(0);
    setShown(false);
    setCorrect(0);
    setWrong(0);
    setResumed(false);
    setLoadedSession(true);
  }, []);

  const item = phrases[index];
  const finished = phrases.length > 0 && index >= phrases.length;

  useEffect(() => {
    if (!loadedSession || phrases.length === 0 || finished) return;
    saveTestSession({
      key: SESSION_KEY,
      verbId: "phrase-book",
      section: "phrase-book",
      itemIds: phrases.map((phrase) => phrase.id),
      index,
      shown,
      correct,
      wrong
    });
  }, [loadedSession, phrases, finished, index, shown, correct, wrong]);

  useEffect(() => {
    if (finished) clearTestSession(SESSION_KEY);
  }, [finished]);

  const next = () => {
    setShown(false);
    setIndex((n) => Math.min(n + 1, phrases.length));
  };

  const restart = () => {
    clearTestSession(SESSION_KEY);
    setPhrases(shuffle(getSavedPhrases()).slice(0, 20));
    setIndex(0);
    setShown(false);
    setCorrect(0);
    setWrong(0);
    setResumed(false);
  };

  const mark = (ok: boolean) => {
    if (!item) return;
    recordTestResult(item.verbId, item.id, ok);
    if (ok) {
      setCorrect((n) => n + 1);
      next();
    } else {
      setWrong((n) => n + 1);
      setShown(false);
    }
  };

  if (!loadedSession) {
    return <div className="card p-6 text-muted">テストを読み込んでいます...</div>;
  }

  if (phrases.length === 0) {
    return (
      <div className="space-y-5 pb-24">
        <section className="card p-6 text-center">
          <p className="text-sm text-muted">フレーズ帳テスト</p>
          <h1 className="mt-2 text-3xl font-bold">保存フレーズがありません</h1>
          <p className="mt-3 text-muted">例文の「☆ 保存」を押すと、自分だけのテストを作れます。</p>
          <Link href="/verbs" className="btn btn-primary mt-5 block">動詞から保存する</Link>
        </section>
      </div>
    );
  }

  if (finished || !item) {
    return (
      <div className="space-y-5 pb-24">
        <section className="card p-6 text-center">
          <p className="text-sm text-muted">フレーズ帳テスト</p>
          <h1 className="mt-2 text-3xl font-bold">テスト完了</h1>
          <p className="mt-3 text-muted">できた {correct}問 / だめ {wrong}問</p>
          <div className="mt-6 grid gap-3">
            <button onClick={restart} className="btn btn-primary block">もう一度シャッフル</button>
            <Link href="/phrase-book" className="btn btn-soft block">フレーズ帳へ戻る</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      <section className="card p-5">
        <p className="text-sm text-muted">保存した例文だけで練習</p>
        <h1 className="mt-1 text-3xl font-bold">シャッフルテスト</h1>
        <p className="mt-2 text-muted">お気に入りの文を、日本語から英語に瞬発変換します。</p>
        {resumed && (
          <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-slate-950/60 p-4 text-sm text-cyan-100">
            前回の続きから再開しています。
            <button type="button" onClick={restart} className="ml-2 font-bold underline">最初からやり直す</button>
          </div>
        )}
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>{Math.min(index + 1, phrases.length)} / {phrases.length}</span>
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
              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-4">{answerUnderline(item.en)}</div>
            </div>
            <button className="btn btn-primary w-full" onClick={() => setShown(true)}>答えを見る</button>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl bg-slate-950/60 p-5">
              <p className="text-sm font-bold text-muted">正解</p>
              <p className="mt-2 text-xl font-bold">{item.en}</p>
              <p className="mt-2 text-sm text-muted">型：{item.pattern}</p>
              <div className="mt-4"><SpeakButton text={item.en} label="通常" slowLabel="ゆっくり" lang="en-US" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => mark(true)} className="btn bg-green-600 text-white">○ できた</button>
              <button onClick={() => mark(false)} className="btn bg-red-600 text-white">× だめ</button>
            </div>
            <button onClick={next} className="btn btn-soft w-full">スキップして次へ</button>
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4"><p className="text-sm text-muted">できた</p><p className="text-2xl font-bold">{correct}</p></div>
        <div className="card p-4"><p className="text-sm text-muted">だめ</p><p className="text-2xl font-bold">{wrong}</p></div>
      </div>
    </div>
  );
}
