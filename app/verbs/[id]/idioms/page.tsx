import Link from "next/link";
import { getVerb } from "@/lib/data";
import SpeakButton from "@/components/SpeakButton";
import ExampleCard from "@/components/ExampleCard";
import PremiumExamples from "@/components/PremiumExamples";
import AutoBookmark from "@/components/AutoBookmark";
import BookmarkButton from "@/components/BookmarkButton";


export default async function VerbIdiomsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const verb = getVerb(id);
  const items = verb.collocations.slice(0, 10);

  return (
    <div className="space-y-5 pb-4">
      <header className="card p-5 sm:p-6">
        <p className="text-sm text-muted">STEP 2 / 3　熟語</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl"><span className="verb-red">{verb.word}</span> 熟語</h1>
        <p className="mt-3 leading-relaxed text-muted">動詞単体のイメージを、よく使うまとまり表現に広げます。</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/verbs/${verb.id}`} className="rounded-full bg-white/5 px-3 py-2 text-sm font-bold">基本へ戻る</Link>
          <Link href={`/verbs/${verb.id}/phrasal`} className="rounded-full bg-white/5 px-3 py-2 text-sm font-bold">句動詞へ</Link>
          <BookmarkButton verbId={verb.id} section="idioms" label={`${verb.word} 熟語`} href={`/verbs/${verb.id}/idioms`} compact />
        </div>
      </header>

      <AutoBookmark verbId={verb.id} section="idioms" label={`${verb.word} 熟語`} href={`/verbs/${verb.id}/idioms`} />

      {items.length > 0 ? (
        <section className="space-y-5">
          <div className="section-label section-label-collocation">🟢 熟語 10</div>
          {items.map((p, index) => (
            <article key={p.phrase} className="card border-green-200 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-bold text-muted">#{index + 1}</p>
                <BookmarkButton verbId={verb.id} section="idioms" label={`${verb.word} 熟語`} href={`/verbs/${verb.id}/idioms#item-${index + 1}`} itemTitle={p.phrase} itemIndex={index + 1} compact />
              </div>
              <h2 id={`item-${index + 1}`} className="mt-1 scroll-mt-24 text-3xl font-bold leading-tight"><span className="collocation-text">{p.phrase}</span></h2>
              <p className="mt-1 text-lg text-muted">{p.ja}</p>
              <div className="mt-3"><SpeakButton text={p.phrase} label="通常" /></div>
              <div className="type-card type-card-green mt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">型</p>
                <p className="mt-1 text-xl font-extrabold">{p.pattern}</p>
              </div>
              <div className="point-card mt-4">
                <p className="font-bold">💡 イメージ</p>
                <p className="mt-2 leading-relaxed">{p.image}</p>
              </div>
              <div className="mt-4 space-y-3">
                <div className="rounded-full border border-green-300/20 bg-slate-950/50 px-3 py-2 text-sm font-bold text-green-100">💼 仕事例文（標準）</div>
                {p.examples.slice(0, 3).map((e, exampleIndex) => (
                  <ExampleCard
                    key={e.en}
                    example={e}
                    verbPattern={p.pattern}
                    sentenceStructure={p.pattern}
                    phrase={{
                      id: `${verb.id}:idioms:${index}:${exampleIndex}`,
                      verbId: verb.id,
                      section: "idioms",
                      meaningTitle: `熟語：${p.phrase}`,
                      pattern: p.pattern,
                      en: e.en,
                      ja: e.ja
                    }}
                  />
                ))}
              </div>
              <PremiumExamples
                examples={p.dailyExamples}
                phraseBase={{
                  idPrefix: `${verb.id}:idioms:${index}`,
                  verbId: verb.id,
                  section: "idioms",
                  meaningTitle: `熟語：${p.phrase}`,
                  pattern: p.pattern
                }}
              />
            </article>
          ))}
        </section>
      ) : (
        <section className="card p-5"><p className="text-muted">この動詞の熟語データは追加予定です。</p></section>
      )}

      <section className="card p-5 text-center sm:p-6">
        <h2 className="text-xl font-bold">STEP 2 完了</h2>
        <p className="mt-2 text-muted">熟語だけをテストしてから、句動詞へ進みます。</p>
        <Link href={`/tests/${verb.id}/idioms`} className="btn btn-primary mt-5 block">熟語テストへ</Link>
        <Link href={`/verbs/${verb.id}/phrasal`} className="btn btn-soft mt-3 block">テストせず句動詞へ進む</Link>
      </section>
    </div>
  );
}
