"use client";

import { useEffect, useState } from "react";
import { getCurrentUsername, hasPremiumFeatureAccess, isPhraseSaved, removeSavedPhrase, savePhrase, type SavedPhrase } from "@/lib/account";

export default function PhraseSaveButton({ phrase, compact = false }: { phrase: Omit<SavedPhrase, "savedAt">; compact?: boolean }) {
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    setReady(true);
    setHasAccess(hasPremiumFeatureAccess());
    setSaved(isPhraseSaved(phrase.id));
  }, [phrase.id]);

  if (!ready || !getCurrentUsername()) return null;

  const baseClass = compact
    ? "rounded-full border px-3 py-1.5 text-xs font-bold"
    : "rounded-full border px-3 py-2 text-sm font-bold";

  if (!hasAccess) {
    return (
      <button
        type="button"
        onClick={() => { window.location.href = "/upgrade"; }}
        className={`${baseClass} border-amber-300/30 bg-amber-300/10 text-amber-100`}
        aria-label="Premiumでフレーズ保存"
      >
        🔒 保存
      </button>
    );
  }

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
      className={`${baseClass} border-yellow-300/30 bg-yellow-300/10 text-yellow-100`}
      aria-label={saved ? "保存解除" : "フレーズ保存"}
    >
      {saved ? "★ 保存済み" : "☆ 保存"}
    </button>
  );
}
