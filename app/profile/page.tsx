"use client";

import { useEffect, useState } from "react";
import { formatDateTime, getAllProgress, getCurrentProgress, getCurrentUsername, getDueReviewItems, getFutureReviewItems, type UserProgress } from "@/lib/account";
import { verbs } from "@/lib/data";

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [ranking, setRanking] = useState<UserProgress[]>([]);

  useEffect(() => {
    const user = getCurrentUsername();
    if (!user) { window.location.href = "/login"; return; }
    setUsername(user);
    setProgress(getCurrentProgress());
    setRanking(getAllProgress());
  }, []);

  if (!username || !progress) return <p className="text-muted">読み込み中...</p>;
  const percent = Math.round((progress.studiedVerbIds.length / verbs.length) * 100);
  const dueReviewCount = getDueReviewItems().length;
  const futureReviewCount = getFutureReviewItems().length;

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">学習記録</h1>
      <section className="card p-5">
        <p className="text-sm text-muted">アカウント</p>
        <p className="text-2xl font-bold">{username}</p>
        <p className="mt-2 text-sm text-muted">最終ログイン：{formatDateTime(progress.lastLoginAt)}</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="card p-5"><p className="text-sm text-muted">現在</p><p className="text-2xl font-bold">{progress.currentRound}周目</p></div>
        <div className="card p-5"><p className="text-sm text-muted">進捗</p><p className="text-2xl font-bold">{progress.studiedVerbIds.length}/{verbs.length}</p></div>
        <div className="card p-5"><p className="text-sm text-muted">達成率</p><p className="text-2xl font-bold">{percent}%</p></div>
        <div className="card p-5"><p className="text-sm text-muted">XP / Lv</p><p className="text-2xl font-bold">{progress.xp} / Lv.{progress.level}</p></div>
        <div className="card p-5"><p className="text-sm text-muted">連続学習</p><p className="text-2xl font-bold">{progress.currentStreak}日</p></div>
        <div className="card p-5"><p className="text-sm text-muted">今日の復習</p><p className="text-2xl font-bold">{dueReviewCount}問</p></div>
        <div className="card p-5"><p className="text-sm text-muted">復習予定</p><p className="text-2xl font-bold">{futureReviewCount}問</p></div>
        <div className="card p-5"><p className="text-sm text-muted">苦手累計</p><p className="text-2xl font-bold">{progress.weakItems.length}</p></div>
      </section>

      <section className="card p-5">
        <h2 className="text-xl font-bold">ゲーム実績</h2>
        <div className="mt-4 grid gap-3">
          <div className="rounded-xl bg-paper p-4">🏁 初回学習：{progress.totalStudied > 0 ? "達成" : "未達成"}</div>
          <div className="rounded-xl bg-paper p-4">🔥 3日連続：{progress.currentStreak >= 3 ? "達成" : "挑戦中"}</div>
          <div className="rounded-xl bg-paper p-4">👑 1周完了：{progress.currentRound > 1 ? "達成" : "挑戦中"}</div>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-xl font-bold">XPランキング</h2>
        <div className="mt-4 space-y-2">
          {ranking.map((p, i) => (
            <div key={p.username} className="flex justify-between rounded-xl bg-paper p-3">
              <span>{i + 1}. {p.username}</span>
              <span className="font-bold">{p.xp} XP</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
