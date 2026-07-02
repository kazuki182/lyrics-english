import { verbs, testItems, type Example, type PhraseBlock, type Verb } from "@/lib/data";

export type QualityLevel = "公開OK" | "確認中" | "修正必要";

export type QualityIssue = {
  level: "high" | "medium" | "low";
  label: string;
  detail: string;
};

export type VerbQualityAudit = {
  verb: Verb;
  status: QualityLevel;
  score: number;
  accessLabel: string;
  usageCount: number;
  phrasalCount: number;
  /** Backward compatibility only: old admin components may still reference these. UI must not show a separate collocation/idiom category. */
  collocationCount: number;
  collocationsOk: boolean;
  /** Backward compatibility only: old admin components may still reference the previous idiom test fields. UI must not show a separate idiom category. */
  idiomTestTotal: number;
  idiomsOk: boolean;
  idiomCount: number;
  businessExampleTotal: number;
  premiumDailyExampleTotal: number;
  testTotal: number;
  basicTestTotal: number;
  phrasalTestTotal: number;
  usageCountOk: boolean;
  usageCountGood: boolean;
  businessExamplesOk: boolean;
  premiumDailyExamplesOk: boolean;
  phrasalOk: boolean;
  testsOk: boolean;
  casingOk: boolean;
  placeholderOk: boolean;
  japanesePromptOk: boolean;
  grammarNeedsManualReview: boolean;
  issues: QualityIssue[];
};

export type QualitySummary = {
  total: number;
  ready: number;
  checking: number;
  needsFix: number;
  averageScore: number;
  duplicateWords: Array<{ word: string; ranks: number[] }>;
  allCapsCount: number;
  placeholderCount: number;
  lowUsageCount: number;
};

const SUBJECT_HINTS = [
  "私", "私たち", "あなた", "彼", "彼女", "上司", "担当者", "チーム", "会社", "顧客", "クライアント", "取引先", "営業", "マネージャー", "メンバー", "同僚"
];

const BUSINESS_HINTS = [
  "見積", "納期", "資料", "会議", "メール", "提案", "承認", "発注", "注文", "請求", "報告", "確認", "共有", "予定", "プロジェクト", "契約", "価格", "依頼", "返信"
];

const PLACEHOLDER_PATTERNS = [
  "I want to learn how to use",
  "This phrase is useful in everyday conversation",
  "the details with the team",
  "this today",
  "詳細を確認・対応します",
  "自然に使えるようになりたいです",
  "この表現は日常会話でも役立ちます"
];

export function getAccessLabel(rank: number) {
  if (rank <= 3) return "無料3語";
  if (rank <= 30) return "30語パック";
  if (rank <= 60) return "60語パック";
  if (rank <= 90) return "90語パック";
  return "120語パック+";
}

function isSuspiciousAllCaps(text?: string) {
  if (!text) return false;
  const trimmed = text.trim();
  if (trimmed.length < 5) return false;
  if (!/[A-Z]/.test(trimmed)) return false;
  if (/[a-z]/.test(trimmed)) return false;
  // One short word such as GET is allowed; phrase-like all caps is not.
  if (!/[\s_+\-/]/.test(trimmed) && trimmed.length <= 12) return false;
  // Japanese labels and star-only labels are not relevant.
  if (!/[A-Z]{2,}/.test(trimmed)) return false;
  return true;
}

function hasPlaceholderText(text?: string) {
  if (!text) return false;
  return PLACEHOLDER_PATTERNS.some((pattern) => text.includes(pattern));
}

function collectExampleTexts(example: Example) {
  return [example.en, example.ja, example.focus, example.object, example.jaFocus, example.sentencePattern, example.grammarNote].filter(Boolean) as string[];
}

function collectPhraseTexts(phrase: PhraseBlock) {
  const texts = [phrase.phrase, phrase.ja, phrase.image, phrase.pattern];
  for (const example of phrase.examples) texts.push(...collectExampleTexts(example));
  for (const example of phrase.dailyExamples || []) texts.push(...collectExampleTexts(example));
  return texts.filter(Boolean) as string[];
}

function collectVerbTexts(verb: Verb) {
  const texts: string[] = [verb.core, verb.coreDetail, verb.transitivity, verb.importance];
  for (const meaning of verb.meanings) {
    texts.push(meaning.title, meaning.pattern, meaning.transitivity, meaning.structure, meaning.image, meaning.point);
    for (const example of meaning.examples) texts.push(...collectExampleTexts(example));
    for (const example of meaning.dailyExamples || []) texts.push(...collectExampleTexts(example));
  }
  for (const phrase of verb.collocations) texts.push(...collectPhraseTexts(phrase));
  for (const phrase of verb.phrasalVerbs) texts.push(...collectPhraseTexts(phrase));
  return texts.filter(Boolean);
}

function hasClearJapanesePrompt(ja: string) {
  const compact = ja.trim();
  if (compact.length < 12) return false;
  const hasSubject = SUBJECT_HINTS.some((hint) => compact.includes(hint));
  const hasContext = BUSINESS_HINTS.some((hint) => compact.includes(hint));
  const isQuestion = compact.includes("?") || compact.includes("？") || compact.includes("できますか") || compact.includes("でしょうか");
  const isImperative = compact.includes("してください") || compact.includes("お願いします");
  return hasSubject || hasContext || isQuestion || isImperative;
}

function addIssue(issues: QualityIssue[], level: QualityIssue["level"], label: string, detail: string) {
  issues.push({ level, label, detail });
}

export function auditVerbQuality(verb: Verb): VerbQualityAudit {
  const issues: QualityIssue[] = [];
  const usageCount = verb.meanings.length;
  const usageCountOk = usageCount >= 5;
  const usageCountGood = usageCount >= 8;
  if (!usageCountOk) {
    addIssue(issues, "high", "使い方不足", `基本の使い方が${usageCount}種類です。原則5〜10種類、できれば10種類に近づけます。`);
  } else if (!usageCountGood) {
    addIssue(issues, "medium", "使い方追加候補", `基本の使い方が${usageCount}種類です。自然に増やせるなら8〜10種類へ拡張します。`);
  }

  const meaningsWithFewExamples = verb.meanings.filter((meaning) => meaning.examples.length < 3);
  const businessExamplesOk = meaningsWithFewExamples.length === 0;
  if (!businessExamplesOk) {
    addIssue(issues, "high", "ビジネス例文不足", `${meaningsWithFewExamples.length}個の使い方で例文が3つ未満です。`);
  }

  const meaningsWithFewDaily = verb.meanings.filter((meaning) => (meaning.dailyExamples || []).length < 2);
  const premiumDailyExamplesOk = meaningsWithFewDaily.length === 0;
  if (!premiumDailyExamplesOk) {
    addIssue(issues, "medium", "Premium日常例文不足", `${meaningsWithFewDaily.length}個の使い方で日常例文が2つ未満です。`);
  }

  const collocationCount = verb.collocations.length;
  const collocationsOk = true;
  const idiomCount = collocationCount;
  const idiomsOk = true;

  const phrasalCount = verb.phrasalVerbs.length;
  const phrasalWithFewExamples = verb.phrasalVerbs.filter((item) => item.examples.length < 3);
  const phrasalOk = phrasalCount >= 5 && phrasalWithFewExamples.length === 0;
  if (!phrasalOk) {
    addIssue(issues, phrasalCount < 5 ? "medium" : "high", "句動詞不足", `句動詞 ${phrasalCount}種類。該当表現が少ない動詞は理由をメモします。`);
  }

  const verbTests = testItems.filter((item) => item.verbId === verb.id);
  const basicTestTotal = verbTests.filter((item) => item.section === "basic" || item.section === "idioms").length;
  const idiomTestTotal = 0;
  const phrasalTestTotal = verbTests.filter((item) => item.section === "phrasal").length;
  const expectedBasic = verb.meanings.reduce((sum, meaning) => sum + Math.min(3, meaning.examples.length), 0);
  const testsOk = basicTestTotal >= expectedBasic && phrasalTestTotal > 0;
  if (!testsOk) {
    addIssue(issues, "high", "テスト反映不足", `basic:${basicTestTotal} / phrasal:${phrasalTestTotal}`);
  }

  const allTexts = collectVerbTexts(verb);
  const allCapsTexts = allTexts.filter(isSuspiciousAllCaps);
  const casingOk = allCapsTexts.length === 0;
  if (!casingOk) {
    addIssue(issues, "high", "大文字表記", `不自然な大文字表記が${allCapsTexts.length}件あります。例：${allCapsTexts.slice(0, 2).join(" / ")}`);
  }

  const placeholderTexts = allTexts.filter(hasPlaceholderText);
  const placeholderOk = placeholderTexts.length === 0;
  if (!placeholderOk) {
    addIssue(issues, "high", "自動生成っぽい文", `仮文・汎用文が${placeholderTexts.length}件あります。`);
  }

  const unclearJapanese = verbTests.filter((item) => !hasClearJapanesePrompt(item.ja));
  const japanesePromptOk = unclearJapanese.length === 0;
  if (!japanesePromptOk) {
    addIssue(issues, "medium", "日本語テスト文", `主語・時制・内容が曖昧な可能性：${unclearJapanese.length}件`);
  }

  const grammarNeedsManualReview = verb.meanings.some((meaning) =>
    meaning.examples.some((example) => Boolean(example.sentencePattern || example.grammarParts?.length)) ||
    (meaning.dailyExamples || []).some((example) => Boolean(example.sentencePattern || example.grammarParts?.length))
  );
  if (grammarNeedsManualReview) {
    addIssue(issues, "low", "構造データあり", "文法・構造ラベルはユーザー画面では非表示。復活前に1文ずつ手動確認が必要です。");
  }

  const businessExampleTotal = verb.meanings.reduce((sum, meaning) => sum + meaning.examples.length, 0);
  const premiumDailyExampleTotal = verb.meanings.reduce((sum, meaning) => sum + (meaning.dailyExamples || []).length, 0);

  const high = issues.filter((issue) => issue.level === "high").length;
  const medium = issues.filter((issue) => issue.level === "medium").length;
  const score = Math.max(0, Math.round(100 - high * 18 - medium * 8 - issues.filter((issue) => issue.level === "low").length * 3));
  const status: QualityLevel = high > 0 ? "修正必要" : medium > 0 ? "確認中" : "公開OK";

  return {
    verb,
    status,
    score,
    accessLabel: getAccessLabel(verb.rank),
    usageCount,
    phrasalCount,
    collocationCount,
    collocationsOk,
    idiomTestTotal,
    idiomsOk,
    idiomCount,
    businessExampleTotal,
    premiumDailyExampleTotal,
    testTotal: verbTests.length,
    basicTestTotal,
    phrasalTestTotal,
    usageCountOk,
    usageCountGood,
    businessExamplesOk,
    premiumDailyExamplesOk,
    phrasalOk,
    testsOk,
    casingOk,
    placeholderOk,
    japanesePromptOk,
    grammarNeedsManualReview,
    issues
  };
}

export function getDuplicateWords() {
  const map = new Map<string, number[]>();
  for (const verb of verbs) {
    const key = verb.word.toLowerCase();
    map.set(key, [...(map.get(key) || []), verb.rank]);
  }
  return [...map.entries()]
    .filter(([, ranks]) => ranks.length > 1)
    .map(([word, ranks]) => ({ word, ranks }));
}

export function getAllVerbQualityAudits() {
  return verbs.map(auditVerbQuality);
}

export function getQualitySummary(rows = getAllVerbQualityAudits()): QualitySummary {
  const duplicateWords = getDuplicateWords();
  const total = rows.length;
  const ready = rows.filter((row) => row.status === "公開OK").length;
  const checking = rows.filter((row) => row.status === "確認中").length;
  const needsFix = rows.filter((row) => row.status === "修正必要").length;
  const averageScore = total ? Math.round(rows.reduce((sum, row) => sum + row.score, 0) / total) : 0;
  return {
    total,
    ready,
    checking,
    needsFix,
    averageScore,
    duplicateWords,
    allCapsCount: rows.filter((row) => !row.casingOk).length,
    placeholderCount: rows.filter((row) => !row.placeholderOk).length,
    lowUsageCount: rows.filter((row) => !row.usageCountOk).length
  };
}
