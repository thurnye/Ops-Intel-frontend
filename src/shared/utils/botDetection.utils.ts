export function getClientFingerprint(): string {
  const pieces = [
    navigator.userAgent,
    navigator.language,
    String(screen.width),
    String(screen.height),
    String(new Date().getTimezoneOffset())
  ];

  return btoa(pieces.join("::"));
}

export function looksLikeBot(userAgent: string): boolean {
  const signature = userAgent.toLowerCase();
  return ["bot", "spider", "crawler", "headless"].some((x) => signature.includes(x));
}
