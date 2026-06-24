import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-muted">About Verb Master</p>
        <h1 className="mt-1 text-3xl font-bold">このアプリについて</h1>
      </header>

      <section className="card p-6">
        <h2 className="text-xl font-bold">開発者について</h2>
        <p className="mt-3 leading-relaxed text-muted">洋楽が好きな、普通の会社員です。英語を話せるようになりたいと思いながら、何度も参考書を買っては中途半端に終わり、挫折を繰り返してきました。</p>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold">作った理由</h2>
        <p className="leading-relaxed text-muted">頻出フレーズを覚えても、そのシチュエーションにならなければ使う機会がなく、結局忘れてしまうことがありました。</p>
        <p className="leading-relaxed text-muted">単語帳で単語を覚えることは資格勉強には役立ちます。ただ、動詞を実際に使いこなす力とは少し違うと感じています。</p>
        <p className="leading-relaxed text-muted">そこで、日常会話でよく使う基本動詞を、コアイメージ、文型、例文、発音、瞬発英作文で繰り返し学べるアプリを作ろうと考えました。</p>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold">このアプリが目指すこと</h2>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm font-bold">
          <div className="rounded-xl bg-paper p-3">知る</div>
          <div className="rounded-xl bg-paper p-3">理解する</div>
          <div className="rounded-xl bg-paper p-3">思い出す</div>
          <div className="rounded-xl bg-paper p-3">使える</div>
        </div>
        <p className="mt-4 leading-relaxed text-muted">基本動詞の使い方をマスターし、テストで瞬発力を鍛えることで、実際の会話でも使える状態を目指します。</p>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold">正直な考え</h2>
        <p className="mt-3 leading-relaxed text-muted">このアプリだけで英語が話せるようになるわけではありません。話せるようになるには、本人の努力と習慣化が必要です。このアプリは、その継続をサポートするためのツールです。</p>
        <p className="mt-3 leading-relaxed text-muted">同僚には毎年のように「英語を話せるようになりたい」と言ってきました。今年こそ実現するために、自分自身も使い続けたいアプリとして開発しています。</p>
      </section>

      <Link className="btn btn-primary block text-center" href="/">ホームへ戻る</Link>
    </div>
  );
}
