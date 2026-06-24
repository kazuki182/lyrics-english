
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
  lastStudyDate?: string;
  lastLoginAt?: string;
};

const ACCOUNTS_KEY = "verbMaster.accounts";
const CURRENT_USER_KEY = "verbMaster.currentUser";
const PROGRESS_KEY = "verbMaster.progress";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function nowText() {
  return new Date().toISOString();
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
    tasks: DAILY_MISSION_VERBS.map((verbId) => ({ verbId, target: DAILY_MISSION_TARGET, correct: 0 })),
    completed: false,
    rewardClaimed: false
  };
}

function normalizeMission(progress: UserProgress) {
  const today = todayKey();
  if (!progress.dailyMission || progress.dailyMission.date !== today) {
    progress.dailyMission = createDailyMission(today);
  }
  if (typeof progress.missionCompletedCount !== "number") progress.missionCompletedCount = 0;
  return progress.dailyMission;
}

export function initAdminAccount() {
  if (typeof window === "undefined") return;
  const accounts = getAccounts();
  if (!accounts.some((a) => a.username === "kazurillex")) {
    accounts.push({ username: "kazurillex", password: "0074", role: "admin", createdAt: nowText() });
    saveAccounts(accounts);
  }
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
  if (password.length < 4) return { ok: false, message: "パスワードは4文字以上にしてください。" };
  const accounts = getAccounts();
  if (accounts.some((a) => a.username === name)) return { ok: false, message: "このユーザー名はすでに使われています。" };
  accounts.push({ username: name, password, role: "user", createdAt: nowText() });
  saveAccounts(accounts);
  setCurrentUser(name);
  ensureProgress(name);
  return { ok: true, message: "登録しました。" };
}

export function loginAccount(username: string, password: string) {
  initAdminAccount();
  const accounts = getAccounts();
  const account = accounts.find((a) => a.username === username.trim() && a.password === password);
  if (!account) return { ok: false, message: "ユーザー名またはパスワードが違います。" };
  const loginAt = nowText();
  account.lastLoginAt = loginAt;
  saveAccounts(accounts);
  setCurrentUser(account.username);
  const progress = ensureProgress(account.username);
  progress.lastLoginAt = loginAt;
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
      sectionClearIds: []
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
}

function updateStreak(progress: UserProgress) {
  const today = todayKey();
  if (progress.lastStudyDate === today) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const y = yesterday.toISOString().slice(0, 10);
  progress.currentStreak = progress.lastStudyDate === y ? progress.currentStreak + 1 : 1;
  progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak);
  progress.lastStudyDate = today;
}

export function recordStudy(verbId: string, totalVerbs: number) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  updateStreak(progress);
  progress.xp += 10;
  progress.totalStudied += 1;
  if (!progress.studiedVerbIds.includes(verbId)) progress.studiedVerbIds.push(verbId);
  if (progress.studiedVerbIds.length >= totalVerbs) {
    progress.currentRound += 1;
    progress.studiedVerbIds = [];
    progress.xp += 100;
  }
  saveProgress(progress);
  return progress;
}

export function recordTestResult(verbId: string, itemId: string, correct: boolean) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  updateStreak(progress);
  progress.reviewItems = progress.reviewItems || {};
  const existing = progress.reviewItems[itemId];

  if (correct) {
    progress.testCorrect += 1;
    progress.xp += 5;
    progress.weakItems = progress.weakItems.filter((id) => id !== itemId);
    const mission = normalizeMission(progress);
    const task = mission.tasks.find((t) => t.verbId === verbId);
    if (task && task.correct < task.target) task.correct += 1;
    if (!mission.completed && mission.tasks.every((t) => t.correct >= t.target)) {
      mission.completed = true;
      mission.rewardClaimed = true;
      progress.xp += DAILY_MISSION_REWARD_XP;
      progress.missionCompletedCount = (progress.missionCompletedCount || 0) + 1;
    }
    if (existing) {
      existing.correctCount += 1;
      existing.lastResult = "correct";
      existing.lastAnsweredAt = nowText();
      existing.nextReviewAt = addDays(existing.correctCount >= 2 ? 7 : 3);
    }
  } else {
    progress.testWrong += 1;
    const wrongCount = (existing?.wrongCount || 0) + 1;
    progress.weakItems = Array.from(new Set([...progress.weakItems, itemId]));
    progress.reviewItems[itemId] = {
      itemId,
      verbId,
      wrongCount,
      correctCount: existing?.correctCount || 0,
      nextReviewAt: addDays(nextReviewDelay(wrongCount)),
      lastAnsweredAt: nowText(),
      lastResult: "wrong"
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
  const done = mission.tasks.reduce((sum, task) => sum + Math.min(task.correct, task.target), 0);
  return { mission, total, done, remaining: Math.max(0, total - done), percent: total ? Math.round((done / total) * 100) : 0 };
}

export function getMissionConfig() {
  return { target: DAILY_MISSION_TARGET, rewardXp: DAILY_MISSION_REWARD_XP, verbIds: DAILY_MISSION_VERBS };
}

export function formatDateTime(value?: string) {
  if (!value) return "未記録";
  try {
    return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export function formatDate(value?: string) {
  if (!value) return "未定";
  try {
    return new Intl.DateTimeFormat("ja-JP", { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`));
  } catch {
    return value;
  }
}

export function getAllProgress() {
  return Object.values(progressMap()).map(normalizeProgress).sort((a, b) => b.xp - a.xp);
}


const TARGET_DATE_KEY = "verbMaster.targetDate";

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getTargetDate() {
  if (typeof window === "undefined") return "";
  const saved = localStorage.getItem(TARGET_DATE_KEY);
  if (saved) return saved;
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 60);
  const value = isoDate(defaultDate);
  localStorage.setItem(TARGET_DATE_KEY, value);
  return value;
}

export function setTargetDate(value: string) {
  if (typeof window === "undefined") return;
  if (value) localStorage.setItem(TARGET_DATE_KEY, value);
}

export function getLearningPlan(totalVerbs: number, completedVerbs: number) {
  const targetDate = getTargetDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = targetDate ? new Date(`${targetDate}T00:00:00`) : today;
  const diffMs = target.getTime() - today.getTime();
  const daysLeft = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const remaining = Math.max(0, totalVerbs - completedVerbs);
  const dailyGoal = Math.max(remaining > 0 ? 1 : 0, Math.ceil(remaining / daysLeft));
  const progressPercent = totalVerbs ? Math.round((completedVerbs / totalVerbs) * 100) : 0;
  return { targetDate, daysLeft, remaining, dailyGoal, progressPercent };
}

export function recordVerbMastery(verbId: string) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  updateStreak(progress);
  if (!progress.studiedVerbIds.includes(verbId)) {
    progress.studiedVerbIds.push(verbId);
    progress.totalStudied += 1;
    progress.xp += 100;
  }
  saveProgress(progress);
  return progress;
}


export function recordSectionClear(verbId: string, section: string, xp: number) {
  const progress = getCurrentProgress();
  if (!progress) return null;
  updateStreak(progress);
  progress.sectionClearIds = progress.sectionClearIds || [];
  const key = `${verbId}:${section}`;
  if (!progress.sectionClearIds.includes(key)) {
    progress.sectionClearIds.push(key);
    progress.xp += xp;
  }
  saveProgress(progress);
  return progress;
}
