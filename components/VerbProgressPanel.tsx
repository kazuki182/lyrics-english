"use client";

import { useEffect, useMemo, useState } from "react";
import type { Verb } from "@/lib/data";
import { getCurrentBookmark, getCurrentProgress, type StudyBookmark, type UserProgress } from "@/lib/account";
import ProgressBar from "./ProgressBar";

type SectionKey = "basic" | "idioms" | "phrasal";

type Props = {
  verb: Verb;
  compact?: boolean;
};

function isSectionClear(progress: UserProgress | null, verbId: string, section: SectionKey) {
  return Boolean(progress?.sectionClearIds?.includes(`${verbId}:${section}`));
}

function itemIndexFromBookmark(verb: Verb, section: SectionKey, bookmark: StudyBookmark | null) {
  if (!bookmark || bookmark.verbId !== verb.id || bookmark.section !== section) return 0;
  if (bookmark.itemIndex) return bookmark.itemIndex;
  if (!bookmark.itemTitle) return 1;

  if (section === "basic") {
    const index = verb.meanings.findIndex((item) => item.title === bookmark.itemTitle);
    return index >= 0 ? index + 1 : 1;
  }
  if (section === "idioms") {
    const index = verb.collocations.slice(0, 10).findIndex((item) => item.phrase === bookmark.itemTitle);
    return index >= 0 ? index + 1 : 1;
  }
  const index = verb.phrasalVerbs.slice(0, 10).findIndex((item) => item.phrase === bookmark.itemTitle);
  return index >= 0 ? index + 1 : 1;
}

export function getSectionProgress(verb: Verb, section: SectionKey, progress: UserProgress | null, bookmark: StudyBookmark | null) {
  if (isSectionClear(progress, verb.id, section)) return 100;
  const total = section === "basic" ? Math.max(1, verb.meanings.length) : section === "idioms" ? Math.max(1, Math.min(10, verb.collocations.length)) : Math.max(1, Math.min(10, verb.phrasalVerbs.length));
  const index = Math.min(total, itemIndexFromBookmark(verb, section, bookmark));
  return Math.round((index / total) * 100);
}

export function getTotalVerbProgress(verb: Verb, progress: UserProgress | null, bookmark: StudyBookmark | null) {
  if (progress?.studiedVerbIds?.includes(verb.id)) return 100;
  const basic = getSectionProgress(verb, "basic", progress, bookmark);
  const idioms = getSectionProgress(verb, "idioms", progress, bookmark);
  const phrasal = getSectionProgress(verb, "phrasal", progress, bookmark);
  return Math.round((basic + idioms + phrasal) / 3);
}

export default function VerbProgressPanel({ verb, compact = false }: Props) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [bookmark, setBookmark] = useState<StudyBookmark | null>(null);

  useEffect(() => {
    setProgress(getCurrentProgress());
    setBookmark(getCurrentBookmark());
  }, []);

  const values = useMemo(() => {
    const basic = getSectionProgress(verb, "basic", progress, bookmark);
    const idioms = getSectionProgress(verb, "idioms", progress, bookmark);
    const phrasal = getSectionProgress(verb, "phrasal", progress, bookmark);
    const total = getTotalVerbProgress(verb, progress, bookmark);
    return { basic, idioms, phrasal, total };
  }, [verb, progress, bookmark]);

  if (compact) {
    return <ProgressBar value={values.total} label={`進捗 ${values.total}%`} />;
  }

  return (
    <section className="resume-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-cyan-200">学習進捗</p>
          <h2 className="mt-1 text-2xl font-extrabold">{verb.word} {values.total === 100 ? "MASTER" : `${values.total}%`}</h2>
        </div>
        {values.total === 100 && <span className="rounded-full bg-cyan-300 px-3 py-1 text-sm font-black text-slate-950">🏆 MASTER</span>}
      </div>
      <div className="mt-4 space-y-3">
        <ProgressBar value={values.basic} label="基本動詞" />
        <ProgressBar value={values.idioms} label="熟語" />
        <ProgressBar value={values.phrasal} label="句動詞" />
      </div>
    </section>
  );
}
