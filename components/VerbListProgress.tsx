"use client";

import { useEffect, useState } from "react";
import type { Verb } from "@/lib/data";
import { getCurrentBookmark, getCurrentProgress, type StudyBookmark, type UserProgress } from "@/lib/account";
import { getTotalVerbProgress } from "./VerbProgressPanel";
import ProgressBar from "./ProgressBar";

export default function VerbListProgress({ verb }: { verb: Verb }) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [bookmark, setBookmark] = useState<StudyBookmark | null>(null);

  useEffect(() => {
    setProgress(getCurrentProgress());
    setBookmark(getCurrentBookmark());
  }, []);

  const value = getTotalVerbProgress(verb, progress, bookmark);
  return <ProgressBar value={value} label={value === 100 ? "MASTER" : `${value}%`} />;
}
