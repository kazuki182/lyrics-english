import Link from "next/link";

const guideItems = [
  {
    title: "今日の動詞",
    badge: "基本",
    description: "その日に学ぶ動詞を確認します。コアイメージ、意味、例文、音声で“使い方”まで見る場所です。",
    steps: ["まずコアイメージで動詞の中心イメージを見る", "日常例文とビジネス例文で使う場面を確認", "音声で聞いて、声に出して読む"],
    href: "/",
    cta: "ホームへ戻る",
  },
  {
    title: "動詞一覧",
    badge: "一覧",
    description: "登録されている動詞を一覧で確認できます。学習済み、未学習、Premiumロック状態もここで確認します。",
    steps: ["学びたい動詞を探す", "ロック中の動詞は解放プランを確認", "学習済みの動詞を復習に使う"],
    href: "/verbs",
    cta: "動詞一覧を見る",
  },
  {
    title: "テスト",
    badge: "確認",
    description: "覚えたつもりで終わらせず、問題で確認します。途中保存にも対応しています。",
    steps: ["学習した動詞をテストで確認", "間違えた問題は復習対象に追加", "途中でやめても続きから再開"],
    href: "/tests",
    cta: "テストへ",
  },
  {
    title: "復習",
    badge: "定着",
    description: "間違えた問題や苦手な動詞をもう一度確認する場所です。忘れる前に戻ることで定着しやすくします。",
    steps: ["間違えた問題を確認", "正解できるまで繰り返す", "苦手な動詞を減らす"],
    href: "/review",
    cta: "復習へ",
  },
  {
    title: "フレーズ保存",
    badge: "保存",
    description: "覚えたい例文を保存して、自分だけのフレーズ帳として見返せます。",
    steps: ["気になる例文を保存", "あとでフレーズ帳から確認", "シャッフルテストで使えるか確認"],
    href: "/phrase-book",
    cta: "保存フレーズへ",
  },
  {
    title: "学習ペース",
    badge: "計画",
    description: "何日で何語学ぶか、目標日までに間に合うかを確認します。無理なく続けるための計画機能です。",
    steps: ["目標日を決める", "何日で何語学ぶか設定", "このままだと間に合うか確認"],
    href: "/",
    cta: "学習ペースを見る",
  },
  {
    title: "マイページ",
    badge: "記録",
    description: "プロフィール、学習記録、バッジ、購入履歴、設定をまとめて確認する場所です。",
    steps: ["ニックネームや画像を設定", "学習記録とバッジを見る", "購入履歴や復元を確認"],
    href: "/profile",
    cta: "マイページへ",
  },
  {
    title: "Premium",
    badge: "解放",
    description: "無料では3動詞まで。課金ごとに30・60・90・120動詞へ段階解放し、91番以降は120語パック対象として扱います。復習強化、フレーズ保存、クラウド保存などを使えます。",
    steps: ["解放数と金額を確認", "購入確認画面へ進む", "購入履歴・復元で状態を確認"],
    href: "/upgrade",
    cta: "Premiumを見る",
  },
];

export default function GuidePage() {
  return (
    <div className="space-y-5 pb-28">
      <header className="space-y-2">
        <p className="text-sm text-muted">迷った時に見るページ</p>
        <h1 className="text-3xl font-bold">使い方ガイド</h1>
        <p className="leading-7 text-slate-300">
          Verb Masterの各機能を、何のために使うのか分かりやすくまとめました。
          まずは「今日の動詞 → テスト → 復習」の流れで使うのがおすすめです。
        </p>
      </header>

      <section className="digital-card p-5">
        <p className="text-xs font-bold tracking-[0.22em] text-cyan-200">BASIC FLOW</p>
        <h2 className="mt-2 text-xl font-extrabold">基本の使い方</h2>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div className="guide-flow-card">
            <p className="guide-flow-number">1</p>
            <p className="mt-2 font-extrabold text-white">動詞を学ぶ</p>
            <p className="mt-1 text-slate-300">意味だけでなく、コアイメージと例文で使い方を見る。</p>
          </div>
          <div className="guide-flow-card">
            <p className="guide-flow-number">2</p>
            <p className="mt-2 font-extrabold text-white">テストする</p>
            <p className="mt-1 text-slate-300">覚えたつもりを防ぐため、問題で確認する。</p>
          </div>
          <div className="guide-flow-card">
            <p className="guide-flow-number">3</p>
            <p className="mt-2 font-extrabold text-white">復習する</p>
            <p className="mt-1 text-slate-300">間違えた問題を戻って、苦手を減らす。</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-cyan-200">FEATURE GUIDE</p>
            <h2 className="mt-1 text-2xl font-bold">機能別の使い方</h2>
          </div>
          <Link className="rounded-full border border-cyan-300/25 px-4 py-2 text-xs font-bold text-cyan-100" href="/">
            ホーム
          </Link>
        </div>

        <div className="grid gap-3">
          {guideItems.map((item) => (
            <article key={item.title} className="guide-feature-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="guide-badge">{item.badge}</span>
                  <h3 className="mt-2 text-xl font-extrabold text-white">{item.title}</h3>
                  <p className="mt-2 leading-7 text-slate-300">{item.description}</p>
                </div>
                <Link className="guide-link-button shrink-0" href={item.href}>
                  開く
                </Link>
              </div>
              <ol className="mt-4 space-y-2 text-sm text-slate-300">
                {item.steps.map((step, index) => (
                  <li key={step} className="flex gap-2">
                    <span className="guide-step-dot">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <Link className="mt-4 inline-flex text-sm font-bold text-cyan-100" href={item.href}>
                {item.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
