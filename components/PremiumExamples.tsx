"use client";

import { useState } from "react";
import ExampleCard from "./ExampleCard";
import type { Example } from "@/lib/data";
import type { SavedPhrase } from "@/lib/account";

export default function PremiumExamples({
  examples,
  phraseBase,
}: {
  examples?: Example[];
  phraseBase?: Omit<SavedPhrase, "savedAt" | "id" | "en" | "ja"> & { idPrefix: string };
}) {
  const [open, setOpen] = useState(false);
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
      {open && (
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
