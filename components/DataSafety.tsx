"use client";

import { useEffect, useRef } from "react";
import { getCurrentProgress, getCurrentUsername, PROGRESS_SAVED_EVENT } from "@/lib/account";
import { CLOUD_SYNC_EVENT, restoreLearningDataFromSupabase, syncCurrentUserToSupabase, type CloudSyncEventDetail, type CloudSyncStatus } from "@/lib/cloudSync";

const SYNC_INTERVAL_MS = 30 * 1000;
const DEBOUNCE_MS = 1200;

function notifyCloudSync(detail: Omit<CloudSyncEventDetail, "updatedAt">) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<CloudSyncEventDetail>(CLOUD_SYNC_EVENT, {
    detail: { ...detail, updatedAt: new Date().toISOString() },
  }));
}

function statusPhase(status: CloudSyncStatus): CloudSyncEventDetail["phase"] {
  // Ver.88: 学習記録本体が保存できている場合、profiles / premium などの補助テーブル確認を
  // 強い「保存失敗」として扱わない。保存失敗は stats 本体が error の場合だけにする。
  if (status.stats === "saved") return "saved";
  if (status.stats === "error") return "error";
  if (status.profile === "saved" || status.premium === "saved") return "saved";
  return "idle";
}

export default function DataSafety() {
  const runningRef = useRef(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const run = async (reason: "start" | "interval" | "visible" | "before-hide" | "saved") => {
      if (runningRef.current) return;
      const username = getCurrentUsername();
      if (!username) return;
      runningRef.current = true;
      notifyCloudSync({ phase: "syncing", reason, message: "クラウド保存を確認中です..." });
      try {
        if (reason === "start" || reason === "visible") {
          const restored = await restoreLearningDataFromSupabase(username);
          notifyCloudSync({
            phase: restored.changed ? "restored" : statusPhase(restored.status),
            reason,
            message: restored.message,
            status: restored.status,
          });
        }
        const progress = getCurrentProgress();
        if (progress) {
          const status = await syncCurrentUserToSupabase(progress);
          notifyCloudSync({
            phase: statusPhase(status),
            reason,
            message: status.message,
            status,
          });
        }
      } catch (error) {
        notifyCloudSync({
          phase: "error",
          reason,
          message: error instanceof Error ? error.message : "クラウド同期に失敗しました。",
        });
      } finally {
        runningRef.current = false;
      }
    };

    void run("start");
    const timer = window.setInterval(() => void run("interval"), SYNC_INTERVAL_MS);

    const onVisibility = () => {
      if (document.visibilityState === "visible") void run("visible");
      if (document.visibilityState === "hidden") void run("before-hide");
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onProgressSaved = () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => void run("saved"), DEBOUNCE_MS);
    };
    window.addEventListener(PROGRESS_SAVED_EVENT, onProgressSaved);

    return () => {
      window.clearInterval(timer);
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(PROGRESS_SAVED_EVENT, onProgressSaved);
    };
  }, []);

  return null;
}
