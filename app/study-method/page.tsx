import Link from "next/link";

export default function StudyMethodPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-muted">Study Method</p>
        <h1 className="mt-1 text-3xl font-bold">1日10分のおすすめ学習法</h1>
        <p className="mt-3 leading-relaxed text-muted">
          読むだけではなく、思い出す回数を増やして「知っている動詞」を「使える動詞」に変えていきます。
        </p>
      </header>

      <section className="card p-6 space-y-5">
        <div>
          <p className="text-sm font-bold text-accent">STEP 1 / 2〜3分</p>
          <h2 className="mt-1 text-xl font-bold">動詞を学ぶ</h2>
          <p className="mt-2 text-muted">
            コアイメージ、使い方、例文を確認します。まずは動詞をどんな場面で使うかを理解します。
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-accent">STEP 2 / 1〜2分</p>
          <h2 className="mt-1 text-xl font-bold">音声を聞く</h2>
          <p className="mt-2 text-muted">
            動詞と例文を聞き、声に出して真似します。目だけでなく耳と口も使います。
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-accent">STEP 3 / 3〜5分</p>
          <h2 className="mt-1 text-xl font-bold">瞬発英作文</h2>
          <p className="mt-2 text-muted">
            日本語を見て、英語をすぐに思い出します。答えを見たら音声で確認し、○×で自己判定します。
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-accent">STEP 4 / 2分</p>
          <h2 className="mt-1 text-xl font-bold">×問題を復習</h2>
          <p className="mt-2 text-muted">
            できなかった問題は再学習へ戻します。苦手だけを繰り返すことで、効率よく定着させます。
          </p>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold">XPとは？</h2>
        <p className="mt-3 leading-relaxed text-muted">
          XPは学習を進めるともらえる経験値です。忙しい社会人でも、短い学習の積み重ねが見えるようにするための数字です。
        </p>
        <div className="mt-4 grid gap-3 text-sm">
          <div className="rounded-2xl bg-paper p-4">
            <p className="font-bold">動詞を学習したとき</p>
            <p className="mt-1 text-muted">基本・句動詞を学習するとXPが入ります。</p>
          </div>
          <div className="rounded-2xl bg-paper p-4">
            <p className="font-bold">テストで「できた」を選んだとき</p>
            <p className="mt-1 text-muted">瞬発英作文で正解できた問題は、毎回XPに加算されます。</p>
          </div>
          <div className="rounded-2xl bg-paper p-4">
            <p className="font-bold">テストを最後まで完了したとき</p>
            <p className="mt-1 text-muted">最後までやり切ると完了ボーナスXPが入ります。</p>
          </div>
          <div className="rounded-2xl bg-paper p-4">
            <p className="font-bold">同じテストを何回受けても加算</p>
            <p className="mt-1 text-muted">何回も思い出すほど定着しやすいので、繰り返し学習でもXPが増えます。</p>
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold">なぜこの方法なのか</h2>
        <p className="mt-3 leading-relaxed text-muted">
          人は一度覚えただけでは忘れます。記憶を強くするには、何度も「思い出す」ことが重要です。このアプリでは、瞬発英作文、○×復習、連続学習、XPやレベルアップを使い、継続しながら思い出す回数を増やします。
        </p>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold">目標</h2>
        <p className="mt-3 text-2xl font-bold">1日10分を続ける</p>
        <p className="mt-3 leading-relaxed text-muted">
          完璧を目指すより、短くても毎日触れることを重視します。社会人でも続けやすい学習リズムを作ることが、このアプリの目的です。
        </p>
      </section>

      <Link className="btn btn-primary block text-center" href="/">
        ホームへ戻る
      </Link>
    </div>
  );
}
