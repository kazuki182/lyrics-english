const KEEP_UPPERCASE = new Set([
  "S", "V", "O", "C", "A", "B", "SV", "SVO", "SVC", "SVOC", "SVOO",
  "TOEIC", "AI", "UI", "XP", "US", "UK", "PDF", "CSV", "URL"
]);

function normalizeUpperToken(token: string) {
  if (KEEP_UPPERCASE.has(token)) return token;
  return token.toLowerCase();
}

export function naturalPatternText(value?: string) {
  if (!value) return "";
  return value
    .replace(/\b[A-Z]{2,}\b/g, (token) => normalizeUpperToken(token))
    .replace(/\b(TO|WITH|FOR|FROM|IN|ON|AT|BY|OF|OFF|OUT|UP|OVER|ABOUT|INTO|AFTER|BEFORE|THROUGH|AWAY|BACK|DOWN)\b/g, (token) => token.toLowerCase())
    .trim();
}
