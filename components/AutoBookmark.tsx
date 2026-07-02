"use client";

import { useEffect } from "react";
import { saveBookmark, type BookmarkSection } from "@/lib/account";

type Props = {
  verbId: string;
  section: BookmarkSection;
  label: string;
  href: string;
};

export default function AutoBookmark({ verbId, section, label, href }: Props) {
  useEffect(() => {
    saveBookmark({ verbId, section, label, href });
  }, [verbId, section, label, href]);

  return null;
}
