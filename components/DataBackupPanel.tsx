"use client";

import { ChangeEvent, useRef, useState } from "react";

const BACKUP_PREFIX = "verbMaster.";

type BackupPayload = {
  app: "Verb Master";
  version: "V62";
  exportedAt: string;
  keys: Record<string, string>;
};

function collectVerbMasterStorage() {
  const keys: Record<string, string> = {};
  if (typeof window === "undefined") return keys;
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(BACKUP_PREFIX)) continue;
    const value = localStorage.getItem(key);
    if (value != null) keys[key] = value;
  }
  return keys;
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function DataBackupPanel() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");

  const onExport = () => {
    const payload: BackupPayload = {
      app: "Verb Master",
      version: "V62",
      exportedAt: new Date().toISOString(),
      keys: collectVerbMasterStorage(),
    };
    const date = new Date().toISOString().slice(0, 10);
    downloadText(`verb-master-backup-${date}.json`, JSON.stringify(payload, null, 2));
    setMessage("バックアップを書き出しました。GitHub更新前に保存しておくと安心です。");
  };

  const onImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text) as BackupPayload;
      if (payload.app !== "Verb Master" || !payload.keys || typeof payload.keys !== "object") {
        setMessage("Verb Masterのバックアップファイルではありません。");
        return;
      }
      Object.entries(payload.keys).forEach(([key, value]) => {
        if (key.startsWith(BACKUP_PREFIX) && typeof value === "string") {
          localStorage.setItem(key, value);
        }
      });
      setMessage("バックアップを復元しました。画面を再読み込みします。");
      window.setTimeout(() => window.location.reload(), 700);
    } catch {
      setMessage("復元に失敗しました。JSONファイルを確認してください。");
    }
  };

  return (
    <div className="rounded-2xl bg-paper p-4">
      <p className="font-bold">バックアップ / 復元</p>
      <p className="mt-1 text-sm leading-6 text-muted">
        更新前に学習データを書き出せます。VercelのURLが変わった時、Safariのプライベート閲覧、端末変更でも復元しやすくします。
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button className="btn btn-soft w-full" type="button" onClick={onExport}>
          学習データを書き出す
        </button>
        <button className="btn btn-soft w-full" type="button" onClick={() => fileRef.current?.click()}>
          バックアップを復元
        </button>
      </div>
      <input ref={fileRef} className="hidden" type="file" accept="application/json,.json" onChange={onImport} />
      {message && <p className="mt-2 text-xs leading-5 text-cyan-100">{message}</p>}
      <p className="mt-2 text-xs leading-5 text-amber-100/90">
        注意：プライベート閲覧では端末保存が消えやすいです。ログイン中はクラウド自動保存を優先しますが、更新前の手動バックアップも残せます。
      </p>
    </div>
  );
}
