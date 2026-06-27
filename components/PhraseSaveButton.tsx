"use client";

import { useEffect, useState } from "react";
import { getCurrentUsername, isPhraseSaved, removeSavedPhrase, savePhrase, type SavedPhrase } from "@/lib/account";

export default function PhraseSaveButton({ phrase, compact = false }: { phrase: Omit<SavedPhrase, "savedAt">; compact?: boolean }) {
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    setSaved(isPhraseSaved(phrase.id));
  }, [phrase.id]);

  if (!ready || !getCurrentUsername()) return null;

  const toggle = () => {
    if (saved) {
      removeSavedPhrase(phrase.id);
      setSaved(false);
    } else {
      savePhrase(phrase);
      setSaved(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={compact
        ? "rounded-full border border-yellow-300/30 bg-yellow-300/10 px-3 py-1.5 text-xs font-bold text-yellow-100"
        : "rounded-full border border-yellow-300/30 bg-yellow-300/10 px-3 py-2 text-sm font-bold text-yellow-100"
      }
      aria-label={saved ? "保存解除" : "フレーズ保存"}
    >
      {saved ? "★ 保存済み" : "☆ 保存"}
    </button>
  );
}
