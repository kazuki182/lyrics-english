import SpeakButton from "./SpeakButton";
import type { Example } from "@/lib/data";

function highlightText(text: string, target?: string, className = "example-verb") {
  if (!target || !text.includes(target)) return text;
  const index = text.indexOf(target);
  return (
    <>
      {text.slice(0, index)}
      <span className={className}>{target}</span>
      {text.slice(index + target.length)}
    </>
  );
}

export default function ExampleCard({ example }: { example: Example }) {
  return (
    <div className="rounded-2xl bg-paper p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-lg font-semibold leading-relaxed sm:text-xl">
          {highlightText(example.en, example.focus)}
        </p>
        <SpeakButton text={example.en} label="通常" />
      </div>
      {example.object && (
        <p className="mb-3 text-sm text-muted">
          目的語：<span className="object-chip">{example.object}</span>
        </p>
      )}
      <p className="leading-relaxed text-muted">
        {highlightText(example.ja, example.jaFocus, "ja-focus")}
      </p>
    </div>
  );
}
