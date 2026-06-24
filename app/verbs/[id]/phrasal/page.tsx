import Link from "next/link";
import { getVerb, verbs } from "@/lib/data";
import SpeakButton from "@/components/SpeakButton";
import ExampleCard from "@/components/ExampleCard";

export function generateStaticParams() {
  return verbs.map((verb) => ({ id: verb.id }));
}

export default async function VerbPhrasalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const verb = getVerb(id);
  const items = verb.phrasalVerbs.slice(0, 10);

  return (
    <div className="space-y-5 pb-4">
      <header className="card p-5 sm:p-6">
        <p className="text-sm text-muted">STEP 3 / 3　句動詞</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl"><span className="verb-red">{verb.word}</span> 句動詞</h1>
        <p className="mt-3 leading-relaxed text-muted">基本動詞に up / out / over などが加わった時のイメージを学びます。</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/verbs/${verb.id}`} className="rounded-full bg-white/5 px-3 py-2 text-sm font-bold">基本へ戻る</Link>
          <Link href={`/verbs/${verb.id}/idioms`} className="rounded-full bg-white/5 px-3 py-2 text-sm font-bold">熟語へ戻る</Link>
        </div>
      </header>

      {items.length > 0 ? (
        <section className="space-y-5">
          <div className="section-label section-label-phrasal">🔵 句動詞 10</div>
          {items.map((p, index) => (
            <article key={p.phrase} className="card border-blue-200 p-5 sm:p-6">
              <p className="text-sm font-bold text-muted">#{index + 1}</p>
              <h2 className="mt-1 text-3xl font-bold leading-tight"><span className="phrasal-text">{p.phrase}</span></h2>
              <p className="mt-1 text-lg text-muted">{p.ja}</p>
              <div className="mt-3"><SpeakButton text={p.phrase} label="通常" /></div>
              <div className="type-card type-card-blue mt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">型</p>
                <p className="mt-1 text-xl font-extrabold">{p.pattern}</p>
              </div>
              <div className="point-card mt-4">
                <p className="font-bold">💡 イメージ</p>
                <p className="mt-2 leading-relaxed">{p.image}</p>
              </div>
              <div className="mt-4 space-y-3">{p.examples.slice(0, 3).map((e) => <ExampleCard key={e.en} example={e} />)}</div>
            </article>
          ))}
        </section>
      ) : (
        <section className="card p-5"><p className="text-muted">この動詞の句動詞データは追加予定です。</p></section>
      )}

      <section className="card p-5 text-center sm:p-6">
        <h2 className="text-xl font-bold">STEP 3 完了</h2>
        <p className="mt-2 text-muted">句動詞だけをテストしてから、総合テストへ進みます。</p>
        <Link href={`/tests/${verb.id}/phrasal`} className="btn btn-primary mt-5 block">句動詞テストへ</Link>
        <Link href={`/tests/${verb.id}`} className="btn btn-soft mt-3 block">総合テストへ進む</Link>
      </section>
    </div>
  );
}
