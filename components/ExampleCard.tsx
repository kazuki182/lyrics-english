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
  if (text.includes("人 + to") || text.includes("to不定詞")) return "S + V + O + C";
  if (text.includes("過去分詞")) return "S + V + C";
  if (text.includes("形容詞") || text.includes(" C") || text.includes("+ C")) return "S + V + C";
  if (text.includes("to 場所") || text.includes("場所")) return "S + V + 副詞句";
  if (text.toLowerCase().includes("take")) {
    if (text.includes("care of") || text.includes("part in")) return "S + V + 基本 + O";
    return "S + V + O";
  }
  if (text.includes("名詞") || text.includes("O")) return "S + V + O";
  return simplifyStructure(structure) || "構造確認中";
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
  if (example.grammarParts && example.grammarParts.length > 0) return example.grammarParts;
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
  // Ver.79: SV / SVO / SVC / SVOC labels are intentionally hidden from the user screen.
  // Reason: sentence-pattern labels must not be shown until each example has been manually double-checked.
  // Showing a wrong grammar label is worse than not showing one in a learning app.
  void example;
  void verbPattern;
  void sentenceStructure;
  return null;
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
      <p className="leading-relaxed text-muted">
        {example.ja}
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
