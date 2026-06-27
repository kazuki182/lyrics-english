"use client";

import { useState } from "react";
import { saveBookmark, type BookmarkSection } from "@/lib/account";

type Props = {
  verbId: string;
  section: BookmarkSection;
  label: string;
  href: string;
  itemTitle?: string;
  itemIndex?: number;
  compact?: boolean;
};

export default function BookmarkButton({ verbId, section, label, href, itemTitle, itemIndex, compact = false }: Props) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveBookmark({ verbId, section, label, href, itemTitle, itemIndex });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleSave}
      className={compact ? "bookmark-mini" : "bookmark-button"}
      aria-label="この位置をしおりに保存"
    >
      {saved ? "保存しました" : "🔖 しおり"}
    </button>
  );
}
