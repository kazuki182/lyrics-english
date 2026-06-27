import Link from "next/link";
import { verbs } from "@/lib/data";

export default function TestsPage() {
  return (
    <div className="space-y-5 pb-24">
      <header>
        <p className="text-muted">瞬発英作文</p>
        <h1 className="text-3xl font-bold">単語別テスト</h1>
        <p className="mt-2 text-muted">基本動詞・熟語・句動詞を分けて復習できます。</p>
      </header>
      <section className="space-y-3">
        {verbs.map((verb) => (
          <div key={verb.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-2xl font-bold verb-red">{verb.word}</p>
                <p className="mt-1 text-sm text-muted">{verb.core}</p>
              </div>
              <Link className="rounded-full bg-cyan-400 px-3 py-2 text-sm font-bold text-slate-950" href={`/tests/${verb.id}`}>総合</Link>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm font-bold">
              <Link className="rounded-2xl bg-white/5 px-2 py-3" href={`/tests/${verb.id}/basic`}>基本</Link>
              <Link className="rounded-2xl bg-white/5 px-2 py-3" href={`/tests/${verb.id}/idioms`}>熟語</Link>
              <Link className="rounded-2xl bg-white/5 px-2 py-3" href={`/tests/${verb.id}/phrasal`}>句動詞</Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
