"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SpeakButton from "@/components/SpeakButton";
import { getSavedPhrases, removeSavedPhrase, type SavedPhrase } from "@/lib/account";

function sectionLabel(section: SavedPhrase["section"]) {
  if (section === "basic") return "基本動詞";
  if (section === "idioms") return "熟語";
  if (section === "phrasal") return "句動詞";
  if (section === "test") return "テスト";
  return "復習";
}

export default function PhraseBookPage() {
  const [phrases, setPhrases] = useState<SavedPhrase[]>([]);
  const [filter, setFilter] = useState<"all" | SavedPhrase["section"]>("all");

  const reload = () => setPhrases(getSavedPhrases());

  useEffect(() => {
    reload();
  }, []);

  const visible = useMemo(() => {
    return phrases.filter((phrase) => filter === "all" || phrase.section === filter);
  }, [phrases, filter]);

  const remove = (id: string) => {
    removeSavedPhrase(id);
    reload();
  };

  return (
    <div className="space-y-5 pb-24">
      <header className="card p-5">
        <p className="text-sm text-muted">自分だけの例文帳</p>
        <h1 className="mt-1 text-3xl font-bold">フレーズ帳</h1>
        <p className="mt-2 text-muted">気に入った例文を保存して、あとでまとめて復習できます。</p>
      </header>

      <section className="digital-card p-5">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="digital-panel">
            <p className="digital-label">保存数</p>
            <p className="digital-number">{phrases.length}</p>
          </div>
          <div className="digital-panel">
            <p className="digital-label">テスト</p>
            <p className="digital-number text-xl">RANDOM</p>
          </div>
        </div>
        <Link href="/phrase-book/test" className="btn btn-primary mt-4 block text-center">保存フレーズでシャッフルテスト</Link>
      </section>

      <section className="flex gap-2 overflow-x-auto pb-1 text-sm font-bold">
        {[
          ["all", "すべて"],
          ["basic", "基本"],
          ["idioms", "熟語"],
          ["phrasal", "句動詞"]
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value as any)}
            className={filter === value ? "rounded-full bg-cyan-400 px-4 py-2 text-slate-950" : "rounded-full bg-white/5 px-4 py-2 text-slate-200"}
          >
            {label}
          </button>
        ))}
      </section>

      {visible.length === 0 ? (
        <section className="card p-5 text-center">
          <p className="font-bold">まだ保存フレーズがありません</p>
          <p className="mt-2 text-muted">例文横の「☆ 保存」を押すと、ここに追加されます。</p>
          <Link href="/verbs" className="btn btn-soft mt-5 block">動詞を学習する</Link>
        </section>
      ) : (
        <section className="space-y-3">
          {visible.map((phrase) => (
            <article key={phrase.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-cyan-100">{phrase.verbId.toUpperCase()} / {sectionLabel(phrase.section)}</p>
                  <p className="mt-2 text-lg font-bold leading-relaxed">{phrase.en}</p>
                </div>
                <button onClick={() => remove(phrase.id)} className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-100">削除</button>
              </div>
              <p className="mt-3 leading-relaxed text-muted">{phrase.ja}</p>
              <p className="mt-2 text-sm text-muted">型：{phrase.pattern}</p>
              <div className="mt-4"><SpeakButton text={phrase.en} label="通常" slowLabel="ゆっくり" /></div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
