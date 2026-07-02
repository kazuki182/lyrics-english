import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="space-y-5 pb-24">
      <header className="card p-6 text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-amber-500">CHECKOUT CANCELED</p>
        <h1 className="mt-3 text-3xl font-black">購入は完了していません</h1>
        <p className="mt-3 text-sm text-muted">
          Stripe画面から戻った、または決済をキャンセルした状態です。料金は発生していません。
        </p>
      </header>

      <section className="digital-card p-5">
        <h2 className="text-xl font-bold text-white">次にすること</h2>
        <div className="mt-4 grid gap-3">
          <Link className="btn btn-primary block text-center" href="/upgrade">もう一度プランを選ぶ</Link>
          <Link className="btn btn-soft block text-center" href="/purchases">購入履歴・復元を確認</Link>
          <Link className="btn btn-soft block text-center" href="/profile">マイページへ戻る</Link>
        </div>
      </section>

      <p className="text-center text-xs text-muted">Verb Master Version 72</p>
    </div>
  );
}
