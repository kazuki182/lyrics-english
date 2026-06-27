"use client";

export default function SpeakButton({
  text,
  label = "通常",
  slowLabel = "ゆっくり",
  rate = 0.95,
  slowRate = 0.5,
  lang = "en-US"
}: {
  text: string;
  label?: string;
  slowLabel?: string;
  rate?: number;
  slowRate?: number;
  lang?: string;
}) {
  const speak = (speechRate: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = speechRate;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => speak(rate)}
        className="inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-slate-950/70 px-3 py-1.5 text-sm font-bold text-cyan-100 shadow-sm"
      >
        🔊 {label}
      </button>
      <button
        type="button"
        onClick={() => speak(slowRate)}
        className="inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-slate-950/70 px-3 py-1.5 text-sm font-bold text-cyan-100 shadow-sm"
      >
        🐢 {slowLabel}
      </button>
    </div>
  );
}
