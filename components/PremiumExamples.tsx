"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ExampleCard from "./ExampleCard";
import type { Example } from "@/lib/data";
import { hasPremiumFeatureAccess, type SavedPhrase } from "@/lib/account";

export default function PremiumExamples({
  examples,
  phraseBase,
}: {
  examples?: Example[];
  phraseBase?: Omit<SavedPhrase, "savedAt" | "id" | "en" | "ja"> & { idPrefix: string };
}) {
  const [open, setOpen] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    setHasAccess(hasPremiumFeatureAccess());
  }, []);

  if (!examples || examples.length === 0) return null;

  return (
    <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-slate-950/45 p-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 text-left font-bold text-cyan-100"
      >
        <span>{open ? "－ 日常例文を閉じる" : "＋ 日常例文を見る（Premium）"}</span>
        <span className="rounded-full border border-cyan-300/25 px-2 py-1 text-xs text-cyan-100">+{examples.length}</span>
      </button>
      <p className="mt-2 text-sm text-slate-300">
        仕事例文で基本を押さえたあと、日常でも使える表現を追加で確認できます。
      </p>
      {open && !hasAccess && (
        <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-950/20 p-4 text-sm text-amber-100">
          <p className="font-bold">🔒 日常例文はPremiumで利用できます。</p>
          <p className="mt-2 text-amber-100/80">500円以上の課金で、日常例文・構造・Pattern・0.5倍速・フレーズ帳・シャッフルテストが解放されます。</p>
          <Link href="/upgrade" className="mt-3 inline-block rounded-full bg-amber-300 px-4 py-2 font-bold text-slate-950">アップグレードを見る</Link>
        </div>
      )}
      {open && hasAccess && (
        <div className="mt-4 space-y-3">
          {examples.map((example, index) => (
            <ExampleCard
              key={`${example.en}-${index}`}
              example={example}
              verbPattern={phraseBase?.pattern}
              sentenceStructure={phraseBase?.pattern}
              phrase={phraseBase ? {
                id: `${phraseBase.idPrefix}:daily:${index}`,
                verbId: phraseBase.verbId,
                section: phraseBase.section,
                meaningTitle: `${phraseBase.meaningTitle}：日常例文`,
                pattern: phraseBase.pattern,
                en: example.en,
                ja: example.ja,
              } : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
