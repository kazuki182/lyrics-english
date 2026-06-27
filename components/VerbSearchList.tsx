"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Verb } from "@/lib/data";
import VerbListProgress from "@/components/VerbListProgress";

function twoDigit(value: number) {
  return String(value).padStart(2, "0");
}

function searchableText(verb: Verb) {
  const meaningText = verb.meanings
    .map((m) => [m.title, m.pattern, m.point, m.examples.map((e) => `${e.en} ${e.ja}`).join(" ")].join(" "))
    .join(" ");
  const idiomText = verb.collocations.map((p) => `${p.phrase} ${p.ja}`).join(" ");
  const phrasalText = verb.phrasalVerbs.map((p) => `${p.phrase} ${p.ja}`).join(" ");
  return `${verb.word} ${verb.id} ${verb.kana} ${verb.core} ${verb.coreDetail} ${meaningText} ${idiomText} ${phrasalText}`.toLowerCase();
}

export default function VerbSearchList({ verbs }: { verbs: Verb[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return verbs;
    return verbs.filter((verb) => searchableText(verb).includes(q));
  }, [query, verbs]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm font-bold text-muted" htmlFor="verb-search">
          登録動詞を検索
        </label>
        <input
          id="verb-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例：get / 承認 / 会議 / 始める"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-base text-white outline-none focus:border-cyan-300/60"
        />
        <p className="mt-2 text-xs text-muted">
          {filtered.length} / {verbs.length} 動詞を表示中
        </p>
      </div>

      <div className="space-y-3">
        {filtered.map((verb) => {
          const originalIndex = verbs.findIndex((v) => v.id === verb.id) + 1;
          return (
            <Link key={verb.id} href={`/verbs/${verb.id}`} className="card block p-5">
              <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-2xl border border-cyan-300/20 bg-slate-950 px-3 py-2 text-center">
                  <p className="text-xs font-bold tracking-wider text-cyan-200">No.</p>
                  <p className="text-xl font-black text-white">{twoDigit(originalIndex)}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-2xl font-bold verb-red">{verb.word}</p>
                      <p className="mt-1 text-muted">{verb.core}</p>
                    </div>
                    <span className="rounded-full bg-white/5 px-2 py-1 text-xs font-bold text-muted">#{verb.rank}</span>
                  </div>
                  <div className="mt-4">
                    <VerbListProgress verb={verb} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card p-5 text-center text-muted">
          該当する動詞がありません。別のキーワードで検索してください。
        </div>
      )}
    </div>
  );
}
