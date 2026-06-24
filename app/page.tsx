"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { verbs } from "@/lib/data";
import {
  getCurrentProgress,
  getCurrentUsername,
  getDueReviewItems,
  getLearningPlan,
  getTargetDate,
  initAdminAccount,
  logout,
  setTargetDate,
  type UserProgress
} from "@/lib/account";

function splitTarget(value: string) {
  if (!value) return { year: "----", day: "--.--" };
  const [year, month, day] = value.split("-");
  return { year: year ?? "----", day: `${month ?? "--"}.${day ?? "--"}` };
}

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [target, setTarget] = useState("");
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    initAdminAccount();
    const user = getCurrentUsername();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setUsername(user);
    setProgress(getCurrentProgress());
    setTarget(getTargetDate());
    setReviewCount(getDueReviewItems().length);
  }, []);

  if (!username || !progress) return <p className="text-muted">Loading...</p>;

  const completed = progress.studiedVerbIds.length;
  const plan = getLearningPlan(verbs.length, completed);
  const targetParts = splitTarget(plan.targetDate);
  const updateTarget = (value: string) => {
    setTarget(value);
    setTargetDate(value);
    setProgress(getCurrentProgress());
  };

  return (
    <div className="space-y-5 pb-28">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-muted">Know the verb. Use the verb.</p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight">Verb Master</h1>
          <p className="mt-2 text-sm text-muted">社会人向け・基本動詞トレーニング</p>
        </div>
        <button className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm" onClick={() => { logout(); window.location.href = "/login"; }}>ログアウト</button>
      </header>

      <section className="card p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted">{username}</p>
            <p className="mt-1 text-3xl font-bold">Lv.{progress.level}</p>
          </div>
          <div className="text-right text-sm text-muted">
            <p>XP <span className="font-bold text-ink">{progress.xp}</span></p>
            <p>Streak <span className="font-bold text-ink">{progress.currentStreak} days</span></p>
          </div>
        </div>
      </section>

      <section className="digital-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-cyan-200">LEARNING DASHBOARD</p>
            <p className="mt-2 text-sm text-slate-300">目標日から逆算して、毎日の学習ペースを見える化します。</p>
          </div>
          <span className="rounded-full border border-cyan-300/30 px-3 py-1 text-xs font-bold text-cyan-100">{plan.progressPercent}%</span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
          <div className="digital-panel">
            <p className="digital-label">登録動詞</p>
            <p className="digital-number">{verbs.length}</p>
            <p className="text-xs text-cyan-200">語</p>
          </div>
          <div className="digital-panel">
            <p className="digital-label">習得済み</p>
            <p className="digital-number">{completed}</p>
            <p className="text-xs text-cyan-200">語</p>
          </div>
          <div className="digital-panel">
            <p className="digital-label">残り</p>
            <p className="digital-number">{plan.remaining}</p>
            <p className="text-xs text-cyan-200">語</p>
          </div>
        </div>

        <div className="mt-4 space-y-3 text-center">
          <div className="digital-panel digital-panel-wide">
            <p className="digital-label">目標日</p>
            <p className="target-date-line">{targetParts.year}/{targetParts.day.replace('.', '/')}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="digital-panel">
              <p className="digital-label">残り日数</p>
              <p className="digital-number">{plan.daysLeft}</p>
              <p className="text-xs text-cyan-200">日</p>
            </div>
            <div className="digital-panel">
              <p className="digital-label">推奨ペース</p>
              <p className="daily-goal-main">1日{plan.dailyGoal}語</p>
            </div>
          </div>
        </div>

        <label className="mt-5 block text-sm text-slate-300">
          目標日を変更
          <input className="mt-2 w-full rounded-xl border border-cyan-300/20 bg-slate-950 px-4 py-3 text-white" type="date" value={target} onChange={(e) => updateTarget(e.target.value)} />
        </label>
      </section>

      <section className="grid grid-cols-1 gap-3">
        <Link className="btn btn-primary block text-center text-base" href="/verbs">学習を始める</Link>
        {reviewCount > 0 && <Link className="btn btn-soft block text-center text-base" href="/review">復習する {reviewCount}問</Link>}
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Link className="card block p-5 font-bold" href="/verbs">動詞一覧</Link>
        <Link className="card block p-5 font-bold" href="/tests">瞬発英作文テスト</Link>
        <Link className="card block p-5 font-bold" href="/profile">進捗</Link>
        <Link className="card block p-5 font-bold" href="/study-method">勉強方法</Link>
      </section>

      <section className="card p-5">
        <p className="text-sm font-bold text-muted">コンセプト</p>
        <p className="mt-2 leading-relaxed">基本動詞を、型・例文・音声・瞬発英作文で使える形にします。</p>
        <Link className="mt-4 inline-block font-bold text-accent" href="/about">このアプリについて</Link>
      </section>
    </div>
  );
}
