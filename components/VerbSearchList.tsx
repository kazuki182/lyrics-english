"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Verb } from "@/lib/data";
import VerbListProgress from "@/components/VerbListProgress";
import { getEffectiveUnlockedVerbCount } from "@/lib/account";

function twoDigit(value: number) {
  return String(value).padStart(2, "0");
}


function packLabel(index: number) {
  if (index <= 3) return "無料";
  if (index <= 30) return "30語パック";
  if (index <= 60) return "60語パック";
  if (index <= 90) return "90語パック";
  return index > 120 ? "120語パック＋追加" : "120語パック";
}

function lockedMessage(index: number) {
  if (index <= 30) return "Step 1：30語パックで解放されます。";
  if (index <= 60) return "Step 2：60語パックで解放されます。";
  if (index <= 90) return "Step 3：90語パックで解放されます。";
  return index > 120 ? "Step 4：120語パックで追加教材として解放されます。" : "Step 4：120語パックで解放されます。";
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
  const [unlockedCount, setUnlockedCount] = useState(3);

  useEffect(() => {
    setUnlockedCount(getEffectiveUnlockedVerbCount());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return verbs;
    return verbs.filter((verb) => searchableText(verb).includes(q));
  }, [query, verbs]);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-cyan-300/30 bg-slate-950/70 p-4 shadow-lg">
        <label className="flex items-center gap-2 text-sm font-bold text-cyan-100" htmlFor="verb-search">
          <span>🔍</span><span>検索BOX：登録動詞を検索</span>
        </label>
        <input
          id="verb-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="動詞名・日本語・例文で検索（例：get / 承認 / 会議）"
          className="mt-3 block w-full rounded-2xl border border-cyan-300/30 bg-slate-900 px-4 py-4 text-base text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/80"
        />
        <p className="mt-2 text-xs text-muted">
          {filtered.length} / {verbs.length} 動詞を表示中
        </p>
      </div>

      <div className="space-y-3">
        {filtered.map((verb) => {
          const originalIndex = verbs.findIndex((v) => v.id === verb.id) + 1;
          const locked = originalIndex > unlockedCount;
          return (
            <Link key={verb.id} href={locked ? "/upgrade" : `/verbs/${verb.id}`} className={`card block p-5 ${locked ? "opacity-75" : ""}`}>
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
                    <span className="rounded-full bg-white/5 px-2 py-1 text-xs font-bold text-muted">{locked ? `🔒 ${packLabel(originalIndex)}` : packLabel(originalIndex)}</span>
                  </div>
                  <div className="mt-4">
                    {locked ? (
                      <div className="rounded-2xl border border-amber-300/20 bg-amber-950/20 p-3 text-sm font-bold text-amber-100">
                        {lockedMessage(originalIndex)} タップしてアップグレードへ。
                      </div>
                    ) : (
                      <VerbListProgress verb={verb} />
                    )}
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
