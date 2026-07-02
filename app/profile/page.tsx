"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  formatDateTime,
  getAccounts,
  getAllProgress,
  getComputedBadges,
  getCurrentProgress,
  getCurrentUsername,
  getDueReviewItems,
  getFutureReviewItems,
  getPurchasePlanSummary,
  getSeasonRankSummary,
  getWeeklyMvpCount,
  updateUserProfile,
  type UserProgress,
} from "@/lib/account";
import { verbs } from "@/lib/data";
import VoiceSettingsPanel from "@/components/VoiceSettingsPanel";
import DataBackupPanel from "@/components/DataBackupPanel";
import {
  CLOUD_SYNC_EVENT,
  getCloudBackupComparison,
  getCloudReadiness,
  restoreLearningDataFromSupabase,
  syncCurrentUserToSupabase,
  verifyCloudBackup,
  type CloudBackupComparison,
  type CloudSyncEventDetail,
  type CloudSyncStatus,
} from "@/lib/cloudSync";

const VERSION = "Version 88";

function sumWeeklyMinutes(progress: UserProgress) {
  return Object.values(progress.weeklyStats || {}).reduce(
    (sum, stat) => sum + (stat.studyMinutes || 0),
    0,
  );
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h <= 0) return `${m}分`;
  return `${h}時間${m}分`;
}

function cloudLabel(kind: "profile" | "avatar" | "premium" | "stats", status: CloudSyncStatus | null, hasAvatar = false) {
  if (!status?.configured) {
    if (kind === "avatar" && hasAvatar) return "端末内";
    return "未設定";
  }
  const value = status[kind];
  if (value === "saved") return kind === "avatar" ? "保存済み" : "保存済み";
  if (value === "local-only") return "端末内";
  if (value === "error") {
    if (kind === "avatar") return "Storage確認";
    return "SQL確認";
  }
  if (kind === "avatar" && hasAvatar) return "端末内";
  return "待機";
}


function cloudStatusBadge(status: CloudSyncStatus | null, syncing: boolean) {
  if (syncing) return { label: "同期中", className: "bg-amber-300/15 text-amber-100 border-amber-300/25" };
  if (!status) return { label: "確認中", className: "bg-slate-500/15 text-slate-100 border-slate-300/20" };
  if (!status.configured) return { label: "端末保存", className: "bg-slate-500/15 text-slate-100 border-slate-300/20" };
  if (status.stats === "saved") {
    return { label: "学習記録 保存済み", className: "bg-cyan-300/15 text-cyan-100 border-cyan-300/25" };
  }
  if ([status.profile, status.avatar, status.premium].includes("error")) {
    return { label: "一部確認", className: "bg-amber-300/15 text-amber-100 border-amber-300/25" };
  }
  if (status.profile === "saved" || status.premium === "saved") {
    return { label: "クラウド保存済み", className: "bg-cyan-300/15 text-cyan-100 border-cyan-300/25" };
  }
  return { label: "待機", className: "bg-slate-500/15 text-slate-100 border-slate-300/20" };
}

function cloudReasonText(reason?: string) {
  if (reason === "start") return "起動時確認";
  if (reason === "visible") return "画面復帰時";
  if (reason === "before-hide") return "画面を閉じる前";
  if (reason === "saved") return "学習データ変更時";
  if (reason === "interval") return "自動確認";
  return "手動確認";
}

function cloudMessage(status: CloudSyncStatus | null) {
  if (!status) return "保存状態を確認しています。";
  if (!status.configured) {
    return "Supabase未設定です。VercelにNEXT_PUBLIC_SUPABASE_URLとNEXT_PUBLIC_SUPABASE_ANON_KEYを入れるとクラウド保存できます。";
  }
  if (status.stats === "saved" && [status.profile, status.avatar, status.premium].includes("error")) {
    return "学習記録はクラウド保存済みです。一部の補助データはSQL確認が必要ですが、学習記録の保存は維持されています。";
  }
  if ([status.profile, status.avatar, status.premium, status.stats].includes("error")) {
    return "Supabase接続はありますが、SQL実行またはStorage bucket作成が未完了の可能性があります。アプリ内データは端末側には残っています。";
  }
  return status.message || "保存ボタンでプロフィール・学習記録・Premium状態をクラウドへ保存できます。";
}

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [ranking, setRanking] = useState<UserProgress[]>([]);
  const [displayNameDraft, setDisplayNameDraft] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [cloudStatus, setCloudStatus] = useState<CloudSyncStatus | null>(null);
  const [cloudSyncing, setCloudSyncing] = useState(false);
  const [cloudEvent, setCloudEvent] = useState<CloudSyncEventDetail | null>(null);
  const [cloudTestMessage, setCloudTestMessage] = useState("");
  const [backupComparison, setBackupComparison] = useState<CloudBackupComparison | null>(null);
  const [showSaveDetails, setShowSaveDetails] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const reload = () => {
    const next = getCurrentProgress();
    setProgress(next);
    setRanking(getAllProgress());
    setDisplayNameDraft(next?.displayName || next?.username || "");
    setCloudStatus(getCloudReadiness());
  };

  const refreshBackupComparison = async (targetUsername = username) => {
    if (!targetUsername) return;
    const comparison = await getCloudBackupComparison(targetUsername);
    setBackupComparison(comparison);
  };

  useEffect(() => {
    const user = getCurrentUsername();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setUsername(user);
    reload();
    void refreshBackupComparison(user);
  }, []);

  useEffect(() => {
    const onCloudSync = (event: Event) => {
      const detail = (event as CustomEvent<CloudSyncEventDetail>).detail;
      setCloudEvent(detail);
      setCloudSyncing(detail.phase === "syncing");
      if (detail.status) setCloudStatus(detail.status);
    };
    window.addEventListener(CLOUD_SYNC_EVENT, onCloudSync);
    return () => window.removeEventListener(CLOUD_SYNC_EVENT, onCloudSync);
  }, []);

  const syncToSupabase = async (target = progress) => {
    if (!target) return null;
    setCloudSyncing(true);
    const comparison = await getCloudBackupComparison(target.username);
    setBackupComparison(comparison);
    const result = await syncCurrentUserToSupabase(target);
    setCloudStatus(result);
    setCloudSyncing(false);
    await refreshBackupComparison(target.username);
    return result;
  };

  const restoreFromSupabase = async () => {
    if (!username) return;
    setCloudSyncing(true);
    const result = await restoreLearningDataFromSupabase(username);
    setCloudStatus(result.status);
    setCloudSyncing(false);
    setProfileMessage(result.message);
    reload();
    await refreshBackupComparison(username);
    setTimeout(() => setProfileMessage(""), 2400);
  };

  const runCloudBackupTest = async () => {
    if (!username) return;
    setCloudSyncing(true);
    setCloudTestMessage("クラウド保存テスト中です...");
    const current = getCurrentProgress();
    if (current) {
      const syncResult = await syncCurrentUserToSupabase(current);
      setCloudStatus(syncResult);
    }
    const verify = await verifyCloudBackup(username);
    setCloudSyncing(false);
    if (verify.ok && verify.summary) {
      setCloudTestMessage(
        `確認OK：XP ${verify.summary.xp} / 学習 ${verify.summary.studied}語 / テスト ${verify.summary.tests}問 / 保存フレーズ ${verify.summary.savedPhrases}件`,
      );
    } else {
      setCloudTestMessage(`確認NG：${verify.message}`);
    }
    await refreshBackupComparison(username);
  };

  const onSaveProfile = async () => {
    const updated = updateUserProfile({ displayName: displayNameDraft });
    setProgress(updated);
    setProfileMessage("保存しました");
    setIsEditingName(false);
    setTimeout(() => setProfileMessage(""), 1800);
    if (updated) await syncToSupabase(updated);
  };

  const resizeAvatarImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("画像の変換に失敗しました"));
        img.onload = () => {
          const maxSize = 512;
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const width = Math.max(1, Math.round(img.width * scale));
          const height = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("画像の変換に失敗しました"));
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.src = typeof reader.result === "string" ? reader.result : "";
      };
      reader.readAsDataURL(file);
    });
  };

  const onAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setProfileMessage("画像ファイルを選択してください");
      return;
    }
    try {
      setProfileMessage("画像を保存中です...");
      const result = await resizeAvatarImage(file);
      const updated = updateUserProfile({ avatarDataUrl: result });
      setProgress(updated);
      setProfileMessage("画像を保存しました。クラウドへ反映中...");
      if (updated) {
        const syncResult = await syncToSupabase(updated);
        setProfileMessage(syncResult.stats === "saved" ? "画像を保存しました" : "画像を端末に保存しました。クラウド保存は要確認です");
      }
      setTimeout(() => setProfileMessage(""), 2400);
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : "画像の保存に失敗しました");
    }
  };

  const toggleNotification = () => {
    if (!progress) return;
    const updated = updateUserProfile({
      notificationsEnabled: !progress.notificationsEnabled,
    });
    setProgress(updated);
    if (updated) void syncToSupabase(updated);
  };

  const stats = useMemo(() => {
    if (!progress) return null;
    const totalTests = (progress.testCorrect || 0) + (progress.testWrong || 0);
    const correctRate = totalTests
      ? Math.round(((progress.testCorrect || 0) / totalTests) * 100)
      : 0;
    return {
      percent: Math.round((progress.studiedVerbIds.length / verbs.length) * 100),
      dueReviewCount: getDueReviewItems().length,
      futureReviewCount: getFutureReviewItems().length,
      totalTests,
      correctRate,
      studyMinutes: sumWeeklyMinutes(progress),
      phraseCount: progress.savedPhrases?.length || 0,
      reviewCount: Object.keys(progress.reviewItems || {}).length,
    };
  }, [progress]);

  if (!username || !progress || !stats) return <p className="text-muted">読み込み中...</p>;

  const badges = getComputedBadges(progress);
  const mvpCount = getWeeklyMvpCount(username);
  const seasonSummary = getSeasonRankSummary(username);
  const isAdmin = getAccounts().some(
    (account) => account.username === username && account.role === "admin",
  );
  const plan = getPurchasePlanSummary();
  const displayName = progress.displayName || username;
  const cloudBadge = cloudStatusBadge(cloudStatus, cloudSyncing);
  const restoreRecommended = backupComparison?.recommendation === "restore_remote";

  return (
    <div className="space-y-5 pb-24">
      <header className="space-y-1">
        <p className="text-sm text-muted">プロフィール・設定・学習記録</p>
        <h1 className="text-3xl font-bold">マイページ</h1>
      </header>

      <section className="digital-card profile-card-compact p-4">
        <div className="profile-hero flex items-start gap-4">
          <button
            className="profile-avatar profile-avatar-large relative h-24 w-24 shrink-0 overflow-hidden rounded-[24px] border border-cyan-300/30 bg-slate-900 text-4xl"
            onClick={() => fileRef.current?.click()}
            type="button"
            aria-label="プロフィール画像を変更"
          >
            {progress.avatarDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={progress.avatarDataUrl}
                alt="プロフィール画像"
                className="h-full w-full object-cover"
              />
            ) : (
              <span>👤</span>
            )}
            <span className="absolute bottom-1 right-1 rounded-full bg-cyan-300 px-1.5 py-0.5 text-xs text-slate-950">
              📷
            </span>
          </button>
          <input
            ref={fileRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-bold tracking-[0.22em] text-cyan-200">PROFILE</p>
                <p className="profile-name mt-0.5 truncate text-[26px] font-extrabold leading-tight text-white">{displayName}</p>
                <p className="profile-login mt-1 text-[13px] font-bold text-slate-300">ログインID：{username}</p>
              </div>
              {!isEditingName && (
                <button
                  className="shrink-0 rounded-full border border-cyan-300/25 px-3 py-1.5 text-xs font-bold text-cyan-100"
                  onClick={() => {
                    setDisplayNameDraft(displayName);
                    setIsEditingName(true);
                  }}
                  type="button"
                >
                  編集
                </button>
              )}
            </div>

            {isEditingName && (
              <div className="mt-3 space-y-3 rounded-2xl border border-cyan-300/15 bg-slate-950/45 p-3">
                <p className="text-xs font-bold tracking-[0.16em] text-cyan-200">ニックネーム変更</p>
                <input
                  className="w-full rounded-xl border border-cyan-300/20 bg-slate-950 px-4 py-3 text-white outline-none"
                  value={displayNameDraft}
                  onChange={(event) => setDisplayNameDraft(event.target.value)}
                  placeholder="ニックネーム"
                />
                <div className="grid grid-cols-2 gap-2">
                  <button className="btn btn-primary" onClick={onSaveProfile} type="button">
                    保存
                  </button>
                  <button
                    className="btn btn-soft"
                    onClick={() => {
                      setDisplayNameDraft(displayName);
                      setIsEditingName(false);
                    }}
                    type="button"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
            {profileMessage && <p className="mt-2 text-sm font-bold text-cyan-100">✅ {profileMessage}</p>}

            <div className="profile-summary-row">
              <span className="profile-summary-chip">Lv <strong>{progress.level}</strong></span>
              <span className="profile-summary-chip">XP <strong>{progress.xp}</strong></span>
              <span className="profile-summary-chip">継続 <strong>{progress.currentStreak}日</strong></span>
            </div>

            <div className="profile-plan-line text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-300">利用状態</span>
                <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-extrabold text-cyan-100">
                  {plan.hasPremium ? "Premium" : "無料プラン"}
                </span>
              </div>
              <p className="mt-2 text-xs font-bold text-slate-300">
                解放範囲：<span className="text-white">{plan.unlocked}語</span> / {plan.totalTarget}語
              </p>
            </div>

            <p className="profile-last-login mt-3 text-[13px] font-bold text-slate-300">最終ログイン：{formatDateTime(progress.lastLoginAt)}</p>
          </div>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-xl font-bold">学習記録</h2>
        <div className="mobile-card-grid mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-paper p-4"><p className="text-sm text-muted">学習動詞</p><p className="text-2xl font-bold">{progress.studiedVerbIds.length}/{verbs.length}</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="text-sm text-muted">学習率</p><p className="text-2xl font-bold">{stats.percent}%</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="text-sm text-muted">総テスト数</p><p className="text-2xl font-bold">{stats.totalTests}問</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="text-sm text-muted">正答率</p><p className="text-2xl font-bold">{stats.correctRate}%</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="text-sm text-muted">学習時間</p><p className="text-2xl font-bold">{formatMinutes(stats.studyMinutes)}</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="text-sm text-muted">フレーズ</p><p className="text-2xl font-bold">{stats.phraseCount}件</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="text-sm text-muted">今日の復習</p><p className="text-2xl font-bold">{stats.dueReviewCount}問</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="text-sm text-muted">復習予定</p><p className="text-2xl font-bold">{stats.futureReviewCount}問</p></div>
        </div>
      </section>

      <section className="digital-card p-5">
        <p className="text-xs font-bold tracking-[0.25em] text-cyan-200">LEAGUE & ACHIEVEMENT</p>
        <div className="mobile-card-grid mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="digital-panel">
            <p className="digital-label">Weekly MVP</p>
            <p className="digital-number text-2xl">{mvpCount}</p>
            <p className="text-xs text-cyan-200">回</p>
          </div>
          <div className="digital-panel">
            <p className="digital-label">Season</p>
            <p className="text-lg font-extrabold text-cyan-100">{seasonSummary?.season.label ?? "未参加"}</p>
          </div>
          <div className="digital-panel">
            <p className="digital-label">EXP順位</p>
            <p className="digital-number text-2xl">{seasonSummary?.xpRank || "-"}</p>
            <p className="text-xs text-cyan-200">/ {seasonSummary?.total || "-"}人</p>
          </div>
          <div className="digital-panel">
            <p className="digital-label">習得順位</p>
            <p className="digital-number text-2xl">{seasonSummary?.masteredRank || "-"}</p>
            <p className="text-xs text-cyan-200">/ {seasonSummary?.total || "-"}人</p>
          </div>
        </div>
        <Link className="btn btn-soft mt-4 block text-center" href="/league">リーグを見る</Link>
      </section>

      <section className="digital-card p-5">
        <p className="text-xs font-bold tracking-[0.25em] text-cyan-200">PREMIUM</p>
        <div className="mobile-card-grid mt-4 grid grid-cols-2 gap-3 text-center">
          <div className="digital-panel">
            <p className="digital-label">解放済み</p>
            <p className="digital-number text-2xl">{plan.unlocked}</p>
            <p className="text-xs text-cyan-200">/ 124 動詞</p>
          </div>
          <div className="digital-panel">
            <p className="digital-label">購入額</p>
            <p className="digital-number text-2xl">¥{plan.purchaseTotal.toLocaleString()}</p>
            <p className="text-xs text-cyan-200">買い切り</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          <Link className="btn btn-primary block text-center" href="/upgrade">アップグレード</Link>
          <Link className="btn btn-soft block text-center" href="/purchases">購入履歴・復元</Link>
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-300/15 bg-slate-900/45 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-bold">自動保存</h2>
            <p className="mt-1 text-sm text-muted">
              ログイン中は学習データを自動でクラウド保存します。プライベート閲覧でも、保存先はクラウドを優先します。
            </p>
          </div>
          <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${cloudBadge.className}`}>
            {cloudSyncing ? "保存中" : cloudBadge.label}
          </span>
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-300/15 bg-slate-950/55 p-3">
          <p className="text-sm font-bold text-cyan-100">
            {restoreRecommended ? "クラウドに復元できる学習データがあります" : cloudSyncing ? "学習データを保存中です" : cloudStatus?.stats === "saved" ? "学習記録は自動保存されています" : "学習データを確認しています"}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-300">
            {cloudStatus?.updatedAt ? `最終保存：${formatDateTime(cloudStatus.updatedAt)}` : "最終保存：確認中"}
          </p>
          {cloudEvent?.phase === "error" && cloudStatus?.stats === "error" && (
            <p className="mt-2 rounded-xl border border-rose-300/25 bg-rose-300/10 p-2 text-xs font-bold text-rose-100">
              学習記録の保存に失敗しました。通信環境とSupabase設定を確認してください。
            </p>
          )}
          {cloudStatus?.stats === "saved" && [cloudStatus.profile, cloudStatus.avatar, cloudStatus.premium].includes("error") && (
            <p className="mt-2 rounded-xl border border-amber-300/25 bg-amber-300/10 p-2 text-xs font-bold text-amber-100">
              学習記録は保存済みです。一部の補助データは詳細で確認してください。
            </p>
          )}
        </div>

        <button
          className="mt-3 w-full rounded-2xl border border-cyan-300/20 bg-slate-950/40 px-4 py-3 text-left text-sm font-bold text-cyan-100"
          type="button"
          onClick={() => setShowSaveDetails((value) => !value)}
        >
          {showSaveDetails ? "保存状態の詳細を閉じる" : "保存状態の詳細を見る"}
        </button>

        {showSaveDetails && (
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-xl bg-slate-950/70 p-3">プロフィール<br /><b>{cloudLabel("profile", cloudStatus, Boolean(progress.avatarDataUrl))}</b></div>
              <div className="rounded-xl bg-slate-950/70 p-3">画像<br /><b>{cloudLabel("avatar", cloudStatus, Boolean(progress.avatarDataUrl))}</b></div>
              <div className="rounded-xl bg-slate-950/70 p-3">Premium<br /><b>{cloudLabel("premium", cloudStatus, Boolean(progress.avatarDataUrl))}</b></div>
              <div className="rounded-xl bg-slate-950/70 p-3">学習記録<br /><b>{cloudLabel("stats", cloudStatus, Boolean(progress.avatarDataUrl))}</b></div>
              <div className="rounded-xl bg-slate-950/70 p-3">音声・設定<br /><b>{cloudStatus?.stats === "saved" ? "保存対象" : cloudStatus?.configured ? "待機" : "端末内"}</b></div>
            </div>

            {backupComparison && (
              <div className={`rounded-2xl border p-3 text-xs ${restoreRecommended ? "border-amber-300/30 bg-amber-300/10 text-amber-50" : "border-cyan-300/20 bg-slate-950/60 text-slate-200"}`}>
                <p className="font-bold">データ比較：{restoreRecommended ? "復元おすすめ" : backupComparison.recommendation === "save_local" ? "保存おすすめ" : "確認OK"}</p>
                <p className="mt-1 leading-5">{backupComparison.message}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-xl bg-slate-950/70 p-2">
                    <p className="text-slate-400">端末</p>
                    <p className="font-bold">XP {backupComparison.local.xp}</p>
                    <p>学習 {backupComparison.local.studied}語 / テスト {backupComparison.local.tests}問</p>
                  </div>
                  <div className="rounded-xl bg-slate-950/70 p-2">
                    <p className="text-slate-400">クラウド</p>
                    <p className="font-bold">XP {backupComparison.remote?.xp ?? 0}</p>
                    <p>学習 {backupComparison.remote?.studied ?? 0}語 / テスト {backupComparison.remote?.tests ?? 0}問</p>
                  </div>
                </div>
                {backupComparison.remoteUpdatedAt && (
                  <p className="mt-2 text-slate-400">クラウド更新：{formatDateTime(backupComparison.remoteUpdatedAt)}</p>
                )}
              </div>
            )}

            <div className="grid gap-2 sm:grid-cols-2">
              <button
                className="btn btn-soft w-full"
                type="button"
                onClick={() => syncToSupabase()}
                disabled={cloudSyncing}
              >
                {cloudSyncing ? "同期中..." : restoreRecommended ? "先に復元がおすすめ" : "今すぐクラウド保存"}
              </button>
              <button
                className="btn btn-soft w-full"
                type="button"
                onClick={restoreFromSupabase}
                disabled={cloudSyncing}
              >
                クラウドから復元
              </button>
              <button
                className="btn btn-primary w-full sm:col-span-2"
                type="button"
                onClick={runCloudBackupTest}
                disabled={cloudSyncing}
              >
                クラウド保存テスト
              </button>
            </div>

            {cloudTestMessage && (
              <p className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-xs font-bold text-cyan-100">
                {cloudTestMessage}
              </p>
            )}

            {cloudEvent && (
              <p className="text-xs text-slate-300">
                {cloudReasonText(cloudEvent.reason)}：{cloudEvent.message}
              </p>
            )}
            <p className="text-xs leading-5 text-muted">{cloudMessage(cloudStatus)}</p>
            <p className="text-xs leading-5 text-cyan-100/80">
              プライベート閲覧では端末保存が消えることがあります。ログイン中はクラウド保存を優先し、空データで上書きしないよう保護しています。
            </p>
          </div>
        )}
      </section>

      <section className="card p-5">
        <h2 className="text-xl font-bold">設定</h2>
        <div className="mt-4 grid gap-3">
          <Link className="rounded-2xl bg-paper p-4 font-bold" href="/#target-settings">学習ペース設定</Link>
          <button
            className="rounded-2xl bg-paper p-4 text-left font-bold"
            type="button"
            onClick={toggleNotification}
          >
            通知設定：{progress.notificationsEnabled ? "ON" : "OFF"}
            <p className="mt-1 text-sm font-normal text-muted">通知機能は今後の実装準備です。</p>
          </button>
          <DataBackupPanel />
          {isAdmin && <Link className="rounded-2xl bg-paper p-4 font-bold" href="/admin">管理画面</Link>}
        </div>
      </section>

      <VoiceSettingsPanel />

      {/* Ver.88: 獲得バッジの詳細はHOMEレベルカードの下から出るシートへ統合。 */}

{isAdmin && (
      <section className="card p-5">
        <h2 className="text-xl font-bold">アップデート履歴</h2>
        <div className="mt-4 space-y-3 text-sm">
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.88</p><p className="mt-1 text-muted">保存失敗表示を学習記録本体と補助データで分離。HOMEのプロフィールアイコンとXP表示を改善し、次のレベルまでのXPを追加。獲得バッジはHOMEレベルカードに統合し、タップで下から詳細シートを開く形にしました。マイページのプロフィールにPremium状態と解放範囲も追加。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.87</p><p className="mt-1 text-muted">HOME上部をプロフィール＋レベルカードに統合。マイページのニックネーム、アイコン、レベル、リーグ、XP、連続学習、バッジをHOMEで見やすく整理し、主要機能は下部ナビに集約しました。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.86</p><p className="mt-1 text-muted">管理者専用の動詞品質チェックページを追加。使い方数、例文数、Premium日常例文、大文字表記、仮文、テスト日本語、構造データの確認状態を一覧で見られるようにしました。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.85</p><p className="mt-1 text-muted">PCとスマホ間の目標日同期を改善。HOMEの使い方ガイドカードを削除し、レベル欄へバッジを移動。Streakを連続学習に日本語化し、保存状態の表示も学習記録中心に整理しました。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.84</p><p className="mt-1 text-muted">テスト途中保存を見える化。単語別テスト画面に途中保存カードを追加し、テスト完了後も何回でもランダム10問を受け直せるようにしました。完了ボーナスも毎回加算されます。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.83</p><p className="mt-1 text-muted">アップデート履歴を管理者だけに表示。一般ユーザー向けには、任意でHOMEに1行の新着ニュースだけを出せるように整理しました。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.82</p><p className="mt-1 text-muted">仕事で使う頻度が高い negotiate / remind / require / select を単純追加。120語パック購入者向けの追加教材として124語まで学習できるようにし、動詞選定は大人の日本語文から逆算する方針を継続します。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.81</p><p className="mt-1 text-muted">マイページの保存状態をユーザー向けに簡素化。通常は自動保存と最終保存時刻だけ表示し、クラウド保存・復元・保存テストなどの詳細操作は折りたたみ内に整理しました。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.80</p><p className="mt-1 text-muted">HOMEのダッシュボードを簡素化。登録動詞・習得済み・残り・目標日・学習日数・バッジだけに絞り、スマホで見やすくしました。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.79</p><p className="mt-1 text-muted">SV/SVO/SVC/SVOCなどの構造ラベルは、全例文を手動監査するまでユーザー画面から一旦非表示にしました。誤った構造で覚えてしまうリスクを避けるための品質優先対応です。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.78</p><p className="mt-1 text-muted">例文・テスト日本語の品質を改善。不自然な自動生成文を削除し、主語・時制・目的語が分かる日本語へ調整。START / SHOW / RUNなどの句動詞例文も仕事向けの自然な表現に修正しました。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.77</p><p className="mt-1 text-muted">120語の品質監査を開始。重複動詞を解消し、reply / schedule / submit / respond / inform / verify / gather / propose へ差し替え。borrowは残し、SV/SVOや前置詞句の扱いをダブルチェックしました。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.76</p><p className="mt-1 text-muted">プロフィール画像をSupabase Storageへ保存・復元しやすくし、更新時に画像URLを空で上書きしない保護を追加。型表示の英語大文字を自然な小文字表記へ統一する下準備も追加。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.75</p><p className="mt-1 text-muted">HOMEの学習ダッシュボードを現在の解放パックに連動。無料は3語、30/60/90/120語パックでは各解放語数を学習対象として、習得済み・残り・必要ペースを計算するよう修正。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.74</p><p className="mt-1 text-muted">右側の↑↓スクロールボタンが下部ナビに被って押せない問題を修正。スマホで押しやすい位置とサイズに調整しました。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.73</p><p className="mt-1 text-muted">動詞を120語まで拡張。adjust / apply / approve / borrow / check / collect / communicate / describe / earn / estimate / focus / identify / introduce / join / lead / maintain / mention / protect / replace / train を追加し、120語パックを実データ化。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.72</p><p className="mt-1 text-muted">120語パック準備版。91〜100番を120語パック先行収録として表示し、30 / 60 / 90 / 120の段階解放、ロック表示、購入画面の説明を整理。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.71</p><p className="mt-1 text-muted">動詞を100語へ拡張。achieve / arrange / attend / cancel / connect / contact / control / handle / organize / share を追加し、91〜100番を120動詞パック側の教材として整備。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.69</p><p className="mt-1 text-muted">動詞を90語へ拡張。accept / avoid / consider / depend / expect / follow / include / notice / prefer / recommend を追加し、構造・例文・テスト文を社会人向けに整備。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.68</p><p className="mt-1 text-muted">テストを最大10問に整理。未出題・苦手・復習対象・最近やっていない問題を優先して、出題バランスと終了後の復習案内を改善。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.67</p><p className="mt-1 text-muted">初回ログイン時の復元判断と空データ上書き防止を強化。端末データとクラウドデータの比較表示を追加。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.66</p><p className="mt-1 text-muted">クラウドバックアップを優先する保存/復元へ修正。補助テーブル未作成でも学習データ本体を守り、クラウド保存テストを追加。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.65</p><p className="mt-1 text-muted">クラウド同期状態をユーザー向けに表示。手動保存・復元ボタン、最終同期時間、プライベート閲覧時の注意を追加。</p></div>
<div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.64</p><p className="mt-1 text-muted">スマホ下部ナビを拡大。下部固定を強化し、横スワイプできるタブバーへ改善。</p></div>
                    <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.62</p><p className="mt-1 text-muted">学習データ保護版。自動クラウド同期、Supabase復元、JSONバックアップ書き出し/復元、プライベート閲覧の注意表示を追加。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.61</p><p className="mt-1 text-muted">80動詞品質完成版。テストの戻る操作、学習ペース数字入力、構造品質ルール、教材データ監査メモを改善。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.60</p><p className="mt-1 text-muted">動詞データを80語まで拡張。REQUEST / SUGGEST / AGREE / ARRANGE / CONTACT など実務で使う動詞を追加。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.59</p><p className="mt-1 text-muted">動詞データを70語まで拡張。REPORT / UPDATE / REVIEW / COMPARE / INTRODUCE を追加。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.58</p><p className="mt-1 text-muted">動詞データを60語まで拡張。仕事で使いやすい自然な例文、主語が分かる日本語訳、構造表示の方針を追加。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.57</p><p className="mt-1 text-muted">GETの構造表示、例文品質、テスト音声、ランダム10問、途中保存、戻る機能、数字入力を改善。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.56</p><p className="mt-1 text-muted">ダッシュボードから見られる使い方ガイドを追加。各機能の目的と使い方をまとめました。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.55</p><p className="mt-1 text-muted">学習ペースと目標日を編集モード式に変更。保存ボタンは編集時だけ表示し、保存後は設定内容だけを表示。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.54</p><p className="mt-1 text-muted">学習ペースと目標日の編集をボタン式にして、保存後は画面がスマートに戻るように改善。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.53</p><p className="mt-1 text-muted">ホーム右上アイコン、ニックネーム編集、マイページのデータ保存表示をスマート化。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.52</p><p className="mt-1 text-muted">スマホ下タブ、マイページ表示、クラウド保存状態、学習ペース説明を改善。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.51</p><p className="mt-1 text-muted">Stripe Webhook、決済反映、キャンセルページの準備を追加。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.50</p><p className="mt-1 text-muted">Stripe決済モード、決済設定確認、管理画面の決済タブを追加。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.49</p><p className="mt-1 text-muted">購入確認、仮購入完了、購入履歴反映の導線を追加。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.48</p><p className="mt-1 text-muted">購入履歴、購入状態復元、Premium安全確認を追加。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.47</p><p className="mt-1 text-muted">無料/Premiumロック判定の土台を追加。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.46</p><p className="mt-1 text-muted">Supabase保存、Storage画像、Premium状態管理の土台を追加。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.45</p><p className="mt-1 text-muted">マイページ強化、プロフィール画像、ニックネーム変更、学習記録整理。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.44</p><p className="mt-1 text-muted">下タブ整理、アップグレードページ、Premium土台。</p></div>
          <div className="rounded-2xl bg-paper p-4"><p className="font-bold">Ver.43</p><p className="mt-1 text-muted">管理画面の土台を追加。</p></div>
        </div>
      </section>
      )}

      <section className="card p-5">
        <h2 className="text-xl font-bold">XPランキング</h2>
        <div className="mt-4 space-y-2">
          {ranking.map((p, i) => (
            <div key={p.username} className="flex justify-between rounded-xl bg-paper p-3">
              <span>{i + 1}. {p.displayName || p.username}</span>
              <span className="font-bold">{p.xp} XP</span>
            </div>
          ))}
        </div>
      </section>

      <p className="pb-4 text-center text-xs text-muted">Verb Master {VERSION}</p>
    </div>
  );
}
