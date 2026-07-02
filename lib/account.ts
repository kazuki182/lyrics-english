"use client";

export type Account = {
  username: string;
  password: string;
  role: "admin" | "user";
  createdAt: string;
  lastLoginAt?: string;
};

export type ReviewItem = {
  itemId: string;
  verbId: string;
  wrongCount: number;
  correctCount: number;
  nextReviewAt: string;
  lastAnsweredAt: string;
  lastResult: "correct" | "wrong";
};

export type DailyMissionTask = {
  verbId: string;
  target: number;
  correct: number;
};

export type DailyMission = {
  date: string;
  tasks: DailyMissionTask[];
  completed: boolean;
  rewardClaimed: boolean;
};

export type BookmarkSection =
  "basic" | "idioms" | "phrasal" | "test" | "review";

export type StudyBookmark = {
  verbId: string;
  section: BookmarkSection;
  label: string;
  href: string;
  itemTitle?: string;
  itemIndex?: number;
  savedAt: string;
};

export type SavedPhrase = {
  id: string;
  verbId: string;
  section: BookmarkSection;
  meaningTitle: string;
  pattern: string;
  en: string;
  ja: string;
  savedAt: string;
};

export type TestItemStat = {
  itemId: string;
  verbId: string;
  correct: number;
  wrong: number;
  lastAnsweredAt: string;
};

export type TestSession = {
  key: string;
  verbId: string;
  section: string;
  itemIds: string[];
  index: number;
  shown: boolean;
  correct: number;
  wrong: number;
  updatedAt: string;
};

export type VoiceGender = "female" | "male";

export type VoiceSettings = {
  gender: VoiceGender;
  lang: "en-US" | "en-GB";
};

export type WeeklyStats = {
  weekKey: string;
  loginDays: string[];
  masteredVerbIds: string[];
  xp: number;
  studyMinutes: number;
};

export type LeagueAwards = {
  weeklyMvpWeeks: string[];
  seasonRanks: Record<string, { bestRank: number; xpRank: number; masteredRank: number; minutesRank: number }>;
};

export type PurchaseRecord = {
  id: string;
  username: string;
  unlockedVerbCount: number;
  purchaseTotalYen: number;
  planLabel: string;
  source: "admin_test" | "restore" | "checkout_ready" | "stripe_ready" | "stripe_test" | "stripe_webhook" | "stripe_refund" | "stripe_failed";
  provider?: "local" | "stripe" | "manual";
  paymentStatus?: "local_ready" | "stripe_checkout_created" | "paid" | "restored" | "refunded" | "void";
  checkoutSessionId?: string;
  planId?: string;
  createdAt: string;
  note?: string;
};

export type LeagueRow = {
  username: string;
  currentStreak: number;
  masteredCount: number;
  weeklyXp: number;
  weeklyStudyMinutes: number;
  mvpScore: number;
  badges: string[];
};

export type UserProgress = {
  username: string;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalStudied: number;
  currentRound: number;
  studiedVerbIds: string[];
  testCorrect: number;
  testWrong: number;
  weakItems: string[];
  reviewItems?: Record<string, ReviewItem>;
  dailyMission?: DailyMission;
  missionCompletedCount?: number;
  sectionClearIds?: string[];
  bookmark?: StudyBookmark;
  savedPhrases?: SavedPhrase[];
  testSessions?: Record<string, TestSession>;
  testItemStats?: Record<string, TestItemStat>;
  weeklyStats?: Record<string, WeeklyStats>;
  leagueAwards?: LeagueAwards;
  badges?: string[];
  voiceSettings?: VoiceSettings;
  displayName?: string;
  avatarDataUrl?: string;
  notificationsEnabled?: boolean;
  unlockedVerbCount?: number;
  purchaseTotalYen?: number;
  purchaseHistory?: PurchaseRecord[];
  premiumUpdatedAt?: string;
  premiumSource?: "admin_test" | "restore" | "checkout_ready" | "stripe_ready" | "stripe_test" | "stripe_webhook" | "stripe_refund" | "stripe_failed";
  targetDate?: string;
  targetStartDate?: string;
  studyDays?: StudyDaysSetting;
  studyPace?: StudyPaceSetting;
  lastStudyDate?: string;
  lastLoginAt?: string;
};

const ACCOUNTS_KEY = "verbMaster.accounts";
const CURRENT_USER_KEY = "verbMaster.currentUser";
const PROGRESS_KEY = "verbMaster.progress";
export const PROGRESS_SAVED_EVENT = "verbmaster:progress-saved";

function emitProgressSaved(username: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PROGRESS_SAVED_EVENT, { detail: { username, at: new Date().toISOString() } }));
}

export const TOTAL_VERB_TARGET = 124;
export const FREE_VERB_LIMIT = 3;
export const PREMIUM_FULL_ACCESS_COUNT = 120;
export const VERB_PACK_SIZE = 30;
export const VERB_PACK_PRICE_YEN = 500;
export const PREMIUM_UNLOCK_STEPS = [30, 60, 90, 120] as const;

export function purchaseTotalForUnlockCount(count: number) {
  const normalized = Math.max(0, Math.min(TOTAL_VERB_TARGET, Math.floor(count)));
  if (normalized <= FREE_VERB_LIMIT) return 0;
  if (normalized <= 30) return VERB_PACK_PRICE_YEN;
  if (normalized <= 60) return VERB_PACK_PRICE_YEN * 2;
  if (normalized <= 90) return VERB_PACK_PRICE_YEN * 3;
  return VERB_PACK_PRICE_YEN * 4;
}

export function getNextUnlockStep(currentCount: number) {
  const current = Math.max(FREE_VERB_LIMIT, Math.floor(currentCount || 0));
  return PREMIUM_UNLOCK_STEPS.find((step) => step > current) || PREMIUM_FULL_ACCESS_COUNT;
}


function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function nowText() {
  return new Date().toISOString();
}

function weekKey(date = new Date()) {
  const target = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(
    ((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${target.getUTCFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

function currentWeekKey() {
  return weekKey(new Date());
}

function getWeeklyStats(progress: UserProgress, key = currentWeekKey()) {
  progress.weeklyStats = progress.weeklyStats || {};
  if (!progress.weeklyStats[key]) {
    progress.weeklyStats[key] = {
      weekKey: key,
      loginDays: [],
      masteredVerbIds: [],
      xp: 0,
      studyMinutes: 0,
    };
  }
  return progress.weeklyStats[key];
}

function recordWeeklyLogin(progress: UserProgress) {
  const stats = getWeeklyStats(progress);
  const today = todayKey();
  if (!stats.loginDays.includes(today)) stats.loginDays.push(today);
}

function addWeeklyXp(progress: UserProgress, xp: number) {
  const stats = getWeeklyStats(progress);
  stats.xp += Math.max(0, xp);
}

function addStudyMinutes(progress: UserProgress, minutes = 1) {
  const stats = getWeeklyStats(progress);
  stats.studyMinutes += Math.max(0, minutes);
}

function addWeeklyMasteredVerb(progress: UserProgress, verbId: string) {
  const stats = getWeeklyStats(progress);
  if (!stats.masteredVerbIds.includes(verbId))
    stats.masteredVerbIds.push(verbId);
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function nextReviewDelay(wrongCount: number) {
  if (wrongCount <= 1) return 1;
  if (wrongCount === 2) return 3;
  return 7;
}

const DAILY_MISSION_VERBS = ["get", "take", "make"];
const DAILY_MISSION_TARGET = 3;
const DAILY_MISSION_REWARD_XP = 50;

function createDailyMission(date = todayKey()): DailyMission {
  return {
    date,
    tasks: DAILY_MISSION_VERBS.map((verbId) => ({
      verbId,
      target: DAILY_MISSION_TARGET,
      correct: 0,
    })),
    completed: false,
    rewardClaimed: false,
  };
}

function normalizeMission(progress: UserProgress) {
  const today = todayKey();
  if (!progress.dailyMission || progress.dailyMission.date !== today) {
    progress.dailyMission = createDailyMission(today);
  }
  if (typeof progress.missionCompletedCount !== "number")
    progress.missionCompletedCount = 0;
  return progress.dailyMission;
}

export function initAdminAccount() {
  if (typeof window === "undefined") return;
  const accounts = getAccounts();
  let changed = false;
  if (!accounts.some((a) => a.username === "kazurillex")) {
    accounts.push({
      username: "kazurillex",
      password: "0074",
      role: "admin",
      createdAt: nowText(),
    });
    changed = true;
  }
  if (!accounts.some((a) => a.username === "shun")) {
    accounts.push({
      username: "shun",
      password: "1234",
      role: "user",
      createdAt: nowText(),
    });
    changed = true;
  }
  if (changed) saveAccounts(accounts);
}


export function updateUserProfile(settings: { displayName?: string; avatarDataUrl?: string; notificationsEnabled?: boolean }) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  if (typeof settings.displayName === "string") {
    const name = settings.displayName.trim();
    progress.displayName = name || progress.username;
  }
  if (typeof settings.avatarDataUrl === "string") {
    progress.avatarDataUrl = settings.avatarDataUrl;
  }
  if (typeof settings.notificationsEnabled === "boolean") {
    progress.notificationsEnabled = settings.notificationsEnabled;
  }
  saveProgress(progress);
  return progress;
}

export function getAccounts(): Account[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function registerAccount(username: string, password: string) {
  initAdminAccount();
  const name = username.trim();
  if (!name) return { ok: false, message: "ユーザー名を入力してください。" };
  if (password.length < 4)
    return { ok: false, message: "パスワードは4文字以上にしてください。" };
  const accounts = getAccounts();
  if (accounts.some((a) => a.username === name))
    return { ok: false, message: "このユーザー名はすでに使われています。" };
  accounts.push({
    username: name,
    password,
    role: "user",
    createdAt: nowText(),
  });
  saveAccounts(accounts);
  setCurrentUser(name);
  ensureProgress(name);
  return { ok: true, message: "登録しました。" };
}

export function loginAccount(username: string, password: string) {
  initAdminAccount();
  const accounts = getAccounts();
  const account = accounts.find(
    (a) => a.username === username.trim() && a.password === password,
  );
  if (!account)
    return { ok: false, message: "ユーザー名またはパスワードが違います。" };
  const loginAt = nowText();
  account.lastLoginAt = loginAt;
  saveAccounts(accounts);
  setCurrentUser(account.username);
  const progress = ensureProgress(account.username);
  progress.lastLoginAt = loginAt;
  recordWeeklyLogin(progress);
  saveProgress(progress);
  return { ok: true, message: "ログインしました。" };
}

export function setCurrentUser(username: string) {
  localStorage.setItem(CURRENT_USER_KEY, username);
}

export function getCurrentUsername() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CURRENT_USER_KEY);
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

function progressMap(): Record<string, UserProgress> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgressMap(map: Record<string, UserProgress>) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
}

function normalizeProgress(progress: UserProgress) {
  if (!progress.weakItems) progress.weakItems = [];
  if (!progress.reviewItems) progress.reviewItems = {};
  if (!progress.sectionClearIds) progress.sectionClearIds = [];
  if (!progress.savedPhrases) progress.savedPhrases = [];
  if (!progress.testSessions) progress.testSessions = {};
  if (!progress.testItemStats) progress.testItemStats = {};
  if (!progress.weeklyStats) progress.weeklyStats = {};
  if (!progress.leagueAwards) progress.leagueAwards = { weeklyMvpWeeks: [], seasonRanks: {} };
  if (!progress.leagueAwards.weeklyMvpWeeks) progress.leagueAwards.weeklyMvpWeeks = [];
  if (!progress.leagueAwards.seasonRanks) progress.leagueAwards.seasonRanks = {};
  if (!progress.badges) progress.badges = [];
  if (!progress.voiceSettings) {
    progress.voiceSettings = { gender: "female", lang: "en-US" };
  }
  if (!progress.displayName) progress.displayName = progress.username;
  if (typeof progress.notificationsEnabled !== "boolean")
    progress.notificationsEnabled = true;
  recordWeeklyLogin(progress);
  if (typeof progress.unlockedVerbCount !== "number")
    progress.unlockedVerbCount = 0;
  if (typeof progress.purchaseTotalYen !== "number")
    progress.purchaseTotalYen = 0;
  if (!progress.purchaseHistory) progress.purchaseHistory = [];
  if (!progress.premiumUpdatedAt) progress.premiumUpdatedAt = progress.purchaseHistory[0]?.createdAt || progress.lastLoginAt || nowText();
  if (!progress.premiumSource) progress.premiumSource = progress.purchaseHistory[0]?.source || "checkout_ready";
  if (!progress.targetDate) progress.targetDate = readScopedStorage(TARGET_DATE_KEY) || undefined;
  if (!progress.targetStartDate) progress.targetStartDate = readScopedStorage(TARGET_START_DATE_KEY) || undefined;
  if (!progress.studyDays) {
    const savedStudyDays = readScopedStorage(STUDY_DAYS_KEY);
    if (savedStudyDays) {
      try { progress.studyDays = normalizeStudyDays(JSON.parse(savedStudyDays)); } catch {}
    }
  }
  if (!progress.studyPace) {
    const savedStudyPace = readScopedStorage(STUDY_PACE_KEY);
    if (savedStudyPace) {
      try { progress.studyPace = normalizeStudyPace(JSON.parse(savedStudyPace)); } catch {}
    }
  }
  normalizeMission(progress);
  return progress;
}

export function ensureProgress(username: string): UserProgress {
  const map = progressMap();
  if (!map[username]) {
    map[username] = {
      username,
      xp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      totalStudied: 0,
      currentRound: 1,
      studiedVerbIds: [],
      testCorrect: 0,
      testWrong: 0,
      weakItems: [],
      reviewItems: {},
      dailyMission: createDailyMission(),
      missionCompletedCount: 0,
      sectionClearIds: [],
      savedPhrases: [],
      testSessions: {},
      testItemStats: {},
      weeklyStats: {},
      leagueAwards: { weeklyMvpWeeks: [], seasonRanks: {} },
      badges: [],
      voiceSettings: { gender: "female", lang: "en-US" },
      displayName: username,
      avatarDataUrl: "",
      notificationsEnabled: true,
      unlockedVerbCount: 0,
      purchaseTotalYen: 0,
      purchaseHistory: [],
      premiumUpdatedAt: nowText(),
      premiumSource: "checkout_ready",
      targetDate: readScopedStorage(TARGET_DATE_KEY) || undefined,
      targetStartDate: readScopedStorage(TARGET_START_DATE_KEY) || undefined,
      studyDays: undefined,
      studyPace: undefined,
    };
    saveProgressMap(map);
  }
  return normalizeProgress(map[username]);
}

export function getCurrentProgress() {
  const username = getCurrentUsername();
  if (!username) return null;
  return ensureProgress(username);
}

export function saveProgress(progress: UserProgress) {
  const map = progressMap();
  progress.level = Math.max(1, Math.floor(progress.xp / 100) + 1);
  map[progress.username] = normalizeProgress(progress);
  saveProgressMap(map);
  emitProgressSaved(progress.username);
}

function updateStreak(progress: UserProgress) {
  const today = todayKey();
  if (progress.lastStudyDate === today) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const y = yesterday.toISOString().slice(0, 10);
  progress.currentStreak =
    progress.lastStudyDate === y ? progress.currentStreak + 1 : 1;
  progress.longestStreak = Math.max(
    progress.longestStreak,
    progress.currentStreak,
  );
  progress.lastStudyDate = today;
}

export function recordStudy(verbId: string, totalVerbs: number) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  updateStreak(progress);
  progress.xp += 10;
  addWeeklyXp(progress, 10);
  addStudyMinutes(progress, 2);
  progress.totalStudied += 1;
  if (!progress.studiedVerbIds.includes(verbId)) {
    progress.studiedVerbIds.push(verbId);
    addWeeklyMasteredVerb(progress, verbId);
  }
  if (progress.studiedVerbIds.length >= totalVerbs) {
    progress.currentRound += 1;
    progress.studiedVerbIds = [];
    progress.xp += 100;
    addWeeklyXp(progress, 100);
  }
  saveProgress(progress);
  return progress;
}

function recordTestItemStat(progress: UserProgress, verbId: string, itemId: string, correct: boolean) {
  progress.testItemStats = progress.testItemStats || {};
  const existing = progress.testItemStats[itemId] || {
    itemId,
    verbId,
    correct: 0,
    wrong: 0,
    lastAnsweredAt: nowText(),
  };
  existing.verbId = verbId;
  if (correct) existing.correct += 1;
  else existing.wrong += 1;
  existing.lastAnsweredAt = nowText();
  progress.testItemStats[itemId] = existing;
}

export function recordTestResult(
  verbId: string,
  itemId: string,
  correct: boolean,
) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  updateStreak(progress);
  progress.reviewItems = progress.reviewItems || {};
  const existing = progress.reviewItems[itemId];

  recordTestItemStat(progress, verbId, itemId, correct);

  if (correct) {
    progress.testCorrect += 1;
    progress.xp += 5;
    addWeeklyXp(progress, 5);
    addStudyMinutes(progress, 1);
    progress.weakItems = progress.weakItems.filter((id) => id !== itemId);
    const mission = normalizeMission(progress);
    const task = mission.tasks.find((t) => t.verbId === verbId);
    if (task && task.correct < task.target) task.correct += 1;
    if (
      !mission.completed &&
      mission.tasks.every((t) => t.correct >= t.target)
    ) {
      mission.completed = true;
      mission.rewardClaimed = true;
      progress.xp += DAILY_MISSION_REWARD_XP;
      addWeeklyXp(progress, DAILY_MISSION_REWARD_XP);
      progress.missionCompletedCount =
        (progress.missionCompletedCount || 0) + 1;
    }
    if (existing) {
      existing.correctCount += 1;
      existing.lastResult = "correct";
      existing.lastAnsweredAt = nowText();
      existing.nextReviewAt = addDays(existing.correctCount >= 2 ? 7 : 3);
    }
  } else {
    progress.testWrong += 1;
    addStudyMinutes(progress, 1);
    const wrongCount = (existing?.wrongCount || 0) + 1;
    progress.weakItems = Array.from(new Set([...progress.weakItems, itemId]));
    progress.reviewItems[itemId] = {
      itemId,
      verbId,
      wrongCount,
      correctCount: existing?.correctCount || 0,
      nextReviewAt: addDays(nextReviewDelay(wrongCount)),
      lastAnsweredAt: nowText(),
      lastResult: "wrong",
    };
  }
  saveProgress(progress);
  return progress;
}


export function recordReviewResult(
  verbId: string,
  itemId: string,
  correct: boolean,
) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  updateStreak(progress);
  progress.reviewItems = progress.reviewItems || {};
  const existing = progress.reviewItems[itemId];

  recordTestItemStat(progress, verbId, itemId, correct);

  if (correct) {
    progress.testCorrect += 1;
    progress.xp += 8;
    addWeeklyXp(progress, 8);
    addStudyMinutes(progress, 1);
    progress.weakItems = progress.weakItems.filter((id) => id !== itemId);
    if (existing) {
      delete progress.reviewItems[itemId];
    }
  } else {
    progress.testWrong += 1;
    addStudyMinutes(progress, 1);
    const wrongCount = (existing?.wrongCount || 0) + 1;
    progress.weakItems = Array.from(new Set([...progress.weakItems, itemId]));
    progress.reviewItems[itemId] = {
      itemId,
      verbId,
      wrongCount,
      correctCount: existing?.correctCount || 0,
      nextReviewAt: addDays(nextReviewDelay(wrongCount)),
      lastAnsweredAt: nowText(),
      lastResult: "wrong",
    };
  }
  saveProgress(progress);
  return progress;
}

export function getDueReviewItems() {
  const progress = getCurrentProgress();
  if (!progress) return [] as ReviewItem[];
  const today = todayKey();
  const reviewItems = progress.reviewItems || {};
  return Object.values(reviewItems)
    .filter((item) => item.lastResult === "wrong" || item.nextReviewAt <= today)
    .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt));
}

export function getFutureReviewItems() {
  const progress = getCurrentProgress();
  if (!progress) return [] as ReviewItem[];
  const today = todayKey();
  const reviewItems = progress.reviewItems || {};
  return Object.values(reviewItems)
    .filter((item) => item.lastResult !== "wrong" && item.nextReviewAt > today)
    .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt));
}

export function getTodayMission() {
  const progress = getCurrentProgress();
  if (!progress) return null;
  const mission = normalizeMission(progress);
  saveProgress(progress);
  return mission;
}

export function getMissionSummary() {
  const mission = getTodayMission();
  if (!mission) return null;
  const total = mission.tasks.reduce((sum, task) => sum + task.target, 0);
  const done = mission.tasks.reduce(
    (sum, task) => sum + Math.min(task.correct, task.target),
    0,
  );
  return {
    mission,
    total,
    done,
    remaining: Math.max(0, total - done),
    percent: total ? Math.round((done / total) * 100) : 0,
  };
}

export function getMissionConfig() {
  return {
    target: DAILY_MISSION_TARGET,
    rewardXp: DAILY_MISSION_REWARD_XP,
    verbIds: DAILY_MISSION_VERBS,
  };
}

export function formatDateTime(value?: string) {
  if (!value) return "未記録";
  try {
    return new Intl.DateTimeFormat("ja-JP", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function formatDate(value?: string) {
  if (!value) return "未定";
  try {
    return new Intl.DateTimeFormat("ja-JP", {
      month: "short",
      day: "numeric",
    }).format(new Date(`${value}T00:00:00`));
  } catch {
    return value;
  }
}

export function getAllProgress() {
  return Object.values(progressMap())
    .map(normalizeProgress)
    .sort((a, b) => b.xp - a.xp);
}

export function getCurrentWeekKey() {
  return currentWeekKey();
}

export function getComputedBadges(progress: UserProgress) {
  const badges: string[] = [];
  const studiedCount = (progress.studiedVerbIds || []).length;
  const sectionClearCount = (progress.sectionClearIds || []).length;
  const phraseCount = (progress.savedPhrases || []).length;
  const correctCount = progress.testCorrect || 0;

  if (progress.totalStudied > 0 || sectionClearCount > 0 || correctCount > 0)
    badges.push("🏁 初回学習");

  if (progress.currentStreak >= 7) badges.push("🔥 7日継続");
  if (progress.currentStreak >= 30) badges.push("🔥 30日継続");
  if (progress.currentStreak >= 100) badges.push("💎 100日継続");

  if (studiedCount >= 1) badges.push("📚 初MASTER");
  if (studiedCount >= 5) badges.push("📚 5動詞MASTER");
  if (studiedCount >= 30) badges.push("🏆 30動詞MASTER");

  (progress.studiedVerbIds || []).slice(0, 12).forEach((verbId) => {
    badges.push(`🎯 ${verbId.toUpperCase()} MASTER`);
  });

  if (sectionClearCount >= 1) badges.push("💯 初セクションクリア");
  if (sectionClearCount >= 10) badges.push("💯 10セクションクリア");
  if (correctCount >= 10) badges.push("✅ 10問正解");
  if (correctCount >= 100) badges.push("🎯 100問正解");
  if (phraseCount >= 10) badges.push("⭐ 10フレーズ保存");

  return Array.from(new Set([...(progress.badges || []), ...badges]));
}


export function getSeasonInfo(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const season = month <= 2 ? "Winter" : month <= 5 ? "Spring" : month <= 8 ? "Summer" : "Autumn";
  const ja = season === "Winter" ? "冬" : season === "Spring" ? "春" : season === "Summer" ? "夏" : "秋";
  return {
    key: `${year}-${season}`,
    label: `Season ${year} ${ja}`,
    englishLabel: `${year} ${season}`,
  };
}

function getValueForLeagueType(row: LeagueRow, type: "streak" | "mastered" | "xp" | "minutes" | "mvp") {
  if (type === "streak") return row.currentStreak;
  if (type === "mastered") return row.masteredCount;
  if (type === "minutes") return row.weeklyStudyMinutes;
  if (type === "mvp") return row.mvpScore;
  return row.weeklyXp;
}

export function getCurrentUserRankInfo(type: "streak" | "mastered" | "xp" | "minutes" | "mvp") {
  const username = getCurrentUsername();
  const rows = getLeagueRanking(type);
  if (!username) return null;
  const index = rows.findIndex((row) => row.username === username);
  if (index < 0) return null;
  const current = rows[index];
  const previous = rows[index - 1];
  const currentValue = getValueForLeagueType(current, type);
  const previousValue = previous ? getValueForLeagueType(previous, type) : null;
  return {
    rank: index + 1,
    total: rows.length,
    currentValue,
    pointsToNext: previousValue == null ? 0 : Math.max(0, previousValue - currentValue + 1),
  };
}

export function recordWeeklyMvpSnapshot() {
  if (typeof window === "undefined") return null;
  const rows = getLeagueRanking("mvp");
  const winner = rows[0];
  if (!winner) return null;
  const map = progressMap();
  const progress = map[winner.username] ? normalizeProgress(map[winner.username]) : null;
  if (!progress) return null;
  const key = currentWeekKey();
  progress.leagueAwards = progress.leagueAwards || { weeklyMvpWeeks: [], seasonRanks: {} };
  if (!progress.leagueAwards.weeklyMvpWeeks.includes(key)) {
    progress.leagueAwards.weeklyMvpWeeks.push(key);
  }
  map[winner.username] = progress;
  saveProgressMap(map);
  return winner;
}

export function getWeeklyMvpCount(username?: string) {
  const target = username || getCurrentUsername();
  if (!target) return 0;
  const progress = ensureProgress(target);
  return progress.leagueAwards?.weeklyMvpWeeks?.length || 0;
}

export function getSeasonRankSummary(username?: string) {
  const target = username || getCurrentUsername();
  const season = getSeasonInfo();
  if (!target) return null;
  const xp = getCurrentUserRankInfo("xp");
  const mastered = getCurrentUserRankInfo("mastered");
  const minutes = getCurrentUserRankInfo("minutes");
  const mvp = getCurrentUserRankInfo("mvp");
  return {
    season,
    xpRank: xp?.rank || 0,
    masteredRank: mastered?.rank || 0,
    minutesRank: minutes?.rank || 0,
    mvpRank: mvp?.rank || 0,
    total: xp?.total || mastered?.total || minutes?.total || mvp?.total || 0,
  };
}

export function getLeagueRows() {
  const key = currentWeekKey();
  return getAllProgress().map((progress) => {
    const stats = progress.weeklyStats?.[key] || {
      weekKey: key,
      loginDays: [],
      masteredVerbIds: [],
      xp: 0,
      studyMinutes: 0,
    };
    const masteredCount = stats.masteredVerbIds.length;
    const weeklyXp = stats.xp;
    const weeklyStudyMinutes = stats.studyMinutes;
    const mvpScore =
      weeklyXp +
      masteredCount * 100 +
      stats.loginDays.length * 50 +
      weeklyStudyMinutes * 5;
    return {
      username: progress.username,
      currentStreak: progress.currentStreak || 0,
      masteredCount,
      weeklyXp,
      weeklyStudyMinutes,
      mvpScore,
      badges: getComputedBadges(progress),
    };
  });
}

export function getLeagueRanking(
  type: "streak" | "mastered" | "xp" | "minutes" | "mvp",
) {
  const rows = getLeagueRows();
  const value = (row: LeagueRow) => {
    if (type === "streak") return row.currentStreak;
    if (type === "mastered") return row.masteredCount;
    if (type === "minutes") return row.weeklyStudyMinutes;
    if (type === "mvp") return row.mvpScore;
    return row.weeklyXp;
  };
  return rows.sort((a, b) => value(b) - value(a));
}

const TARGET_DATE_KEY = "verbMaster.targetDate";
const TARGET_START_DATE_KEY = "verbMaster.targetStartDate";
const STUDY_DAYS_KEY = "verbMaster.studyDays";
const STUDY_PACE_KEY = "verbMaster.studyPace";

function userScopedKey(baseKey: string, username = getCurrentUsername()) {
  return username ? `${baseKey}.${username}` : baseKey;
}

function readScopedStorage(baseKey: string) {
  if (typeof window === "undefined") return null;
  const scoped = localStorage.getItem(userScopedKey(baseKey));
  if (scoped != null) return scoped;
  return localStorage.getItem(baseKey);
}

function writeScopedStorage(baseKey: string, value: string, username = getCurrentUsername()) {
  if (typeof window === "undefined") return;
  localStorage.setItem(userScopedKey(baseKey, username), value);
}

function getCurrentProgressWithoutInit() {
  const username = getCurrentUsername();
  if (!username || typeof window === "undefined") return null;
  try {
    const map = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    return map?.[username] || null;
  } catch {
    return null;
  }
}

export type StudyDaysSetting = {
  mode: "everyday" | "weekdays" | "custom";
  days: number[];
};

export type StudyPaceSetting = {
  days: number;
  verbs: number;
};

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function normalizeDate(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function normalizePositiveInteger(value: unknown, fallback: number) {
  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.max(1, Math.floor(numberValue));
}

function getDefaultStudyPace(): StudyPaceSetting {
  return { days: 3, verbs: 1 };
}

function normalizeStudyPace(
  value: Partial<StudyPaceSetting> | null | undefined,
): StudyPaceSetting {
  return {
    days: normalizePositiveInteger(value?.days, 3),
    verbs: normalizePositiveInteger(value?.verbs, 1),
  };
}

export function getStudyPaceSetting(): StudyPaceSetting {
  if (typeof window === "undefined") return getDefaultStudyPace();
  try {
    const progress = getCurrentProgressWithoutInit();
    if (progress?.studyPace) return normalizeStudyPace(progress.studyPace);
    const saved = readScopedStorage(STUDY_PACE_KEY);
    if (!saved) return getDefaultStudyPace();
    return normalizeStudyPace(JSON.parse(saved));
  } catch {
    return getDefaultStudyPace();
  }
}

export function setStudyPaceSetting(value: StudyPaceSetting) {
  if (typeof window === "undefined") return;
  const normalized = normalizeStudyPace(value);
  writeScopedStorage(STUDY_PACE_KEY, JSON.stringify(normalized));
  const progress = getCurrentProgressWithoutInit();
  if (progress) {
    progress.studyPace = normalized;
    saveProgress(progress);
  }
}

export function formatStudyPace(value = getStudyPaceSetting()) {
  const pace = normalizeStudyPace(value);
  return `${pace.days}日で${pace.verbs}語`;
}

function getRecommendedPaceLabel(remaining: number, studyDaysLeft: number) {
  if (remaining <= 0) return "完了";
  if (studyDaysLeft <= 0) return `${remaining}語を早めに復習`;
  if (remaining >= studyDaysLeft) {
    return `1日${Math.ceil(remaining / studyDaysLeft)}語`;
  }
  return `${Math.ceil(studyDaysLeft / remaining)}日で1語`;
}

function getDefaultStudyDays(): StudyDaysSetting {
  return { mode: "everyday", days: [0, 1, 2, 3, 4, 5, 6] };
}

function normalizeStudyDays(value: StudyDaysSetting): StudyDaysSetting {
  const unique = Array.from(
    new Set((value.days || []).filter((day) => day >= 0 && day <= 6)),
  ).sort((a, b) => a - b);
  if (value.mode === "weekdays")
    return { mode: "weekdays", days: [1, 2, 3, 4, 5] };
  if (value.mode === "custom")
    return { mode: "custom", days: unique.length ? unique : [1, 2, 3, 4, 5] };
  return getDefaultStudyDays();
}

export function getStudyDaysSetting(): StudyDaysSetting {
  if (typeof window === "undefined") return getDefaultStudyDays();
  try {
    const progress = getCurrentProgressWithoutInit();
    if (progress?.studyDays) return normalizeStudyDays(progress.studyDays);
    const saved = readScopedStorage(STUDY_DAYS_KEY);
    if (!saved) return getDefaultStudyDays();
    return normalizeStudyDays(JSON.parse(saved));
  } catch {
    return getDefaultStudyDays();
  }
}

export function setStudyDaysSetting(value: StudyDaysSetting) {
  if (typeof window === "undefined") return;
  const normalized = normalizeStudyDays(value);
  writeScopedStorage(STUDY_DAYS_KEY, JSON.stringify(normalized));
  const progress = getCurrentProgressWithoutInit();
  if (progress) {
    progress.studyDays = normalized;
    saveProgress(progress);
  }
}

export function getStudyDaysLabel(setting = getStudyDaysSetting()) {
  const labels = ["日", "月", "火", "水", "木", "金", "土"];
  if (setting.mode === "everyday") return "毎日";
  if (setting.mode === "weekdays") return "平日のみ";
  return setting.days.map((day) => labels[day]).join("・");
}

function countStudyDays(start: Date, end: Date, studyDays: number[]) {
  const from = normalizeDate(start);
  const to = normalizeDate(end);
  if (to < from) return 0;
  let count = 0;
  const current = new Date(from);
  while (current <= to) {
    if (studyDays.includes(current.getDay())) count += 1;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

function getTargetStartDate() {
  if (typeof window === "undefined") return isoDate(new Date());
  const progress = getCurrentProgressWithoutInit();
  if (progress?.targetStartDate) return progress.targetStartDate;
  const saved = readScopedStorage(TARGET_START_DATE_KEY);
  if (saved) return saved;
  const value = isoDate(new Date());
  writeScopedStorage(TARGET_START_DATE_KEY, value);
  if (progress) {
    progress.targetStartDate = value;
    saveProgress(progress);
  }
  return value;
}

export function getTargetDate() {
  if (typeof window === "undefined") return "";
  const progress = getCurrentProgressWithoutInit();
  if (progress?.targetDate) return progress.targetDate;
  const saved = readScopedStorage(TARGET_DATE_KEY);
  if (saved) return saved;
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 60);
  const value = isoDate(defaultDate);
  const start = isoDate(new Date());
  writeScopedStorage(TARGET_DATE_KEY, value);
  writeScopedStorage(TARGET_START_DATE_KEY, start);
  if (progress) {
    progress.targetDate = value;
    progress.targetStartDate = start;
    saveProgress(progress);
  }
  return value;
}

export function setTargetDate(value: string) {
  if (typeof window === "undefined") return;
  if (value) {
    const start = isoDate(new Date());
    writeScopedStorage(TARGET_DATE_KEY, value);
    writeScopedStorage(TARGET_START_DATE_KEY, start);
    const progress = getCurrentProgressWithoutInit();
    if (progress) {
      progress.targetDate = value;
      progress.targetStartDate = start;
      saveProgress(progress);
    }
  }
}

export type ClientStudySettingsSnapshot = {
  targetDate?: string;
  targetStartDate?: string;
  studyDays?: StudyDaysSetting;
  studyPace?: StudyPaceSetting;
  displayName?: string;
  nickname?: string;
  avatarUrl?: string;
  avatarDataUrl?: string;
  notificationsEnabled?: boolean;
  voiceSettings?: VoiceSettings;
  unlockedVerbCount?: number;
  purchaseTotalYen?: number;
  premiumSource?: UserProgress["premiumSource"];
  premiumUpdatedAt?: string;
};

export function getClientStudySettingsSnapshot(progress?: UserProgress | null): ClientStudySettingsSnapshot {
  if (typeof window === "undefined") return {};
  return {
    targetDate: progress?.targetDate || readScopedStorage(TARGET_DATE_KEY) || undefined,
    targetStartDate: progress?.targetStartDate || readScopedStorage(TARGET_START_DATE_KEY) || undefined,
    studyDays: progress?.studyDays || getStudyDaysSetting(),
    studyPace: progress?.studyPace || getStudyPaceSetting(),
    displayName: progress?.displayName || progress?.username,
    nickname: progress?.displayName || progress?.username,
    avatarUrl: progress?.avatarDataUrl || undefined,
    avatarDataUrl: progress?.avatarDataUrl || undefined,
    notificationsEnabled: progress?.notificationsEnabled,
    voiceSettings: progress?.voiceSettings,
    unlockedVerbCount: progress?.unlockedVerbCount,
    purchaseTotalYen: progress?.purchaseTotalYen,
    premiumSource: progress?.premiumSource,
    premiumUpdatedAt: progress?.premiumUpdatedAt,
  };
}

export function applyClientStudySettingsSnapshot(snapshot?: ClientStudySettingsSnapshot | null, progress?: UserProgress | null) {
  if (typeof window === "undefined" || !snapshot) return;
  if (snapshot.targetDate) writeScopedStorage(TARGET_DATE_KEY, snapshot.targetDate, progress?.username);
  if (snapshot.targetStartDate) writeScopedStorage(TARGET_START_DATE_KEY, snapshot.targetStartDate, progress?.username);
  if (snapshot.studyDays) writeScopedStorage(STUDY_DAYS_KEY, JSON.stringify(normalizeStudyDays(snapshot.studyDays)), progress?.username);
  if (snapshot.studyPace) writeScopedStorage(STUDY_PACE_KEY, JSON.stringify(normalizeStudyPace(snapshot.studyPace)), progress?.username);
  if (!progress) return;
  if (snapshot.targetDate) progress.targetDate = snapshot.targetDate;
  if (snapshot.targetStartDate) progress.targetStartDate = snapshot.targetStartDate;
  if (snapshot.studyDays) progress.studyDays = normalizeStudyDays(snapshot.studyDays);
  if (snapshot.studyPace) progress.studyPace = normalizeStudyPace(snapshot.studyPace);
  if (snapshot.displayName || snapshot.nickname) progress.displayName = snapshot.displayName || snapshot.nickname || progress.displayName || progress.username;
  if (snapshot.avatarUrl || snapshot.avatarDataUrl) progress.avatarDataUrl = snapshot.avatarUrl || snapshot.avatarDataUrl || progress.avatarDataUrl || "";
  if (typeof snapshot.notificationsEnabled === "boolean") progress.notificationsEnabled = snapshot.notificationsEnabled;
  if (snapshot.voiceSettings) progress.voiceSettings = snapshot.voiceSettings;
  if (typeof snapshot.unlockedVerbCount === "number") progress.unlockedVerbCount = Math.max(progress.unlockedVerbCount || 0, snapshot.unlockedVerbCount);
  if (typeof snapshot.purchaseTotalYen === "number") progress.purchaseTotalYen = Math.max(progress.purchaseTotalYen || 0, snapshot.purchaseTotalYen);
  if (snapshot.premiumSource) progress.premiumSource = snapshot.premiumSource;
  if (snapshot.premiumUpdatedAt) progress.premiumUpdatedAt = snapshot.premiumUpdatedAt;
}

export function getLearningPlan(totalVerbs: number, completedVerbs: number) {
  const targetDate = getTargetDate();
  const studyDays = getStudyDaysSetting();
  const today = normalizeDate(new Date());
  const target = targetDate
    ? normalizeDate(new Date(`${targetDate}T00:00:00`))
    : today;
  const start = normalizeDate(new Date(`${getTargetStartDate()}T00:00:00`));
  const diffMs = target.getTime() - today.getTime();
  const calendarDaysLeft = Math.max(
    1,
    Math.ceil(diffMs / (1000 * 60 * 60 * 24)),
  );
  const studyDaysLeft = Math.max(
    1,
    countStudyDays(today, target, studyDays.days),
  );
  const remaining = Math.max(0, totalVerbs - completedVerbs);
  const dailyGoal = Math.max(
    remaining > 0 ? 1 : 0,
    Math.ceil(remaining / studyDaysLeft),
  );
  const recommendedPaceLabel = getRecommendedPaceLabel(
    remaining,
    studyDaysLeft,
  );
  const studyPace = getStudyPaceSetting();
  const selectedPaceLabel = formatStudyPace(studyPace);
  const selectedPaceCapacity = Math.floor(
    (studyDaysLeft / studyPace.days) * studyPace.verbs,
  );
  const selectedPaceDiff = selectedPaceCapacity - remaining;
  const selectedPaceStatus =
    remaining <= 0 || selectedPaceDiff >= 0 ? "ok" : "short";
  const progressPercent = totalVerbs
    ? Math.round((completedVerbs / totalVerbs) * 100)
    : 0;
  const totalPlanStudyDays = Math.max(
    1,
    countStudyDays(start, target, studyDays.days),
  );
  const elapsedStudyDays = Math.max(
    0,
    countStudyDays(start, today, studyDays.days) - 1,
  );
  const expectedCompleted = Math.min(
    totalVerbs,
    Math.floor((totalVerbs * elapsedStudyDays) / totalPlanStudyDays),
  );
  const paceDiff = completedVerbs - expectedCompleted;
  const paceStatus =
    paceDiff > 0 ? "ahead" : paceDiff < 0 ? "behind" : "onTrack";
  return {
    targetDate,
    daysLeft: calendarDaysLeft,
    studyDaysLeft,
    studyDayLabel: getStudyDaysLabel(studyDays),
    remaining,
    dailyGoal,
    recommendedPaceLabel,
    selectedPaceLabel,
    selectedPaceCapacity,
    selectedPaceDiff,
    selectedPaceStatus,
    progressPercent,
    expectedCompleted,
    paceDiff,
    paceStatus,
  };
}

export function recordVerbMastery(verbId: string) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  updateStreak(progress);
  if (!progress.studiedVerbIds.includes(verbId)) {
    progress.studiedVerbIds.push(verbId);
    addWeeklyMasteredVerb(progress, verbId);
    progress.totalStudied += 1;
    progress.xp += 100;
    addWeeklyXp(progress, 100);
    addStudyMinutes(progress, 5);
  }
  saveProgress(progress);
  return progress;
}

export function recordSectionClear(
  verbId: string,
  section: string,
  xp: number,
) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  updateStreak(progress);
  progress.sectionClearIds = progress.sectionClearIds || [];
  const key = `${verbId}:${section}`;
  if (!progress.sectionClearIds.includes(key)) {
    progress.sectionClearIds.push(key);
    progress.xp += xp;
    addWeeklyXp(progress, xp);
    addStudyMinutes(progress, 3);
  }
  saveProgress(progress);
  return progress;
}

export function recordTestCompletion(section: string, xp = 10) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  updateStreak(progress);
  const safeXp = Math.max(0, xp);
  progress.xp += safeXp;
  addWeeklyXp(progress, safeXp);
  addStudyMinutes(progress, 2);
  saveProgress(progress);
  return progress;
}

export function saveBookmark(bookmark: Omit<StudyBookmark, "savedAt">) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  progress.bookmark = { ...bookmark, savedAt: nowText() };
  saveProgress(progress);
  return progress.bookmark;
}

export function getCurrentBookmark() {
  const progress = getCurrentProgress();
  return progress?.bookmark ?? null;
}

export function clearBookmark() {
  const progress = getCurrentProgress();
  if (!progress) return null;
  delete progress.bookmark;
  saveProgress(progress);
  return progress;
}

export function getBookmarkSectionLabel(section: BookmarkSection) {
  if (section === "basic" || section === "idioms") return "基本";
  if (section === "phrasal") return "句動詞";
  if (section === "test") return "テスト";
  return "復習";
}

export function getSavedPhrases() {
  const progress = getCurrentProgress();
  return progress?.savedPhrases ?? [];
}

export function isPhraseSaved(id: string) {
  return getSavedPhrases().some((phrase) => phrase.id === id);
}

export function savePhrase(phrase: Omit<SavedPhrase, "savedAt">) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  progress.savedPhrases = progress.savedPhrases || [];
  if (!progress.savedPhrases.some((item) => item.id === phrase.id)) {
    progress.savedPhrases.unshift({ ...phrase, savedAt: nowText() });
  }
  saveProgress(progress);
  return progress.savedPhrases;
}

export function removeSavedPhrase(id: string) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  progress.savedPhrases = (progress.savedPhrases || []).filter(
    (phrase) => phrase.id !== id,
  );
  saveProgress(progress);
  return progress.savedPhrases;
}

export function clearSavedPhrases() {
  const progress = getCurrentProgress();
  if (!progress) return null;
  progress.savedPhrases = [];
  saveProgress(progress);
  return progress.savedPhrases;
}

export function saveTestSession(session: Omit<TestSession, "updatedAt">) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  progress.testSessions = progress.testSessions || {};
  progress.testSessions[session.key] = { ...session, updatedAt: nowText() };
  saveProgress(progress);
  return progress.testSessions[session.key];
}

export function getTestSession(key: string) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  return progress.testSessions?.[key] ?? null;
}

export function clearTestSession(key: string) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  if (progress.testSessions?.[key]) {
    delete progress.testSessions[key];
    saveProgress(progress);
  }
  return progress.testSessions ?? {};
}

export function getLatestTestSession() {
  const progress = getCurrentProgress();
  if (!progress?.testSessions) return null;
  const sessions = Object.values(progress.testSessions)
    .filter((session) => session.index < session.itemIds.length)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return sessions[0] ?? null;
}

export function getTestSessionHref(session: TestSession) {
  if (session.key.startsWith("review:")) return "/review";
  if (session.section === "basic") return `/tests/${session.verbId}/basic`;
  if (session.section === "idioms") return `/tests/${session.verbId}/basic`;
  if (session.section === "phrasal") return `/tests/${session.verbId}/phrasal`;
  return `/tests/${session.verbId}`;
}

export function getTestSectionLabel(section: string) {
  if (section === "basic" || section === "idioms") return "基本テスト";
  if (section === "phrasal") return "句動詞テスト";
  if (section === "all") return "総合テスト";
  return "テスト";
}

export function getUnlockedVerbCount() {
  const progress = getCurrentProgress();
  return progress?.unlockedVerbCount || 0;
}

export function getEffectiveUnlockedVerbCount() {
  const username = getCurrentUsername();
  const account = getAccounts().find((item) => item.username === username);
  if (account?.role === "admin") return TOTAL_VERB_TARGET;
  const progress = getCurrentProgress();
  const purchasedUnlock = progress?.unlockedVerbCount || 0;
  if (purchasedUnlock >= PREMIUM_FULL_ACCESS_COUNT) return TOTAL_VERB_TARGET;
  return Math.max(FREE_VERB_LIMIT, Math.min(PREMIUM_FULL_ACCESS_COUNT, purchasedUnlock || FREE_VERB_LIMIT));
}

export function hasPremiumFeatureAccess() {
  const username = getCurrentUsername();
  if (!username) return false;
  const account = getAccounts().find((item) => item.username === username);
  if (account?.role === "admin") return true;
  const progress = getCurrentProgress();
  return (progress?.purchaseTotalYen || 0) >= VERB_PACK_PRICE_YEN || (progress?.unlockedVerbCount || 0) > FREE_VERB_LIMIT;
}

export function hasLyricsEnglishAccess() {
  const username = getCurrentUsername();
  if (!username) return false;
  const account = getAccounts().find((item) => item.username === username);
  if (account?.role === "admin") return true;
  const progress = getCurrentProgress();
  return (progress?.unlockedVerbCount || 0) >= PREMIUM_FULL_ACCESS_COUNT;
}

export function getPurchasePlanSummary() {
  const progress = getCurrentProgress();
  const unlocked = getEffectiveUnlockedVerbCount();
  const rawUnlocked = progress?.unlockedVerbCount || 0;
  const purchaseTotal = progress?.purchaseTotalYen || 0;
  const paidPacks = Math.max(0, Math.ceil(Math.max(0, rawUnlocked - FREE_VERB_LIMIT) / VERB_PACK_SIZE));
  return {
    totalTarget: TOTAL_VERB_TARGET,
    freeLimit: FREE_VERB_LIMIT,
    unlocked,
    rawUnlocked,
    purchaseTotal,
    paidPacks,
    hasPremium: hasPremiumFeatureAccess(),
    hasLyricsEnglish: hasLyricsEnglishAccess(),
  };
}

export function canAccessVerbByIndex(index: number) {
  return index < getEffectiveUnlockedVerbCount();
}

function planLabelForCount(count: number) {
  if (count >= PREMIUM_FULL_ACCESS_COUNT) return "Step 4：120動詞パック";
  if (count >= 90) return "Step 3：90動詞パック";
  if (count >= 60) return "Step 2：60動詞パック";
  if (count >= 30) return "Step 1：30動詞パック";
  if (count >= FREE_VERB_LIMIT) return "無料3動詞プラン";
  return "無料プラン";
}

function createPurchaseRecord(
  username: string,
  unlockedVerbCount: number,
  purchaseTotalYen: number,
  source: PurchaseRecord["source"],
  note?: string,
): PurchaseRecord {
  const createdAt = nowText();
  return {
    id: `${username}-${createdAt}-${unlockedVerbCount}`,
    username,
    unlockedVerbCount,
    purchaseTotalYen,
    planLabel: planLabelForCount(unlockedVerbCount),
    source,
    createdAt,
    note,
  };
}

export function setUserUnlockLevel(
  username: string,
  unlockedVerbCount: number,
  source: PurchaseRecord["source"] = "admin_test",
  note?: string,
) {
  const progress = ensureProgress(username);
  const previousUnlocked = progress.unlockedVerbCount || 0;
  const normalized = Math.max(0, Math.min(PREMIUM_FULL_ACCESS_COUNT, Math.floor(unlockedVerbCount)));
  const purchaseTotal = purchaseTotalForUnlockCount(normalized);
  progress.unlockedVerbCount = normalized;
  progress.purchaseTotalYen = purchaseTotal;
  progress.premiumUpdatedAt = nowText();
  progress.premiumSource = source;
  progress.purchaseHistory = progress.purchaseHistory || [];
  if (normalized !== previousUnlocked || source === "restore") {
    progress.purchaseHistory.unshift(
      createPurchaseRecord(username, normalized, purchaseTotal, source, note || "Premium状態を更新しました。"),
    );
    progress.purchaseHistory = progress.purchaseHistory.slice(0, 20);
  }
  saveProgress(progress);
  return progress;
}

export function grantThirtyVerbPack(username?: string) {
  const target = username || getCurrentUsername();
  if (!target) return null;
  const progress = ensureProgress(target);
  const current = progress.unlockedVerbCount || 0;
  const next = getNextUnlockStep(current);
  return setUserUnlockLevel(target, next, "admin_test", `開発確認用：${next}動詞まで段階解放しました。`);
}

export function getPurchaseHistory(username?: string) {
  const target = username || getCurrentUsername();
  if (!target) return [] as PurchaseRecord[];
  const progress = ensureProgress(target);
  return [...(progress.purchaseHistory || [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function restorePremiumEntitlement(
  username: string,
  unlockedVerbCount: number,
  purchaseTotalYen?: number,
  note = "購入状態を復元しました。",
) {
  const normalized = Math.max(0, Math.min(PREMIUM_FULL_ACCESS_COUNT, Math.floor(unlockedVerbCount)));
  const progress = setUserUnlockLevel(username, normalized, "restore", note);
  if (typeof purchaseTotalYen === "number") {
    progress.purchaseTotalYen = Math.max(progress.purchaseTotalYen || 0, purchaseTotalYen);
    saveProgress(progress);
  }
  return progress;
}

export function getPremiumSafetySummary() {
  const progress = getCurrentProgress();
  const summary = getPurchasePlanSummary();
  return {
    source: progress?.premiumSource || "checkout_ready",
    updatedAt: progress?.premiumUpdatedAt || progress?.lastLoginAt || "",
    localUnlocked: progress?.unlockedVerbCount || 0,
    effectiveUnlocked: summary.unlocked,
    purchaseTotal: summary.purchaseTotal,
    historyCount: progress?.purchaseHistory?.length || 0,
    isConsistent: summary.unlocked >= FREE_VERB_LIMIT && summary.unlocked <= TOTAL_VERB_TARGET,
  };
}

export function getVoiceSettings(): VoiceSettings {
  const progress = getCurrentProgress();
  return progress?.voiceSettings || { gender: "female", lang: "en-US" };
}

export function saveVoiceSettings(settings: VoiceSettings) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  progress.voiceSettings = settings;
  saveProgress(progress);
  return progress.voiceSettings;
}

export function hasGrammarAccess() {
  return hasPremiumFeatureAccess();
}

