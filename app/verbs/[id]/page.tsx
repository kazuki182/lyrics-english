import Link from "next/link";
import { getVerb } from "@/lib/data";
import SpeakButton from "@/components/SpeakButton";
import ExampleCard from "@/components/ExampleCard";
import PremiumExamples from "@/components/PremiumExamples";
import AutoBookmark from "@/components/AutoBookmark";
import BookmarkButton from "@/components/BookmarkButton";
import VerbProgressPanel from "@/components/VerbProgressPanel";
import VerbAccessGuard from "@/components/VerbAccessGuard";
import { naturalPatternText } from "@/lib/display";

function coreItemIcon(item: string) {
  if (/メール|連絡|message|email/i.test(item)) return "✉️";
  if (/資料|書類|document|file/i.test(item)) return "📄";
  if (/顧客|相手|client|customer/i.test(item)) return "👤";
  if (/商品|部品|sample|parts|product/i.test(item)) return "📦";
  if (/予定|時間|schedule|time/i.test(item)) return "🗓️";
  if (/承認|許可|approval|permission/i.test(item)) return "✅";
  if (/支払い|価格|payment|price|money/i.test(item)) return "💰";
  if (/目標|成果|結果|result|goal/i.test(item)) return "🎯";
  if (/情報|idea|data/i.test(item)) return "💡";
  return "●";
}

export default async function VerbDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const verb = getVerb(id);

  return (
    <VerbAccessGuard rank={verb.rank} verbWord={verb.word}>
    <div className="space-y-5 pb-4">
      <header className="card verb-hero-compact">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-[0.14em] text-cyan-200">No.{String(verb.rank).padStart(2, "0")} / STEP 1 基本動詞</p>
            <h1 className="mt-1 verb-title-compact verb-red">{verb.word}</h1>
            <div className="verb-meta-row">
              <span className="verb-meta-chip">音節 {verb.syllable}</span>
              <span className="verb-meta-chip">発音 {verb.ipa}</span>
              <span className="verb-meta-chip">読み {verb.kana}</span>
              <span className="verb-meta-chip">{verb.transitivity}</span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2">
            <SpeakButton text={verb.word.toLowerCase()} label="通常" />
            <BookmarkButton verbId={verb.id} section="basic" label={`${verb.word} 基本`} href={`/verbs/${verb.id}`} compact />
          </div>
        </div>
      </header>

      <AutoBookmark verbId={verb.id} section="basic" label={`${verb.word} 基本`} href={`/verbs/${verb.id}`} />


      <section className="card p-5 sm:p-6">
        <h2 className="text-xl font-bold">コアイメージ</h2>
        <p className="mt-3 text-2xl font-bold leading-snug">「{verb.core}」</p>
        {verb.coreVisual && (
          <div className="core-diagram-card mt-4">
            <p className="text-xs font-bold tracking-[0.2em] text-cyan-200">CORE IMAGE</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="flex flex-wrap gap-2">
                {verb.coreVisual.from.map((item) => (
                  <span key={item} className="core-icon-chip">
                    <span aria-hidden="true">{coreItemIcon(item)}</span>
                    <span>{item}</span>
                  </span>
                ))}
              </div>
              <div className="core-arrow" aria-hidden="true">→</div>
              <div className="core-target-box">
                <span className="mr-1" aria-hidden="true">🎯</span>{verb.coreVisual.to}
              </div>
            </div>
            <p className="mt-3 text-sm font-bold text-cyan-100">{verb.coreVisual.label}</p>
          </div>
        )}
        <p className="mt-3 leading-relaxed text-muted">{verb.coreDetail}</p>
      </section>

      <VerbProgressPanel verb={verb} />

      <section className="card p-5 sm:p-6">
        <h2 className="text-xl font-bold">{verb.word}攻略フロー</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm">
          <div className="rounded-2xl bg-cyan-400/10 p-3 font-bold text-cyan-100">1<br />基本</div>
          <Link href={`/verbs/${verb.id}/phrasal`} className="rounded-2xl bg-white/5 p-3 font-bold text-muted">2<br />句動詞</Link>
        </div>
      </section>

      {verb.meanings.length > 0 ? (
        <section className="space-y-5">
          <h2 className="px-1 text-xl font-bold">基本</h2>
          {verb.meanings.map((meaning, index) => (
            <article key={meaning.id} id={`meaning-${index + 1}`} className="card scroll-mt-24 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-2xl font-bold leading-tight">{meaning.title}</h3>
                <BookmarkButton verbId={verb.id} section="basic" label={`${verb.word} 基本`} href={`/verbs/${verb.id}#meaning-${index + 1}`} itemTitle={meaning.title} itemIndex={index + 1} compact />
              </div>

              <div className="type-card mt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">型</p>
                <p className="mt-1 text-2xl font-extrabold leading-tight">{naturalPatternText(meaning.pattern)}</p>
                <p className="mt-2 text-sm text-muted">{meaning.structure}</p>
                <p className="mt-1 text-sm text-muted">{meaning.transitivity}</p>
              </div>

              <div className="mt-4 rounded-2xl bg-paper p-4">
                <p className="font-bold">意味のつながり</p>
                <p className="mt-2 leading-relaxed text-muted">{meaning.image}</p>
              </div>

              <div className="point-card mt-4">
                <p className="font-bold">💡 ポイント</p>
                <p className="mt-2 leading-relaxed">{meaning.point}</p>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-full border border-cyan-300/20 bg-slate-950/50 px-3 py-2 text-sm font-bold text-cyan-100">💼 仕事例文（標準）</div>
                {meaning.examples.slice(0, 3).map((example, exampleIndex) => (
                  <ExampleCard
                    key={example.en}
                    example={example}
                    verbPattern={naturalPatternText(meaning.pattern)}
                    sentenceStructure={meaning.structure}
                    phrase={{
                      id: `${verb.id}:basic:${meaning.id}:${exampleIndex}`,
                      verbId: verb.id,
                      section: "basic",
                      meaningTitle: meaning.title,
                      pattern: naturalPatternText(meaning.pattern),
                      en: example.en,
                      ja: example.ja
                    }}
                  />
                ))}
              </div>
              <PremiumExamples
                examples={meaning.dailyExamples}
                phraseBase={{
                  idPrefix: `${verb.id}:basic:${meaning.id}`,
                  verbId: verb.id,
                  section: "basic",
                  meaningTitle: meaning.title,
                  pattern: naturalPatternText(meaning.pattern)
                }}
              />
            </article>
          ))}
        </section>
      ) : (
        <section className="card p-5">
          <p className="text-muted">この動詞の詳細データは追加予定です。</p>
        </section>
      )}

      <section className="card p-5 text-center sm:p-6">
        <h2 className="text-xl font-bold">STEP 1 完了</h2>
        <p className="mt-2 text-muted">まず基本をテストしてから、句動詞へ進みます。</p>
        <Link href={`/tests/${verb.id}/basic`} className="btn btn-primary mt-5 block">基本テストへ</Link>
        <Link href={`/verbs/${verb.id}/phrasal`} className="btn btn-soft mt-3 block">テストせず句動詞へ進む</Link>
      </section>
    </div>
    </VerbAccessGuard>
  );
}
