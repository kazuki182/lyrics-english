"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "ホーム", short: "ホーム", icon: "🏠" },
  { href: "/verbs", label: "動詞", short: "動詞", icon: "📘" },
  { href: "/tests", label: "テスト", short: "テスト", icon: "🎧" },
  { href: "/phrase-book", label: "保存", short: "保存", icon: "⭐" },
  { href: "/profile", label: "マイページ", short: "マイ", icon: "👤" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Nav() {
  const pathname = usePathname() || "/";

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-50 border-t border-cyan-300/15 bg-slate-950/98 shadow-[0_-14px_34px_rgba(0,0,0,0.35)] backdrop-blur-xl" aria-label="メインナビゲーション">
      <div className="bottom-nav-scroll mx-auto max-w-xl overflow-x-auto overscroll-x-contain px-2">
        <div className="bottom-nav-inner flex min-w-max items-stretch gap-2 py-2">
          {tabs.map((tab) => {
            const active = isActive(pathname, tab.href);
            return (
              <Link
                key={tab.href}
                className={active ? "bottom-nav-link bottom-nav-link-active" : "bottom-nav-link"}
                href={tab.href}
                aria-label={tab.label}
                aria-current={active ? "page" : undefined}
              >
                <span className="bottom-nav-icon" aria-hidden="true">{tab.icon}</span>
                <span className="bottom-nav-text">{tab.short}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
