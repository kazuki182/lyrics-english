"use client";

import { useEffect, useState } from "react";
import { getVoiceSettings, saveVoiceSettings, type VoiceGender, type VoiceSettings } from "@/lib/account";
import SpeakButton from "./SpeakButton";

export default function VoiceSettingsPanel() {
  const [settings, setSettings] = useState<VoiceSettings>({ gender: "female", lang: "en-US" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getVoiceSettings());
  }, []);

  const updateGender = (gender: VoiceGender) => {
    setSettings((current) => ({ ...current, gender }));
    setSaved(false);
  };

  const updateLang = (lang: VoiceSettings["lang"]) => {
    setSettings((current) => ({ ...current, lang }));
    setSaved(false);
  };

  const save = () => {
    saveVoiceSettings(settings);
    setSaved(true);
  };

  return (
    <section className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-muted">音声設定</p>
          <h2 className="mt-1 text-xl font-bold">読み上げ音声を統一</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            選んだ声を、動詞・例文・テスト・フレーズ帳の読み上げに使います。
          </p>
        </div>
        {saved && <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-100">保存済み</span>}
      </div>

      <div className="mt-5 grid gap-3">
        <div>
          <p className="mb-2 text-sm font-bold text-slate-200">声のタイプ</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateGender("female")}
              className={`rounded-2xl border px-4 py-3 text-sm font-bold ${settings.gender === "female" ? "border-cyan-300 bg-cyan-400/15 text-cyan-100" : "border-slate-700 bg-slate-950/50 text-slate-200"}`}
            >
              👩 女性
            </button>
            <button
              type="button"
              onClick={() => updateGender("male")}
              className={`rounded-2xl border px-4 py-3 text-sm font-bold ${settings.gender === "male" ? "border-cyan-300 bg-cyan-400/15 text-cyan-100" : "border-slate-700 bg-slate-950/50 text-slate-200"}`}
            >
              👨 男性
            </button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-slate-200">英語の種類</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateLang("en-US")}
              className={`rounded-2xl border px-4 py-3 text-sm font-bold ${settings.lang === "en-US" ? "border-cyan-300 bg-cyan-400/15 text-cyan-100" : "border-slate-700 bg-slate-950/50 text-slate-200"}`}
            >
              🇺🇸 US
            </button>
            <button
              type="button"
              onClick={() => updateLang("en-GB")}
              className={`rounded-2xl border px-4 py-3 text-sm font-bold ${settings.lang === "en-GB" ? "border-cyan-300 bg-cyan-400/15 text-cyan-100" : "border-slate-700 bg-slate-950/50 text-slate-200"}`}
            >
              🇬🇧 UK
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
        <div>
          <p className="text-sm font-bold text-white">音声テスト</p>
          <p className="mt-1 text-sm text-muted">This is a sample sentence.</p>
        </div>
        <SpeakButton text="This is a sample sentence." label="通常" slowLabel="ゆっくり" />
      </div>

      <button type="button" onClick={save} className="btn btn-primary mt-5 w-full">
        音声設定を保存
      </button>
    </section>
  );
}
