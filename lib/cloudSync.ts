import { supabase } from "@/lib/supabase";
import {
  FREE_VERB_LIMIT,
  TOTAL_VERB_TARGET,
  PREMIUM_FULL_ACCESS_COUNT,
  applyClientStudySettingsSnapshot,
  ensureProgress,
  getClientStudySettingsSnapshot,
  restorePremiumEntitlement,
  saveProgress,
  setCurrentUser,
  type Account,
  type ClientStudySettingsSnapshot,
  type UserProgress,
  type VoiceSettings,
} from "@/lib/account";

export const CLOUD_SYNC_EVENT = "verbmaster:cloud-sync-status";

export type CloudSyncEventDetail = {
  phase: "syncing" | "saved" | "restored" | "error" | "idle";
  reason?: string;
  message: string;
  updatedAt: string;
  status?: CloudSyncStatus;
};

export type CloudSyncStatus = {
  configured: boolean;
  profile: "idle" | "saved" | "error";
  avatar: "idle" | "saved" | "error" | "local-only";
  premium: "idle" | "saved" | "error";
  stats: "idle" | "saved" | "error";
  message: string;
  updatedAt?: string;
};

export type CloudBackupSummary = {
  xp: number;
  level: number;
  studied: number;
  totalStudied: number;
  tests: number;
  weak: number;
  reviews: number;
  savedPhrases: number;
  score: number;
};

export type CloudBackupComparison = {
  ok: boolean;
  message: string;
  recommendation: "restore_remote" | "save_local" | "same" | "no_remote" | "unknown";
  local: CloudBackupSummary;
  remote: CloudBackupSummary | null;
  remoteUpdatedAt?: string;
};

const PROFILE_BUCKET = "profile-images";
const CLOUD_CREDENTIAL_KEY = "verbMaster.cloudCredentials";

type CloudCredentialMap = Record<string, { passwordHash: string; savedAt: string }>;

function credentialMap(): CloudCredentialMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(CLOUD_CREDENTIAL_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveCloudCredential(username: string, passwordHash: string) {
  if (typeof window === "undefined") return;
  const map = credentialMap();
  map[username] = { passwordHash, savedAt: nowText() };
  localStorage.setItem(CLOUD_CREDENTIAL_KEY, JSON.stringify(map));
}

function getCloudPasswordHash(username: string) {
  return credentialMap()[username]?.passwordHash || "";
}

function requireCloudPasswordHash(username: string) {
  const passwordHash = getCloudPasswordHash(username);
  if (!passwordHash) {
    throw new Error("安全なクラウド保存には再ログインが必要です。ログインし直してから保存してください。");
  }
  return passwordHash;
}

function asRpcResult(data: unknown): { ok?: boolean; message?: string; username?: string; role?: string } {
  if (!data || typeof data !== "object") return {};
  return data as { ok?: boolean; message?: string; username?: string; role?: string };
}

function nowText() {
  return new Date().toISOString();
}

function safeName(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-") || "user";
}

function baseStatus(message: string): CloudSyncStatus {
  return {
    configured: Boolean(supabase),
    profile: "idle",
    avatar: "idle",
    premium: "idle",
    stats: "idle",
    message,
  };
}

export function getCloudReadiness(): CloudSyncStatus {
  if (!supabase) {
    return baseStatus(
      "Supabase環境変数が未設定です。NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY をVercelに設定すると保存できます。",
    );
  }
  return baseStatus("Supabase連携の準備ができています。保存ボタンでクラウドへ反映できます。");
}

function dataUrlToBlob(dataUrl: string) {
  const [meta, body] = dataUrl.split(",");
  const contentType = meta.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
  const binary = atob(body || "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return { blob: new Blob([bytes], { type: contentType }), contentType };
}

export async function uploadAvatarToSupabase(username: string, avatarDataUrl?: string) {
  if (!supabase || !avatarDataUrl) return { ok: false, url: "", message: "画像はローカル保存のみです。" };
  try {
    const { blob, contentType } = dataUrlToBlob(avatarDataUrl);
    const ext = contentType.includes("png") ? "png" : "jpg";
    const path = `${safeName(username)}/avatar.${ext}`;
    const { error } = await supabase.storage.from(PROFILE_BUCKET).upload(path, blob, {
      cacheControl: "3600",
      contentType,
      upsert: true,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(PROFILE_BUCKET).getPublicUrl(path);
    return { ok: true, url: data.publicUrl, message: "プロフィール画像をSupabase Storageへ保存しました。" };
  } catch (error) {
    return {
      ok: false,
      url: "",
      message: error instanceof Error ? error.message : "画像保存に失敗しました。",
    };
  }
}

function premiumPlan(progress: UserProgress) {
  const unlocked = Math.max(FREE_VERB_LIMIT, progress.unlockedVerbCount || 0);
  if (unlocked >= PREMIUM_FULL_ACCESS_COUNT) return "all_access";
  if (unlocked >= 90) return "premium_90";
  if (unlocked >= 60) return "premium_60";
  if (unlocked >= 30) return "premium_30";
  return "free";
}

function progressScore(progress: Partial<UserProgress> | null | undefined) {
  if (!progress) return 0;
  return (Number(progress.xp || 0) * 2) +
    (Number(progress.totalStudied || 0) * 20) +
    ((progress.studiedVerbIds || []).length * 100) +
    (Number(progress.testCorrect || 0) * 10) +
    (Number(progress.testWrong || 0) * 6) +
    ((progress.weakItems || []).length * 5) +
    (Object.keys(progress.reviewItems || {}).length * 8) +
    ((progress.savedPhrases || []).length * 8);
}

function isRemoteProgressBetter(remote: Partial<UserProgress> | null | undefined, local: UserProgress) {
  const remoteScore = progressScore(remote);
  const localScore = progressScore(local);
  if (remoteScore <= 0) return false;
  if (localScore <= 0) return true;
  return remoteScore >= localScore;
}

function summarizeProgress(progress: Partial<UserProgress> | null | undefined): CloudBackupSummary {
  return {
    xp: Number(progress?.xp || 0),
    level: Number(progress?.level || 1),
    studied: (progress?.studiedVerbIds || []).length,
    totalStudied: Number(progress?.totalStudied || 0),
    tests: Number(progress?.testCorrect || 0) + Number(progress?.testWrong || 0),
    weak: (progress?.weakItems || []).length,
    reviews: Object.keys(progress?.reviewItems || {}).length,
    savedPhrases: (progress?.savedPhrases || []).length,
    score: progressScore(progress),
  };
}

function shouldBlockEmptyOverwrite(local: UserProgress, remote: Partial<UserProgress> | null | undefined) {
  const localScore = progressScore(local);
  const remoteScore = progressScore(remote);
  return remoteScore > 0 && localScore <= 0;
}

function mergeRemoteLearningWithLocalProfile(local: UserProgress, remote?: Partial<UserProgress> | null): UserProgress {
  if (!remote) return local;
  const remoteProgress = remote as UserProgress;
  const localHasCustomName = Boolean(local.displayName && local.displayName !== local.username);
  return {
    ...local,
    ...remoteProgress,
    username: local.username,
    xp: Math.max(Number(local.xp || 0), Number(remoteProgress.xp || 0)),
    level: Math.max(Number(local.level || 1), Number(remoteProgress.level || 1)),
    currentStreak: Math.max(Number(local.currentStreak || 0), Number(remoteProgress.currentStreak || 0)),
    longestStreak: Math.max(Number(local.longestStreak || 0), Number(remoteProgress.longestStreak || 0)),
    totalStudied: Math.max(Number(local.totalStudied || 0), Number(remoteProgress.totalStudied || 0)),
    currentRound: Math.max(Number(local.currentRound || 1), Number(remoteProgress.currentRound || 1)),
    studiedVerbIds: Array.from(new Set([...(remoteProgress.studiedVerbIds || []), ...(local.studiedVerbIds || [])])),
    weakItems: Array.from(new Set([...(remoteProgress.weakItems || []), ...(local.weakItems || [])])),
    reviewItems: { ...(remoteProgress.reviewItems || {}), ...(local.reviewItems || {}) },
    savedPhrases: (local.savedPhrases?.length ? local.savedPhrases : remoteProgress.savedPhrases) || [],
    testSessions: { ...(remoteProgress.testSessions || {}), ...(local.testSessions || {}) },
    testItemStats: { ...(remoteProgress.testItemStats || {}), ...(local.testItemStats || {}) },
    weeklyStats: { ...(remoteProgress.weeklyStats || {}), ...(local.weeklyStats || {}) },
    displayName: localHasCustomName ? local.displayName : (remoteProgress.displayName || local.displayName || local.username),
    avatarDataUrl: local.avatarDataUrl || remoteProgress.avatarDataUrl || "",
    notificationsEnabled: typeof local.notificationsEnabled === "boolean"
      ? local.notificationsEnabled
      : remoteProgress.notificationsEnabled,
    voiceSettings: local.voiceSettings || remoteProgress.voiceSettings,
    targetDate: local.targetDate || remoteProgress.targetDate,
    targetStartDate: local.targetStartDate || remoteProgress.targetStartDate,
    studyDays: local.studyDays || remoteProgress.studyDays,
    studyPace: local.studyPace || remoteProgress.studyPace,
    unlockedVerbCount: Math.max(Number(local.unlockedVerbCount || 0), Number(remoteProgress.unlockedVerbCount || 0)),
    purchaseTotalYen: Math.max(Number(local.purchaseTotalYen || 0), Number(remoteProgress.purchaseTotalYen || 0)),
    premiumSource: local.premiumSource || remoteProgress.premiumSource,
    premiumUpdatedAt: local.premiumUpdatedAt || remoteProgress.premiumUpdatedAt,
  };
}

function mergeProfileIntoBackup(progress: UserProgress, backup?: Partial<UserProgress> | null, avatarUrl?: string): UserProgress {
  const currentName = progress.displayName && progress.displayName !== progress.username ? progress.displayName : "";
  return {
    ...progress,
    displayName: currentName || backup?.displayName || progress.username,
    avatarDataUrl: progress.avatarDataUrl || avatarUrl || backup?.avatarDataUrl || "",
    notificationsEnabled: typeof progress.notificationsEnabled === "boolean"
      ? progress.notificationsEnabled
      : backup?.notificationsEnabled ?? true,
    voiceSettings: progress.voiceSettings || backup?.voiceSettings || { gender: "female", lang: "en-US" },
    targetDate: progress.targetDate || backup?.targetDate,
    targetStartDate: progress.targetStartDate || backup?.targetStartDate,
    studyDays: progress.studyDays || backup?.studyDays,
    studyPace: progress.studyPace || backup?.studyPace,
  };
}

async function upsertFullProgressBackup(progress: UserProgress) {
  if (!supabase) return;
  const settings = getClientStudySettingsSnapshot(progress);
  const passwordHash = requireCloudPasswordHash(progress.username);
  const { data, error } = await supabase.rpc("vm_upsert_progress_backup", {
    p_username: progress.username,
    p_password_hash: passwordHash,
    p_progress_json: progress,
    p_settings_json: settings,
    p_app_version: "v111",
  });
  if (error) throw error;
  const result = asRpcResult(data);
  if (result.ok === false) throw new Error(result.message || "クラウドバックアップ保存に失敗しました。");
}

async function fetchFullProgressBackup(username: string) {
  if (!supabase) return null;
  const passwordHash = requireCloudPasswordHash(username);
  const { data, error } = await supabase.rpc("vm_fetch_progress_backup", {
    p_username: username,
    p_password_hash: passwordHash,
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return row as null | { progress_json: Partial<UserProgress>; settings_json?: ClientStudySettingsSnapshot; updated_at?: string };
}

async function hashPassword(password: string) {
  const text = `verb-master-v63:${password}`;
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function registerCloudAccount(username: string, password: string) {
  if (!supabase) return { ok: false, message: "Supabase未設定のため端末内登録のみになります。" };
  const name = username.trim();
  if (!name) return { ok: false, message: "ユーザー名を入力してください。" };
  if (password.length < 4) return { ok: false, message: "パスワードは4文字以上にしてください。" };
  try {
    const passwordHash = await hashPassword(password);
    const { data, error } = await supabase.rpc("vm_register_cloud_account", {
      p_username: name,
      p_password_hash: passwordHash,
    });
    if (error) throw error;
    const result = asRpcResult(data);
    if (result.ok === false) return { ok: false, message: result.message || "クラウド登録に失敗しました。" };
    saveCloudCredential(name, passwordHash);
    setCurrentUser(name);
    return { ok: true, message: result.message || "クラウドアカウントを作成しました。" };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "クラウド登録に失敗しました。" };
  }
}

export async function loginCloudAccount(username: string, password: string) {
  if (!supabase) return { ok: false, message: "Supabase未設定のため端末内ログインのみになります。" };
  const name = username.trim();
  try {
    const passwordHash = await hashPassword(password);
    const { data, error } = await supabase.rpc("vm_login_cloud_account", {
      p_username: name,
      p_password_hash: passwordHash,
    });
    if (error) throw error;
    const result = asRpcResult(data);
    if (result.ok === false) return { ok: false, message: result.message || "ユーザー名またはパスワードが違います。" };
    saveCloudCredential(name, passwordHash);
    setCurrentUser(name);
    await restoreLearningDataFromSupabase(name).catch(() => undefined);
    return {
      ok: true,
      message: result.message || "クラウドログインしました。",
      account: { username: name, password: "", role: result.role === "admin" ? "admin" : "user", createdAt: nowText() } as Account,
    };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "クラウドログインに失敗しました。" };
  }
}

export async function syncCurrentUserToSupabase(progress: UserProgress, options: { allowEmptyOverwrite?: boolean } = {}): Promise<CloudSyncStatus> {
  const readiness = getCloudReadiness();
  if (!supabase) return readiness;

  const status: CloudSyncStatus = {
    configured: true,
    profile: "idle",
    avatar: progress.avatarDataUrl ? "local-only" : "idle",
    premium: "idle",
    stats: "idle",
    message: "Supabaseへ保存中です...",
  };

  const optionalErrors: string[] = [];

  try {
    const existingBackup = await fetchFullProgressBackup(progress.username);
    let existingAvatarUrl = "";
    try {
      const { data: existingProfile, error: existingProfileError } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("username", progress.username)
        .maybeSingle();
      if (existingProfileError) throw existingProfileError;
      existingAvatarUrl = existingProfile?.avatar_url || "";
    } catch (error) {
      // profiles テーブル未作成でも学習データ保存は止めない。
    }
    if (!options.allowEmptyOverwrite && shouldBlockEmptyOverwrite(progress, existingBackup?.progress_json)) {
      // 学習データはクラウド側を守りつつ、端末で変更した画像・目標日・表示名は保存する。
      // ここでreturnすると、XPが0のユーザーほど画像/目標日がクラウド保存されないため、必ず安全マージして続行する。
      progress = mergeRemoteLearningWithLocalProfile(progress, existingBackup?.progress_json);
      saveProgress(progress);
      status.message = "クラウドの学習データを守りながら、画像・目標日などの設定を保存しています...";
    }
    // Ver.111: 画像URL・ニックネームもバックアップ本体へ必ず含める。
    // 画像アップロードを先に行い、得られた公開URLを settings_json / progress_json の両方に残す。
    let avatarUrl = existingAvatarUrl || existingBackup?.progress_json?.avatarDataUrl || "";
    if (progress.avatarDataUrl) {
      if (progress.avatarDataUrl.startsWith("data:")) {
        const avatar = await uploadAvatarToSupabase(progress.username, progress.avatarDataUrl);
        status.avatar = avatar.ok ? "saved" : "error";
        avatarUrl = avatar.url || avatarUrl;
        if (!avatar.ok) optionalErrors.push(`avatar: ${avatar.message}`);
      } else {
        avatarUrl = progress.avatarDataUrl;
        status.avatar = "saved";
      }
    } else if (avatarUrl) {
      status.avatar = "saved";
    }

    const backupProgress = mergeProfileIntoBackup(progress, existingBackup?.progress_json, avatarUrl);
    await upsertFullProgressBackup(backupProgress);
    status.stats = "saved";

    try {
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          username: progress.username,
          display_name: backupProgress.displayName || progress.username,
          avatar_url: avatarUrl || backupProgress.avatarDataUrl || null,
          notifications_enabled: progress.notificationsEnabled ?? true,
          role: "user",
          last_login_at: progress.lastLoginAt || null,
          updated_at: nowText(),
        },
        { onConflict: "username" },
      );
      if (profileError) throw profileError;
      status.profile = "saved";
    } catch (error) {
      status.profile = "error";
      optionalErrors.push(error instanceof Error ? `profiles: ${error.message}` : "profiles保存エラー");
    }

    try {
      const { error: statsError } = await supabase.from("user_stats").upsert(
        {
          username: progress.username,
          xp: progress.xp || 0,
          level: progress.level || 1,
          current_streak: progress.currentStreak || 0,
          longest_streak: progress.longestStreak || 0,
          total_studied: progress.totalStudied || 0,
          current_round: progress.currentRound || 1,
          studied_verb_ids: progress.studiedVerbIds || [],
          test_correct: progress.testCorrect || 0,
          test_wrong: progress.testWrong || 0,
          weak_items: progress.weakItems || [],
          saved_phrase_count: progress.savedPhrases?.length || 0,
          review_item_count: Object.keys(progress.reviewItems || {}).length,
          updated_at: nowText(),
        },
        { onConflict: "username" },
      );
      if (statsError) throw statsError;
      // full backup が保存できていれば stats は saved 扱いを維持する。
      status.stats = "saved";
    } catch (error) {
      optionalErrors.push(error instanceof Error ? `user_stats: ${error.message}` : "user_stats保存エラー");
    }

    try {
      const { error: premiumError } = await supabase.from("premium_entitlements").upsert(
        {
          username: progress.username,
          plan: premiumPlan(progress),
          unlocked_verb_count: progress.unlockedVerbCount || 0,
          purchase_total_yen: progress.purchaseTotalYen || 0,
          lyrics_english_access: (progress.unlockedVerbCount || 0) >= PREMIUM_FULL_ACCESS_COUNT,
          source: progress.premiumSource || "checkout_ready",
          updated_at: nowText(),
        },
        { onConflict: "username" },
      );
      if (premiumError) throw premiumError;
      status.premium = "saved";
    } catch (error) {
      status.premium = "error";
      optionalErrors.push(error instanceof Error ? `premium: ${error.message}` : "premium保存エラー");
    }

    try {
      const voice: VoiceSettings = progress.voiceSettings || { gender: "female", lang: "en-US" };
      const { error: settingsError } = await supabase.from("learning_settings").upsert(
        {
          username: progress.username,
          voice_gender: voice.gender,
          voice_lang: voice.lang,
          notifications_enabled: progress.notificationsEnabled ?? true,
          updated_at: nowText(),
        },
        { onConflict: "username" },
      );
      if (settingsError) throw settingsError;
    } catch (error) {
      optionalErrors.push(error instanceof Error ? `learning_settings: ${error.message}` : "learning_settings保存エラー");
    }

    status.message = optionalErrors.length
      ? "学習データ本体はクラウドバックアップへ保存済みです。一部の補助テーブルはSQL確認が必要です。"
      : "バックアップ・プロフィール・学習記録・Premium状態をSupabaseへ保存しました。";
    status.updatedAt = nowText();
    return status;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Supabase保存に失敗しました。";
    return { ...status, stats: "error", message };
  }
}

function hasMeaningfulRemoteStats(data: any) {
  if (!data) return false;
  return Boolean(
    Number(data.xp || 0) > 0 ||
      Number(data.total_studied || 0) > 0 ||
      Number(data.test_correct || 0) > 0 ||
      Number(data.test_wrong || 0) > 0 ||
      (Array.isArray(data.studied_verb_ids) && data.studied_verb_ids.length > 0) ||
      (Array.isArray(data.weak_items) && data.weak_items.length > 0),
  );
}

export async function restoreLearningDataFromSupabase(username: string): Promise<{ ok: boolean; changed: boolean; message: string; status: CloudSyncStatus }> {
  const readiness = getCloudReadiness();
  if (!supabase) {
    return { ok: false, changed: false, message: readiness.message, status: readiness };
  }

  const status: CloudSyncStatus = {
    configured: true,
    profile: "idle",
    avatar: "idle",
    premium: "idle",
    stats: "idle",
    message: "Supabaseから復元確認中です...",
  };

  const optionalErrors: string[] = [];

  try {
    // Ver.66: user_progress_backups を復元の本命にする。
    // 旧テーブルが未作成でも、学習データ本体の復元は止めない。
    const backup = await fetchFullProgressBackup(username);
    const progress = ensureProgress(username);
    let changed = false;

    if (backup?.settings_json) {
      // Ver.85: 目標日・学習ペースなどの端末設定は、PC→スマホ同期のため常にクラウド値を反映する。
      applyClientStudySettingsSnapshot(backup.settings_json, progress);
      changed = true;
    }

    if (backup?.progress_json) {
      // Ver.114 reset fix: 画像・表示名・目標日・学習ペースはXPなどの学習スコアが0でも復元する。
      // 以前は「クラウドの学習スコアが端末より高い時だけ」復元していたため、
      // 画像や目標日だけ保存されているユーザーがログイン時に初期値へ戻ることがあった。
      applyClientStudySettingsSnapshot(backup.progress_json as ClientStudySettingsSnapshot, progress);
      changed = true;
    }

    if (backup?.progress_json && isRemoteProgressBetter(backup.progress_json, progress)) {
      const remoteProgress = backup.progress_json as UserProgress;
      const restored: UserProgress = {
        ...progress,
        ...remoteProgress,
        username,
        level: Math.max(1, Number(remoteProgress.level || progress.level || 1)),
        xp: Math.max(Number(progress.xp || 0), Number(remoteProgress.xp || 0)),
        totalStudied: Math.max(Number(progress.totalStudied || 0), Number(remoteProgress.totalStudied || 0)),
        testCorrect: Math.max(Number(progress.testCorrect || 0), Number(remoteProgress.testCorrect || 0)),
        testWrong: Math.max(Number(progress.testWrong || 0), Number(remoteProgress.testWrong || 0)),
        studiedVerbIds: Array.from(new Set([...(progress.studiedVerbIds || []), ...(remoteProgress.studiedVerbIds || [])])),
        weakItems: Array.from(new Set([...(progress.weakItems || []), ...(remoteProgress.weakItems || [])])),
        reviewItems: { ...(progress.reviewItems || {}), ...(remoteProgress.reviewItems || {}) },
        savedPhrases: remoteProgress.savedPhrases?.length ? remoteProgress.savedPhrases : progress.savedPhrases,
        testSessions: { ...(progress.testSessions || {}), ...(remoteProgress.testSessions || {}) },
        weeklyStats: { ...(progress.weeklyStats || {}), ...(remoteProgress.weeklyStats || {}) },
        displayName: remoteProgress.displayName || progress.displayName || username,
        avatarDataUrl: remoteProgress.avatarDataUrl || progress.avatarDataUrl,
        notificationsEnabled: typeof remoteProgress.notificationsEnabled === "boolean" ? remoteProgress.notificationsEnabled : progress.notificationsEnabled,
      };
      Object.assign(progress, restored);
      changed = true;
      status.stats = "saved";
    } else if (backup?.progress_json) {
      status.stats = "saved";
    }

    let profile: any = null;
    let stats: any = null;
    let premium: any = null;
    let settings: any = null;

    try {
      const { data, error } = await supabase.from("profiles").select("display_name, avatar_url, notifications_enabled, last_login_at, updated_at").eq("username", username).maybeSingle();
      if (error) throw error;
      profile = data;
    } catch (error) {
      optionalErrors.push(error instanceof Error ? `profiles: ${error.message}` : "profiles読込エラー");
    }

    try {
      const { data, error } = await supabase.from("user_stats").select("xp, level, current_streak, longest_streak, total_studied, current_round, studied_verb_ids, test_correct, test_wrong, weak_items, updated_at").eq("username", username).maybeSingle();
      if (error) throw error;
      stats = data;
    } catch (error) {
      optionalErrors.push(error instanceof Error ? `user_stats: ${error.message}` : "user_stats読込エラー");
    }

    try {
      const { data, error } = await supabase.from("premium_entitlements").select("unlocked_verb_count, purchase_total_yen, source, updated_at").eq("username", username).maybeSingle();
      if (error) throw error;
      premium = data;
    } catch (error) {
      optionalErrors.push(error instanceof Error ? `premium: ${error.message}` : "premium読込エラー");
    }

    try {
      const { data, error } = await supabase.from("learning_settings").select("voice_gender, voice_lang, notifications_enabled, updated_at").eq("username", username).maybeSingle();
      if (error) throw error;
      settings = data;
    } catch (error) {
      optionalErrors.push(error instanceof Error ? `learning_settings: ${error.message}` : "learning_settings読込エラー");
    }

    if (profile) {
      if (profile.display_name && (!progress.displayName || progress.displayName === username)) {
        progress.displayName = profile.display_name;
        changed = true;
      }
      if (typeof profile.notifications_enabled === "boolean") {
        progress.notificationsEnabled = profile.notifications_enabled;
        changed = true;
      }
      if (profile.avatar_url && !progress.avatarDataUrl) {
        progress.avatarDataUrl = profile.avatar_url;
        changed = true;
        status.avatar = "saved";
      }
      if (profile.last_login_at && (!progress.lastLoginAt || profile.last_login_at > progress.lastLoginAt)) {
        progress.lastLoginAt = profile.last_login_at;
        changed = true;
      }
      status.profile = "saved";
    }

    if (hasMeaningfulRemoteStats(stats)) {
      const remoteStudied = Array.isArray(stats.studied_verb_ids) ? stats.studied_verb_ids : [];
      const localStudied = progress.studiedVerbIds || [];
      const remoteWeak = Array.isArray(stats.weak_items) ? stats.weak_items : [];
      const localWeak = progress.weakItems || [];

      const shouldMerge =
        Number(stats.xp || 0) > (progress.xp || 0) ||
        Number(stats.total_studied || 0) > (progress.totalStudied || 0) ||
        remoteStudied.length > localStudied.length ||
        Number(stats.test_correct || 0) + Number(stats.test_wrong || 0) > (progress.testCorrect || 0) + (progress.testWrong || 0);

      if (shouldMerge) {
        progress.xp = Math.max(progress.xp || 0, Number(stats.xp || 0));
        progress.level = Math.max(progress.level || 1, Number(stats.level || 1));
        progress.currentStreak = Math.max(progress.currentStreak || 0, Number(stats.current_streak || 0));
        progress.longestStreak = Math.max(progress.longestStreak || 0, Number(stats.longest_streak || 0));
        progress.totalStudied = Math.max(progress.totalStudied || 0, Number(stats.total_studied || 0));
        progress.currentRound = Math.max(progress.currentRound || 1, Number(stats.current_round || 1));
        progress.studiedVerbIds = Array.from(new Set([...localStudied, ...remoteStudied]));
        progress.testCorrect = Math.max(progress.testCorrect || 0, Number(stats.test_correct || 0));
        progress.testWrong = Math.max(progress.testWrong || 0, Number(stats.test_wrong || 0));
        progress.weakItems = Array.from(new Set([...localWeak, ...remoteWeak]));
        changed = true;
      }
      status.stats = "saved";
    }

    if (premium) {
      const remoteUnlocked = Number(premium.unlocked_verb_count || 0);
      const remotePurchaseTotal = Number(premium.purchase_total_yen || 0);
      if (remoteUnlocked > (progress.unlockedVerbCount || 0) || remotePurchaseTotal > (progress.purchaseTotalYen || 0)) {
        progress.unlockedVerbCount = Math.max(progress.unlockedVerbCount || 0, remoteUnlocked);
        progress.purchaseTotalYen = Math.max(progress.purchaseTotalYen || 0, remotePurchaseTotal);
        progress.premiumUpdatedAt = premium.updated_at || progress.premiumUpdatedAt;
        progress.premiumSource = "restore";
        changed = true;
      }
      status.premium = "saved";
    }

    if (settings) {
      progress.voiceSettings = {
        gender: settings.voice_gender === "male" ? "male" : "female",
        lang: settings.voice_lang === "en-GB" ? "en-GB" : "en-US",
      };
      if (typeof settings.notifications_enabled === "boolean") progress.notificationsEnabled = settings.notifications_enabled;
      changed = true;
    }

    if (changed) saveProgress(progress);

    status.message = changed
      ? "Supabaseに残っていた学習データを端末へ復元しました。"
      : optionalErrors.length && status.stats === "saved"
        ? "学習データ本体のクラウドバックアップを確認しました。一部の補助テーブルはSQL確認が必要です。"
        : "Supabase復元を確認しました。最新の学習データを維持しています。";
    status.updatedAt = backup?.updated_at || nowText();
    return { ok: true, changed, message: status.message, status };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Supabase復元に失敗しました。";
    return { ok: false, changed: false, message, status: { ...status, stats: "error", message } };
  }
}


export async function getCloudBackupComparison(username: string): Promise<CloudBackupComparison> {
  const localProgress = ensureProgress(username);
  const local = summarizeProgress(localProgress);
  if (!supabase) {
    return {
      ok: false,
      message: "Supabase未設定のため、端末データのみ確認できます。",
      recommendation: "unknown",
      local,
      remote: null,
    };
  }
  try {
    const backup = await fetchFullProgressBackup(username);
    if (!backup?.progress_json) {
      return {
        ok: true,
        message: "クラウドバックアップはまだありません。端末データを保存できます。",
        recommendation: local.score > 0 ? "save_local" : "no_remote",
        local,
        remote: null,
      };
    }
    const remote = summarizeProgress(backup.progress_json);
    let recommendation: CloudBackupComparison["recommendation"] = "same";
    let message = "端末データとクラウドデータは大きな差がありません。";
    if (remote.score > local.score) {
      recommendation = "restore_remote";
      message = "クラウド側により多くの学習データがあります。先に復元するのがおすすめです。";
    } else if (local.score > remote.score) {
      recommendation = "save_local";
      message = "端末側に新しい学習データがあります。クラウド保存がおすすめです。";
    }
    if (local.score <= 0 && remote.score > 0) {
      recommendation = "restore_remote";
      message = "端末データが空に近く、クラウド側に学習データがあります。空データ上書きを防止中です。復元してください。";
    }
    return {
      ok: true,
      message,
      recommendation,
      local,
      remote,
      remoteUpdatedAt: backup.updated_at || "",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "クラウド比較に失敗しました。",
      recommendation: "unknown",
      local,
      remote: null,
    };
  }
}

export async function verifyCloudBackup(username: string) {
  if (!supabase) {
    return { ok: false, message: "Supabase未設定です。", updatedAt: "", summary: null as null | { xp: number; studied: number; savedPhrases: number; tests: number } };
  }
  try {
    const backup = await fetchFullProgressBackup(username);
    if (!backup?.progress_json) {
      return { ok: false, message: "クラウドバックアップがまだ見つかりません。先に保存してください。", updatedAt: "", summary: null };
    }
    const progress = backup.progress_json as Partial<UserProgress>;
    const summary = {
      xp: Number(progress.xp || 0),
      studied: (progress.studiedVerbIds || []).length,
      savedPhrases: (progress.savedPhrases || []).length,
      tests: Number(progress.testCorrect || 0) + Number(progress.testWrong || 0),
    };
    return {
      ok: true,
      message: "クラウドバックアップを確認できました。",
      updatedAt: backup.updated_at || "",
      summary,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "クラウドバックアップ確認に失敗しました。",
      updatedAt: "",
      summary: null,
    };
  }
}


export async function restorePremiumFromSupabase(username: string) {
  if (!supabase) {
    return { ok: false, message: "Supabase環境変数が未設定です。Vercelの環境変数を確認してください。" };
  }

  try {
    const { data, error } = await supabase
      .from("premium_entitlements")
      .select("unlocked_verb_count, purchase_total_yen, plan, updated_at")
      .eq("username", username)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return { ok: false, message: "Supabaseに購入状態が見つかりませんでした。" };
    }

    restorePremiumEntitlement(
      username,
      Number(data.unlocked_verb_count || 0),
      Number(data.purchase_total_yen || 0),
      `Supabaseから購入状態を復元しました。plan=${data.plan || "unknown"}`
    );

    return {
      ok: true,
      message: `購入状態を復元しました：${Number(data.unlocked_verb_count || 0)}動詞解放`,
      updatedAt: data.updated_at || nowText(),
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "購入状態の復元に失敗しました。",
    };
  }
}
