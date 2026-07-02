import Link from "next/link";

type BadgeListProps = {
  badges: string[];
  compact?: boolean;
  emptyText?: string;
};

export default function BadgeList({ badges, compact = false, emptyText = "まだ獲得バッジはありません。" }: BadgeListProps) {
  const visible = compact ? badges.slice(0, 4) : badges;
  if (visible.length === 0) {
    return <p className="text-sm text-muted">{emptyText}</p>;
  }
  return (
    <div className={compact ? "flex flex-wrap gap-2" : "grid gap-2 sm:grid-cols-2"}>
      {visible.map((badge) => (
        <div key={badge} className="rounded-2xl border border-cyan-300/20 bg-slate-950/60 px-3 py-2 text-sm font-bold text-cyan-50">
          {badge}
        </div>
      ))}
      {compact && badges.length > visible.length && (
        <Link href="/profile" className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100">
          +{badges.length - visible.length}個を見る
        </Link>
      )}
    </div>
  );
}
