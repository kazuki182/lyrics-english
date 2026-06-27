
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

export type BookmarkSection = "basic" | "idioms" | "phrasal" | "test" | "review";

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
  unlockedVerbCount?: number;
  purchaseTotalYen?: number;
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
  let changed = false;
  if (!accounts.some((a) => a.username === "kazurillex")) {
    accounts.push({ username: "kazurillex", password: "0074", role: "admin", createdAt: nowText() });
    changed = true;
  }
  if (!accounts.some((a) => a.username === "shun")) {
    accounts.push({ username: "shun", password: "1234", role: "user", createdAt: nowText() });
    changed = true;
  }
  if (changed) saveAccounts(accounts);
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
  if (!progress.savedPhrases) progress.savedPhrases = [];
  if (!progress.testSessions) progress.testSessions = {};
  if (typeof progress.unlockedVerbCount !== "number") progress.unlockedVerbCount = 0;
  if (typeof progress.purchaseTotalYen !== "number") progress.purchaseTotalYen = 0;
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
      unlockedVerbCount: 0,
      purchaseTotalYen: 0
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
const TARGET_START_DATE_KEY = "verbMaster.targetStartDate";
const STUDY_DAYS_KEY = "verbMaster.studyDays";

export type StudyDaysSetting = {
  mode: "everyday" | "weekdays" | "custom";
  days: number[];
};

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function normalizeDate(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function getDefaultStudyDays(): StudyDaysSetting {
  return { mode: "everyday", days: [0, 1, 2, 3, 4, 5, 6] };
}

function normalizeStudyDays(value: StudyDaysSetting): StudyDaysSetting {
  const unique = Array.from(new Set((value.days || []).filter((day) => day >= 0 && day <= 6))).sort((a, b) => a - b);
  if (value.mode === "weekdays") return { mode: "weekdays", days: [1, 2, 3, 4, 5] };
  if (value.mode === "custom") return { mode: "custom", days: unique.length ? unique : [1, 2, 3, 4, 5] };
  return getDefaultStudyDays();
}

export function getStudyDaysSetting(): StudyDaysSetting {
  if (typeof window === "undefined") return getDefaultStudyDays();
  try {
    const saved = localStorage.getItem(STUDY_DAYS_KEY);
    if (!saved) return getDefaultStudyDays();
    return normalizeStudyDays(JSON.parse(saved));
  } catch {
    return getDefaultStudyDays();
  }
}

export function setStudyDaysSetting(value: StudyDaysSetting) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STUDY_DAYS_KEY, JSON.stringify(normalizeStudyDays(value)));
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
  const saved = localStorage.getItem(TARGET_START_DATE_KEY);
  if (saved) return saved;
  const value = isoDate(new Date());
  localStorage.setItem(TARGET_START_DATE_KEY, value);
  return value;
}

export function getTargetDate() {
  if (typeof window === "undefined") return "";
  const saved = localStorage.getItem(TARGET_DATE_KEY);
  if (saved) return saved;
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 60);
  const value = isoDate(defaultDate);
  localStorage.setItem(TARGET_DATE_KEY, value);
  localStorage.setItem(TARGET_START_DATE_KEY, isoDate(new Date()));
  return value;
}

export function setTargetDate(value: string) {
  if (typeof window === "undefined") return;
  if (value) {
    localStorage.setItem(TARGET_DATE_KEY, value);
    localStorage.setItem(TARGET_START_DATE_KEY, isoDate(new Date()));
  }
}

export function getLearningPlan(totalVerbs: number, completedVerbs: number) {
  const targetDate = getTargetDate();
  const studyDays = getStudyDaysSetting();
  const today = normalizeDate(new Date());
  const target = targetDate ? normalizeDate(new Date(`${targetDate}T00:00:00`)) : today;
  const start = normalizeDate(new Date(`${getTargetStartDate()}T00:00:00`));
  const diffMs = target.getTime() - today.getTime();
  const calendarDaysLeft = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const studyDaysLeft = Math.max(1, countStudyDays(today, target, studyDays.days));
  const remaining = Math.max(0, totalVerbs - completedVerbs);
  const dailyGoal = Math.max(remaining > 0 ? 1 : 0, Math.ceil(remaining / studyDaysLeft));
  const progressPercent = totalVerbs ? Math.round((completedVerbs / totalVerbs) * 100) : 0;
  const totalPlanStudyDays = Math.max(1, countStudyDays(start, target, studyDays.days));
  const elapsedStudyDays = Math.max(0, countStudyDays(start, today, studyDays.days) - 1);
  const expectedCompleted = Math.min(totalVerbs, Math.floor((totalVerbs * elapsedStudyDays) / totalPlanStudyDays));
  const paceDiff = completedVerbs - expectedCompleted;
  const paceStatus = paceDiff > 0 ? "ahead" : paceDiff < 0 ? "behind" : "onTrack";
  return {
    targetDate,
    daysLeft: calendarDaysLeft,
    studyDaysLeft,
    studyDayLabel: getStudyDaysLabel(studyDays),
    remaining,
    dailyGoal,
    progressPercent,
    expectedCompleted,
    paceDiff,
    paceStatus
  };
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
  if (section === "basic") return "基本動詞";
  if (section === "idioms") return "熟語";
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
  progress.savedPhrases = (progress.savedPhrases || []).filter((phrase) => phrase.id !== id);
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


export function getUnlockedVerbCount() {
  const progress = getCurrentProgress();
  return progress?.unlockedVerbCount || 0;
}

export function hasGrammarAccess() {
  const username = getCurrentUsername();
  if (!username) return false;
  const account = getAccounts().find((item) => item.username === username);
  if (account?.role === "admin") return true;
  const progress = getCurrentProgress();
  return (progress?.unlockedVerbCount || 0) >= 30 || (progress?.purchaseTotalYen || 0) >= 500;
}

export function grantThirtyVerbPack(username?: string) {
  const target = username || getCurrentUsername();
  if (!target) return null;
  const progress = ensureProgress(target);
  progress.unlockedVerbCount = Math.max(progress.unlockedVerbCount || 0, 30);
  progress.purchaseTotalYen = Math.max(progress.purchaseTotalYen || 0, 500);
  saveProgress(progress);
  return progress;
}
