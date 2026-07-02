@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: dark; }
body { margin: 0; background: #07111f; color: #e5eef7; }
a { color: inherit; text-decoration: none; }
.card { @apply rounded-2xl shadow-sm; background:#0f1b2d; border:1px solid rgba(148,163,184,.18); color:#e5eef7; }
.btn { @apply rounded-xl px-4 py-3 font-semibold transition; min-height:48px; }
.btn-primary { background:#22d3ee; color:#06111f; }
.btn-primary:hover { opacity:.9; }
.btn-soft { background:#111f33; border:1px solid rgba(148,163,184,.25); color:#e5eef7; }
.text-muted { color:#94a3b8; }
.text-ink { color:#f8fafc; }
.bg-paper { background:#16243a; }
.text-accent { color:#67e8f9; }
.verb-red { color: #f87171; }
.example-verb { color: #f87171; font-weight: 800; }
.object-chip { background:#0e7490; color:#ecfeff; padding:2px 7px; border-radius:8px; font-weight:700; }
.ja-focus { color: #f87171; font-weight: 900; }
.type-card { background: #0b1525; border: 1px solid rgba(103,232,249,.22); border-radius: 18px; padding: 14px 16px; }
.type-card-green { background: rgba(20,83,45,.32); border-color: rgba(74,222,128,.35); }
.type-card-blue { background: rgba(30,64,175,.32); border-color: rgba(96,165,250,.35); }
.point-card { background: rgba(234,179,8,.16); border: 1px solid rgba(250,204,21,.42); border-radius: 18px; padding: 14px 16px; }
.section-label { border-radius: 999px; display: inline-flex; font-weight: 900; padding: 8px 14px; }
.section-label-collocation { background: rgba(34,197,94,.18); color: #86efac; border:1px solid rgba(34,197,94,.35); }
.section-label-phrasal { background: rgba(59,130,246,.18); color: #93c5fd; border:1px solid rgba(59,130,246,.35); }
.collocation-text { color: #86efac; font-weight: 900; }
.phrasal-text { color: #93c5fd; font-weight: 900; }
.digital-card { background: radial-gradient(circle at top left, #164e63 0%, #0f172a 45%, #020617 100%); border: 1px solid rgba(103,232,249,.24); border-radius: 22px; box-shadow: 0 16px 40px rgba(0,0,0,.35); color: white; }
.digital-panel { border: 1px solid rgba(103,232,249,.18); border-radius: 16px; background: rgba(2,6,23,.55); padding: 12px 8px; min-height: 92px; display: flex; flex-direction: column; justify-content: center; }
.digital-label { color: #a5f3fc; font-size: 10px; font-weight: 800; letter-spacing: .14em; }
.digital-number { color: #f8fafc; font-size: 28px; line-height: 1.1; font-weight: 900; font-variant-numeric: tabular-nums; letter-spacing: .02em; }
.digital-year { color:#f8fafc; font-size: 20px; line-height: 1; font-weight: 900; font-variant-numeric: tabular-nums; letter-spacing:.02em; }
.digital-date { color:#f8fafc; font-size: 24px; line-height: 1.05; font-weight: 900; font-variant-numeric: tabular-nums; letter-spacing:.02em; }
.daily-goal-main { color:#f8fafc; font-size: 24px; line-height:1.15; font-weight: 900; white-space: nowrap; }
.target-date-line { color:#f8fafc; font-size: 28px; line-height: 1.1; font-weight: 900; font-variant-numeric: tabular-nums; letter-spacing:.01em; white-space: nowrap; }
.digital-panel-wide { min-height: 76px; }

input, select, textarea { color:#f8fafc; background:#0b1525; border-color:rgba(148,163,184,.3); }
@media (max-width: 640px) { .card { border-radius: 18px; } .btn { min-height: 50px; } }
@media (max-width: 640px) { .digital-card { padding: 18px !important; } .digital-panel { padding: 10px 6px; min-height: 86px; } .digital-panel-wide { min-height: 70px; } .digital-number { font-size: 25px; } .digital-year { font-size: 16px; } .digital-date { font-size: 20px; } .target-date-line { font-size: 22px; } .daily-goal-main { font-size: 20px; } }
@media (max-width: 380px) { .digital-number { font-size: 22px; } .digital-label { font-size: 9px; letter-spacing:.08em; } .digital-year { font-size: 15px; } .digital-date { font-size: 18px; } .target-date-line { font-size: 20px; } .daily-goal-main { font-size: 18px; } }

.bookmark-button,
.bookmark-mini {
  border: 1px solid rgba(103,232,249,.28);
  background: rgba(2,6,23,.72);
  color: #cffafe;
  font-weight: 800;
  border-radius: 999px;
  box-shadow: 0 8px 20px rgba(0,0,0,.2);
}
.bookmark-button { padding: 10px 14px; min-height: 44px; }
.bookmark-mini { padding: 7px 11px; font-size: 13px; white-space: nowrap; }
.resume-card {
  border-radius: 22px;
  border: 1px solid rgba(103,232,249,.24);
  background: linear-gradient(135deg, rgba(14,116,144,.28), rgba(15,23,42,.95));
  color: #f8fafc;
  box-shadow: 0 14px 34px rgba(0,0,0,.24);
}
.scroll-jump-button {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid rgba(103,232,249,.24);
  background: rgba(2,6,23,.82);
  color: #cffafe;
  font-size: 20px;
  font-weight: 900;
  box-shadow: 0 10px 28px rgba(0,0,0,.28);
}

/* Ver.74 scroll buttons: keep jump buttons above the large fixed bottom nav */
.scroll-buttons-fixed {
  bottom: calc(138px + env(safe-area-inset-bottom));
}
.scroll-jump-button {
  position: relative;
  z-index: 61;
  touch-action: manipulation;
}
@media (max-width: 430px) {
  .scroll-buttons-fixed {
    bottom: calc(150px + env(safe-area-inset-bottom));
    right: 14px;
  }
  .scroll-jump-button {
    width: 48px;
    height: 48px;
    font-size: 22px;
  }
}
@media (max-width: 360px) {
  .scroll-buttons-fixed {
    bottom: calc(142px + env(safe-area-inset-bottom));
    right: 10px;
  }
}

.date-input-safe {
  -webkit-appearance: none;
  appearance: none;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  font-size: 16px;
}
.date-input-safe::-webkit-date-and-time-value {
  text-align: center;
  min-width: 0;
}
.date-input-safe::-webkit-calendar-picker-indicator {
  margin-left: 0;
}
@media (max-width: 420px) {
  .date-input-safe { font-size: 15px; padding-left: 8px; padding-right: 8px; }
}

/* Ver.64 mobile bottom navigation fixes */
.bottom-nav {
  padding-bottom: max(env(safe-area-inset-bottom), 10px);
}
.bottom-nav-scroll {
  width: 100%;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  scroll-snap-type: x proximity;
}
.bottom-nav-scroll::-webkit-scrollbar { display: none; }
.bottom-nav-inner {
  width: max-content;
}
.bottom-nav-link {
  min-width: 92px;
  min-height: 60px;
  scroll-snap-align: center;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 18px;
  border: 1px solid rgba(148,163,184,.18);
  background: rgba(15,23,42,.82);
  color: #cbd5e1;
  padding: 8px 12px;
  font-size: 15px;
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: -0.01em;
  white-space: nowrap;
  transition: transform .15s ease, background .15s ease, border-color .15s ease, color .15s ease;
}
.bottom-nav-link:active { transform: scale(.98); }
.bottom-nav-link-active {
  border-color: rgba(103,232,249,.72);
  background: linear-gradient(135deg, rgba(34,211,238,.28), rgba(15,23,42,.94));
  color: #ecfeff;
  box-shadow: inset 0 0 0 1px rgba(103,232,249,.18), 0 10px 22px rgba(8,145,178,.14);
}
.bottom-nav-icon {
  display: block;
  font-size: 18px;
  line-height: 1;
}
.bottom-nav-text { display: block; }
.mobile-card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.cloud-status-chip {
  border-radius: 999px;
  border: 1px solid rgba(103,232,249,.22);
  background: rgba(2,6,23,.56);
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 900;
  color: #cffafe;
}
.pace-explain-card {
  border: 1px solid rgba(103,232,249,.16);
  background: rgba(2,6,23,.55);
  border-radius: 16px;
  padding: 14px;
}
@media (max-width: 430px) {
  body { font-size: 15px; }
  main { padding-left: 16px !important; padding-right: 16px !important; padding-bottom: calc(126px + env(safe-area-inset-bottom)) !important; }
  .bottom-nav-link { min-width: 90px; min-height: 62px; font-size: 15px; padding: 8px 12px; }
  .bottom-nav-icon { font-size: 18px; }
  .digital-card { border-radius: 19px; }
  .digital-panel { border-radius: 14px; min-height: 76px; }
  .mobile-card-grid { gap: 10px; }
  .profile-hero { align-items: flex-start; gap: 12px; }
  .profile-avatar { height: 64px !important; width: 64px !important; border-radius: 20px !important; }
  .profile-name { font-size: 20px !important; }
  .profile-login { font-size: 12px !important; word-break: break-all; }
  .profile-mini-stats { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
  .profile-mini-stats .digital-panel { min-height: 64px; padding: 8px 4px; }
  .btn { min-height: 46px; padding-top: 11px; padding-bottom: 11px; }
}
@media (max-width: 360px) {
  main { padding-left: 12px !important; padding-right: 12px !important; }
  .bottom-nav-link { min-width: 86px; font-size: 14px; }
  .mobile-card-grid { grid-template-columns: 1fr; }
}


/* Ver.94 profile balance: flatter profile header with fewer nested heavy cards */
.profile-summary-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.profile-summary-chip {
  border-radius: 999px;
  border: 1px solid rgba(103,232,249,.18);
  background: rgba(2,6,23,.45);
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 800;
  color: #cbd5e1;
}
.profile-summary-chip strong { color: #f8fafc; margin-left: 4px; }
.profile-plan-line {
  margin-top: 12px;
  border-radius: 16px;
  border: 1px solid rgba(103,232,249,.14);
  background: rgba(2,6,23,.42);
  padding: 11px 12px;
}
@media (max-width: 430px) {
  .profile-summary-row { gap: 6px; }
  .profile-summary-chip { font-size: 11px; padding: 6px 8px; }
  .profile-plan-line { padding: 10px 11px; }
}

/* Ver.53 smart profile/header fixes */
.home-avatar img { display: block; }
.home-profile-actions { max-width: 92px; }
@media (max-width: 430px) {
  .home-avatar { height: 52px !important; width: 52px !important; }
  .home-profile-actions button { font-size: 11px; padding-left: 9px; padding-right: 9px; }
  .profile-avatar { border-radius: 999px !important; }
  details summary::-webkit-details-marker { display: none; }
}

/* Ver.56 guide page */
.guide-home-card,
.guide-feature-card,
.guide-flow-card {
  border: 1px solid rgba(103,232,249,.18);
  background: linear-gradient(135deg, rgba(8,47,73,.62), rgba(15,23,42,.94));
  border-radius: 22px;
  box-shadow: 0 16px 36px rgba(0,0,0,.22);
}
.guide-feature-card { padding: 18px; }
.guide-flow-card { padding: 16px; }
.guide-flow-number,
.guide-step-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(103,232,249,.16);
  color: #cffafe;
  font-weight: 900;
}
.guide-flow-number { width: 34px; height: 34px; font-size: 16px; }
.guide-step-dot { width: 22px; height: 22px; flex: 0 0 22px; font-size: 12px; }
.guide-badge {
  display: inline-flex;
  border-radius: 999px;
  border: 1px solid rgba(103,232,249,.25);
  background: rgba(2,6,23,.58);
  color: #a5f3fc;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .12em;
}
.guide-link-button {
  border-radius: 999px;
  background: #67e8f9;
  color: #020617;
  padding: 9px 14px;
  font-size: 12px;
  font-weight: 900;
}
@media (max-width: 430px) {
  .guide-home-card { padding: 16px !important; }
  .guide-feature-card { padding: 16px; border-radius: 18px; }
  .guide-link-button { padding: 8px 12px; }
}

/* Ver.87 HOME cleanup: profile, level, league, badge are one compact growth card */
.home-level-card {
  border-radius: 24px;
  border: 1px solid rgba(103,232,249,.26);
  background: radial-gradient(circle at top left, rgba(34,211,238,.22), rgba(15,23,42,.96) 48%, rgba(2,6,23,.98));
  color: #f8fafc;
  box-shadow: 0 14px 32px rgba(0,0,0,.28);
}
.home-badge-pill {
  border-radius: 999px;
  border: 1px solid rgba(103,232,249,.22);
  background: rgba(2,6,23,.42);
  padding: 6px 10px;
  color: #e0f2fe;
  font-size: 14px;
  font-weight: 900;
  line-height: 1;
  transition: background .18s ease, border-color .18s ease;
}
.home-badge-pill:hover {
  background: rgba(34,211,238,.1);
  border-color: rgba(103,232,249,.4);
}
.home-level-main {
  color: #f8fafc;
  font-size: 30px;
  line-height: 1;
  font-weight: 760;
  letter-spacing: -0.035em;
  font-variant-numeric: tabular-nums;
}
.home-level-avatar img { display: block; }
@media (max-width: 430px) {
  .home-level-card { border-radius: 20px; padding: 14px !important; }
  .home-level-avatar { height: 104px !important; width: 104px !important; border-radius: 24px !important; }
  .home-level-main { font-size: 29px; font-weight: 760; }
  .home-badge-pill { padding: 5px 9px; font-size: 13px; }
}
@media (max-width: 360px) {
  .home-level-avatar { height: 92px !important; width: 92px !important; border-radius: 22px !important; }
  .home-level-main { font-size: 27px; }
}


/* Ver.93: slim down HOME level size while keeping avatar prominent */
/* Ver.88: badge detail bottom sheet and more visible HOME profile status */
.badge-bottom-sheet {
  max-height: min(70vh, 560px);
  overflow-y: auto;
}


/* Ver.102: tighten My Page profile card and bottom navigation spacing */
.profile-card-compact {
  padding: 18px !important;
}
.profile-card-compact .profile-hero {
  align-items: flex-start;
  gap: 18px;
}
.profile-card-compact .profile-avatar,
.profile-avatar-large {
  height: 100px !important;
  width: 100px !important;
  border-radius: 26px !important;
  box-shadow: 0 14px 34px rgba(0,0,0,.28);
}
.profile-card-compact .profile-name {
  font-size: 28px !important;
  line-height: 1.08 !important;
  letter-spacing: -0.02em;
}
.profile-card-compact .profile-login {
  font-size: 14px !important;
  font-weight: 750;
}
.profile-card-compact .profile-summary-row {
  margin-top: 12px;
  gap: 8px;
}
.profile-card-compact .profile-summary-chip {
  padding: 7px 12px;
  font-size: 13px;
}
.profile-card-compact .profile-plan-line {
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: 16px;
}
.profile-card-compact .profile-last-login {
  margin-top: 12px;
  font-size: 13px;
}
.bottom-nav-inner { padding-top: 8px !important; padding-bottom: 8px !important; }
.bottom-nav-link {
  min-height: 58px;
  padding-top: 7px;
  padding-bottom: 7px;
}
@media (max-width: 430px) {
  main { padding-bottom: calc(112px + env(safe-area-inset-bottom)) !important; }
  .profile-card-compact { padding: 16px !important; }
  .profile-card-compact .profile-hero { gap: 14px; }
  .profile-card-compact .profile-avatar,
  .profile-avatar-large { height: 90px !important; width: 90px !important; border-radius: 24px !important; }
  .profile-card-compact .profile-name { font-size: 24px !important; }
  .profile-card-compact .profile-login { font-size: 13px !important; }
  .profile-card-compact .profile-summary-row { margin-top: 10px; gap: 7px; }
  .profile-card-compact .profile-summary-chip { font-size: 12px; padding: 6px 10px; }
  .profile-card-compact .profile-plan-line { margin-top: 10px; padding: 10px 12px; }
  .bottom-nav-scroll { padding-left: 8px !important; padding-right: 8px !important; }
  .bottom-nav-inner { gap: 8px; padding-top: 7px !important; padding-bottom: 7px !important; }
  .bottom-nav-link { min-height: 56px; padding: 6px 11px; }
}
@media (max-width: 360px) {
  .profile-card-compact .profile-hero { gap: 12px; }
  .profile-card-compact .profile-avatar,
  .profile-avatar-large { height: 78px !important; width: 78px !important; border-radius: 21px !important; }
  .profile-card-compact .profile-name { font-size: 21px !important; }
  .profile-card-compact .profile-summary-chip { font-size: 11px; padding: 5px 8px; }
}

/* Ver.112 HOME / bottom nav balance fixes */
.home-title-icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  border: 1px solid rgba(103,232,249,.28);
  background: radial-gradient(circle at top left, rgba(34,211,238,.20), rgba(15,23,42,.96));
  color: #e0f2fe;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 950;
  letter-spacing: -0.08em;
  box-shadow: 0 12px 28px rgba(0,0,0,.26);
  overflow: hidden;
}
.bottom-nav {
  padding-bottom: max(env(safe-area-inset-bottom), 5px) !important;
}
.bottom-nav-inner {
  padding-top: 5px !important;
  padding-bottom: 5px !important;
  gap: 7px !important;
}
.bottom-nav-link {
  min-height: 52px !important;
  min-width: 88px;
  padding: 5px 11px 4px !important;
  gap: 2px !important;
  border-radius: 17px;
}
.bottom-nav-icon {
  font-size: 20px !important;
  line-height: 1 !important;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,.32));
}
.bottom-nav-text {
  font-size: 14px;
  line-height: 1.05;
}
.bottom-nav-link-active .bottom-nav-icon { transform: translateY(-1px); }
@media (max-width: 430px) {
  main { padding-bottom: calc(98px + env(safe-area-inset-bottom)) !important; }
  .bottom-nav-scroll { padding-left: 6px !important; padding-right: 6px !important; }
  .bottom-nav-link { min-height: 52px !important; min-width: 86px; padding-top: 5px !important; padding-bottom: 4px !important; }
  .bottom-nav-icon { font-size: 20px !important; }
}
@media (max-width: 360px) {
  .bottom-nav-link { min-width: 80px; font-size: 13px; }
  .bottom-nav-icon { font-size: 18px !important; }
}

/* Ver.112 verb detail compact header and stronger core-image diagram */
.verb-hero-compact {
  padding: 16px !important;
}
.verb-title-compact {
  font-size: 42px;
  line-height: .95;
  font-weight: 900;
  letter-spacing: -0.04em;
}
.verb-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.verb-meta-chip {
  border: 1px solid rgba(103,232,249,.16);
  background: rgba(2,6,23,.45);
  color: #cbd5e1;
  border-radius: 999px;
  padding: 5px 9px;
  font-size: 12px;
  font-weight: 800;
}
.core-diagram-card {
  border-radius: 24px;
  border: 1px solid rgba(103,232,249,.22);
  background: radial-gradient(circle at top left, rgba(14,116,144,.25), rgba(2,6,23,.62));
  padding: 14px;
}
.core-icon-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.06);
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 800;
  color: #f8fafc;
}
.core-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #a5f3fc;
  font-size: 30px;
  font-weight: 950;
  min-width: 42px;
}
.core-target-box {
  border-radius: 18px;
  border: 1px solid rgba(103,232,249,.32);
  background: rgba(34,211,238,.12);
  padding: 12px 14px;
  text-align: center;
  font-weight: 900;
  color: #ecfeff;
}
@media (max-width: 430px) {
  .verb-hero-compact { padding: 14px !important; }
  .verb-title-compact { font-size: 38px; }
  .verb-meta-chip { font-size: 11px; padding: 5px 8px; }
  .core-arrow { transform: rotate(90deg); margin: 2px auto; }
}


/* Ver.115 hotfix: bottom nav safe-area balance and profile/goal usability */
.bottom-nav {
  padding-top: 0 !important;
  padding-bottom: env(safe-area-inset-bottom) !important;
  background: rgba(2, 6, 23, 0.96) !important;
}
.bottom-nav-scroll {
  padding-left: 8px !important;
  padding-right: 8px !important;
}
.bottom-nav-inner {
  align-items: center !important;
  gap: 7px !important;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}
.bottom-nav-link {
  min-height: 52px !important;
  min-width: 86px !important;
  border-radius: 16px !important;
  padding: 6px 10px !important;
  gap: 3px !important;
}
.bottom-nav-icon {
  font-size: 20px !important;
  line-height: 1 !important;
  filter: drop-shadow(0 1px 4px rgba(103,232,249,.24));
}
.bottom-nav-text {
  font-size: 12px !important;
  line-height: 1.05 !important;
}
.bottom-nav-link-active .bottom-nav-icon,
.bottom-nav-link-active .bottom-nav-text {
  color: #ecfeff !important;
}
@media (max-width: 430px) {
  main { padding-bottom: calc(84px + env(safe-area-inset-bottom)) !important; }
  .bottom-nav-inner { padding-top: 5px !important; padding-bottom: 5px !important; }
  .bottom-nav-link { min-height: 50px !important; min-width: 78px !important; padding: 5px 8px !important; }
  .bottom-nav-icon { font-size: 20px !important; }
  .bottom-nav-text { font-size: 11px !important; }
}
@media (max-width: 360px) {
  .bottom-nav-scroll { padding-left: 6px !important; padding-right: 6px !important; }
  .bottom-nav-inner { gap: 5px !important; }
  .bottom-nav-link { min-width: 70px !important; }
}
