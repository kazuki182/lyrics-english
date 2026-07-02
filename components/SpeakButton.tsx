"use client";

import { useEffect, useState } from "react";
import { getVoiceSettings, hasPremiumFeatureAccess, type VoiceGender } from "@/lib/account";

function scoreVoiceName(name: string, gender: VoiceGender) {
  const lower = name.toLowerCase();
  const femaleNames = ["samantha", "victoria", "karen", "susan", "zira", "jenny", "aria", "sonia", "ava", "emma", "female"];
  const maleNames = ["daniel", "alex", "fred", "david", "mark", "guy", "george", "ryan", "male"];
  const preferred = gender === "female" ? femaleNames : maleNames;
  return preferred.some((keyword) => lower.includes(keyword)) ? 2 : 0;
}

function pickVoice(voices: SpeechSynthesisVoice[], gender: VoiceGender, lang: string) {
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith(lang.toLowerCase().slice(0, 2)));
  const candidates = englishVoices.length ? englishVoices : voices;
  return [...candidates].sort((a, b) => {
    const scoreA = scoreVoiceName(a.name, gender) + (a.lang === lang ? 1 : 0);
    const scoreB = scoreVoiceName(b.name, gender) + (b.lang === lang ? 1 : 0);
    return scoreB - scoreA;
  })[0];
}

export default function SpeakButton({
  text,
  label = "通常",
  slowLabel = "ゆっくり",
  rate = 0.95,
  slowRate = 0.5,
  lang
}: {
  text: string;
  label?: string;
  slowLabel?: string;
  rate?: number;
  slowRate?: number;
  lang?: string;
}) {
  const [premiumReady, setPremiumReady] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);

  useEffect(() => {
    setHasPremium(hasPremiumFeatureAccess());
    setPremiumReady(true);
  }, []);

  const speak = (speechRate: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const settings = getVoiceSettings();
    const selectedLang = lang || settings.lang || "en-US";
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    utterance.rate = speechRate;
    const voices = window.speechSynthesis.getVoices();
    const voice = pickVoice(voices, settings.gender, selectedLang);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const openUpgrade = () => {
    if (typeof window !== "undefined") window.location.href = "/upgrade";
  };

  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => speak(rate)}
        className="inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-slate-950/70 px-3 py-1.5 text-sm font-bold text-cyan-100 shadow-sm"
      >
        🔊 {label}
      </button>
      {premiumReady && hasPremium ? (
        <button
          type="button"
          onClick={() => speak(slowRate)}
          className="inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-slate-950/70 px-3 py-1.5 text-sm font-bold text-cyan-100 shadow-sm"
        >
          🐢 {slowLabel}
        </button>
      ) : (
        <button
          type="button"
          onClick={openUpgrade}
          className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-sm font-bold text-amber-100 shadow-sm"
          title="Premiumで0.5倍速音声が使えます"
        >
          🔒 {slowLabel}
        </button>
      )}
    </div>
  );
}
