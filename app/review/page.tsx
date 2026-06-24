"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import InstantTest from "@/components/InstantTest";
import { formatDate, getCurrentUsername, getDueReviewItems, getFutureReviewItems, type ReviewItem } from "@/lib/account";
import { getTestItemById, getVerb } from "@/lib/data";

export default function ReviewPage() {
  const [loaded, setLoaded] = useState(false);
  const [due, setDue] = useState<ReviewItem[]>([]);
  const [future, setFuture] = useState<ReviewItem[]>([]);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const user = getCurrentUsername();
    if (!user) { window.location.href = "/login"; return; }
    setDue(getDueReviewItems());
    setFuture(getFutureReviewItems());
    setLoaded(true);
  }, []);

  const dueIds = useMemo(() => due.map((item) => item.itemId), [due]);

  if (!loaded) return <p className="text-muted">復習リストを読み込み中...</p>;

  if (start && dueIds.length > 0) {
    return (
      <InstantTest
        itemIds={dueIds}
        reviewMode
        title="復習テスト"
        description="×だった例文を優先して、日本語から英語を瞬発的に思い出します。"
      />
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-muted">Auto Review</p>
        <h1 className="text-3xl font-bold">自動復習</h1>
        <p className="mt-2 text-muted">×にした例文を、翌日・3日後・7日後に出し直します。</p>
      </header>

      <section className="card p-6">
        <p className="text-sm font-bold text-muted">今日復習する問題</p>
        <p className="mt-2 text-4xl font-bold">{due.length}問</p>
        <button disabled={due.length === 0} onClick={() => setStart(true)} className="btn btn-primary mt-5 w-full disabled:opacity-40">
          復習を始める
        </button>
      </section>

      {due.length > 0 && (
        <section className="card p-5">
          <h2 className="text-xl font-bold">今日の復習リスト</h2>
          <div className="mt-4 space-y-3">
            {due.map((review) => {
              const item = getTestItemById(review.itemId);
              const verb = getVerb(review.verbId);
              return (
                <div key={review.itemId} className="rounded-2xl bg-paper p-4">
                  <p className="font-bold"><span className="verb-red">{verb.word}</span> / {item?.meaningTitle}</p>
                  <p className="mt-1 text-muted">{item?.ja || review.itemId}</p>
                  <p className="mt-2 text-sm text-muted">次回予定：{formatDate(review.nextReviewAt)} / 間違い {review.wrongCount}回</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="card p-5">
        <h2 className="text-xl font-bold">今後の復習予定</h2>
        {future.length === 0 ? (
          <p className="mt-3 text-muted">予定はまだありません。テストで×にすると自動で追加されます。</p>
        ) : (
          <div className="mt-4 space-y-3">
            {future.slice(0, 8).map((review) => {
              const item = getTestItemById(review.itemId);
              const verb = getVerb(review.verbId);
              return (
                <div key={review.itemId} className="flex items-center justify-between rounded-2xl bg-paper p-4">
                  <div>
                    <p className="font-bold"><span className="verb-red">{verb.word}</span> {item?.meaningTitle}</p>
                    <p className="text-sm text-muted">{item?.ja}</p>
                  </div>
                  <span className="text-sm text-muted">{formatDate(review.nextReviewAt)}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Link href="/tests" className="btn btn-soft block text-center">単語別テストへ</Link>
    </div>
  );
}
