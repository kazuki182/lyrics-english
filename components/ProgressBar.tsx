export default function ProgressBar({ value, label }: { value: number; label?: string }) {
  const safe = Math.max(0, Math.min(100, Math.round(value || 0)));
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>{label}</span>
          <span>{safe}%</span>
        </div>
      )}
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}
