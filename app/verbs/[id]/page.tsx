import Link from "next/link";
import { getVerb, verbs } from "@/lib/data";
import SpeakButton from "@/components/SpeakButton";
import ExampleCard from "@/components/ExampleCard";

export function generateStaticParams() {
  return verbs.map((verb) => ({ id: verb.id }));
}

export default async function VerbDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const verb = getVerb(id);

  return (
    <div className="space-y-5 pb-4">
      <header className="card p-5 sm:p-6">
        <p className="text-sm text-muted">STEP 1 / 3　基本動詞</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight verb-red sm:text-6xl">{verb.word}</h1>
        <div className="mt-3 grid gap-2 text-sm text-muted">
          <p>音節：{verb.syllable}</p>
          <p>発音：{verb.ipa}</p>
          <p>読み方：{verb.kana}</p>
        </div>
        <div className="mt-4">
          <SpeakButton text={verb.word.toLowerCase()} label="通常" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-paper px-3 py-1 font-semibold">{verb.transitivity}</span>
          <span className="rounded-full bg-paper px-3 py-1 font-semibold">{verb.importance}</span>
        </div>
      </header>

      <section className="card p-5 sm:p-6">
        <h2 className="text-xl font-bold">コアイメージ</h2>
        <p className="mt-3 text-2xl font-bold leading-snug">「{verb.core}」</p>
        <p className="mt-3 leading-relaxed text-muted">{verb.coreDetail}</p>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-xl font-bold">GET攻略フロー</h2>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-2xl bg-cyan-400/10 p-3 font-bold text-cyan-100">1<br />基本</div>
          <Link href={`/verbs/${verb.id}/idioms`} className="rounded-2xl bg-white/5 p-3 font-bold text-muted">2<br />熟語</Link>
          <Link href={`/verbs/${verb.id}/phrasal`} className="rounded-2xl bg-white/5 p-3 font-bold text-muted">3<br />句動詞</Link>
        </div>
      </section>

      {verb.meanings.length > 0 ? (
        <section className="space-y-5">
          <h2 className="px-1 text-xl font-bold">動詞単体の使い方</h2>
          {verb.meanings.map((meaning) => (
            <article key={meaning.id} className="card p-5 sm:p-6">
              <h3 className="text-2xl font-bold leading-tight">{meaning.title}</h3>

              <div className="type-card mt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">型</p>
                <p className="mt-1 text-2xl font-extrabold leading-tight">{meaning.pattern}</p>
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
                {meaning.examples.slice(0, 3).map((example) => <ExampleCard key={example.en} example={example} />)}
              </div>
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
        <p className="mt-2 text-muted">まず基本動詞だけをテストしてから、熟語へ進みます。</p>
        <Link href={`/tests/${verb.id}/basic`} className="btn btn-primary mt-5 block">基本動詞テストへ</Link>
        <Link href={`/verbs/${verb.id}/idioms`} className="btn btn-soft mt-3 block">テストせず熟語へ進む</Link>
      </section>
    </div>
  );
}
