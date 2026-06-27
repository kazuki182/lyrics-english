"use client";

import { useMemo } from "react";
import SpeakButton from "./SpeakButton";
import PhraseSaveButton from "./PhraseSaveButton";
import type { Example } from "@/lib/data";
import { hasGrammarAccess } from "@/lib/account";
import type { SavedPhrase } from "@/lib/account";

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

function simplifyStructure(structure?: string) {
  if (!structure) return "";
  return structure
    .replace("（目的語）", "")
    .replace("（補語）", "")
    .replace("（内容）", "")
    .replace("（受け取るもの）", "")
    .replace("（許可・承認）", "")
    .replace("（機会）", "")
    .replace("（買う物）", "")
    .replace("（捕まえる対象）", "")
    .replace(/\s+/g, " ")
    .trim();
}

function guessPatternLabel(pattern?: string, structure?: string) {
  const text = `${pattern ?? ""} ${structure ?? ""}`;
  if (text.includes("形容詞") || text.includes(" C") || text.includes("+ C")) return "S + V + C";
  if (text.includes("人 + to") || text.includes("to不定詞")) return "S + V + O + C";
  if (text.includes("過去分詞")) return "S + V + O + C";
  if (text.includes("to 場所") || text.includes("場所")) return "S + V + 副詞句";
  if (text.toLowerCase().includes("take")) {
    if (text.includes("care of") || text.includes("part in")) return "S + V + 句動詞/熟語 + O";
    return "S + V + O";
  }
  if (text.includes("名詞") || text.includes("O")) return "S + V + O";
  return simplifyStructure(structure) || "文型確認中";
}

type GrammarPart = {
  label: "S" | "V" | "O" | "C" | "M";
  text: string;
};

function cleanWord(value: string) {
  return value.replace(/[.,!?;:]$/g, "");
}

function firstSubject(sentence: string) {
  const first = cleanWord(sentence.split(/\s+/)[0] || "");
  if (!first) return "";
  if (/^I'm$/i.test(first)) return "I";
  if (/^We're$/i.test(first)) return "We";
  if (/^They're$/i.test(first)) return "They";
  if (/^It's$/i.test(first)) return "It";
  return first;
}

function inferComplement(sentence: string, focus?: string) {
  if (!focus) return "";
  const words = sentence.replace(/[.,!?;:]$/g, "").split(/\s+/);
  const focusWords = focus.split(/\s+/);
  const lowerWords = words.map((w) => w.toLowerCase());
  const lowerFocus = focusWords.map((w) => cleanWord(w).toLowerCase());
  let index = -1;
  for (let i = 0; i <= lowerWords.length - lowerFocus.length; i += 1) {
    if (lowerFocus.every((fw, j) => lowerWords[i + j] === fw)) {
      index = i;
      break;
    }
  }
  if (index < 0) return "";
  const after = words[index + focusWords.length];
  return cleanWord(after || "");
}

function inferGrammarParts(example: Example, sentencePattern: string): GrammarPart[] {
  const subject = firstSubject(example.en);
  const verb = example.focus || "";
  const parts: GrammarPart[] = [];
  if (subject) parts.push({ label: "S", text: subject });
  if (verb) parts.push({ label: "V", text: verb });

  if (sentencePattern.includes("S + V + C")) {
    const complement = inferComplement(example.en, verb);
    if (complement) parts.push({ label: "C", text: complement });
    return parts;
  }

  if (example.object) {
    parts.push({ label: "O", text: example.object });
    return parts;
  }

  return parts;
}

function GrammarInline({
  example,
  verbPattern,
  sentenceStructure,
}: {
  example: Example;
  verbPattern?: string;
  sentenceStructure?: string;
}) {
  const hasAccess = hasGrammarAccess();
  const sentencePattern = guessPatternLabel(verbPattern, sentenceStructure);
  const cleanStructure = simplifyStructure(sentenceStructure);
  const parts = inferGrammarParts(example, sentencePattern);

  if (!verbPattern && !sentenceStructure) return null;

  if (!hasAccess) {
    return (
      <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-950/20 p-3 text-sm text-amber-100">
        🔒 文型表示は30動詞パックで利用できます。
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-cyan-300/15 bg-slate-950/45 p-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold text-cyan-100">文型・動詞の型</p>
        <span className="rounded-full border border-cyan-300/25 px-2 py-1 text-xs font-bold text-cyan-100">{sentencePattern}</span>
      </div>

      {parts.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {parts.map((part, index) => (
            <div key={`${part.label}-${part.text}-${index}`} className="rounded-xl bg-slate-900/80 px-3 py-2">
              <p className="border-b border-cyan-300/60 pb-1 text-base font-extrabold text-white">{part.text}</p>
              <p className="mt-1 text-center text-xs font-bold text-cyan-200">{part.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 grid gap-2">
        {cleanStructure && (
          <div className="rounded-xl bg-slate-900/70 p-3">
            <p className="text-xs font-bold text-slate-400">文の骨組み</p>
            <p className="mt-1 font-bold text-white">{cleanStructure}</p>
          </div>
        )}
        {verbPattern && (
          <div className="rounded-xl bg-slate-900/70 p-3">
            <p className="text-xs font-bold text-slate-400">動詞の型</p>
            <p className="mt-1 font-extrabold text-cyan-100">{verbPattern}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExampleCard({
  example,
  phrase,
  verbPattern,
  sentenceStructure,
}: {
  example: Example;
  phrase?: Omit<SavedPhrase, "savedAt">;
  verbPattern?: string;
  sentenceStructure?: string;
}) {
  const memoPhrase = useMemo(() => phrase, [phrase]);

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

      <GrammarInline example={example} verbPattern={verbPattern} sentenceStructure={sentenceStructure} />

      {memoPhrase && (
        <div className="mt-4 flex justify-end">
          <PhraseSaveButton phrase={memoPhrase} compact />
        </div>
      )}
    </div>
  );
}
