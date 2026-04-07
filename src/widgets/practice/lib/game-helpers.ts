export function calculateEarnedPoints(score: number, total: number, maxPoints: number): number {
  if (total <= 0) return 0;

  return Math.round((score / total) * maxPoints);
}

export function getNextDifficultyHref(pathname: string): string | null {
  if (pathname.endsWith("/easy")) return pathname.replace(/\/easy$/, "/medium");
  if (pathname.endsWith("/medium")) return pathname.replace(/\/medium$/, "/hard");

  return null;
}

export function getProgressPercent(currentQuestionIndex: number, total: number): number {
  if (total <= 0) return 0;

  return Math.round(((currentQuestionIndex + 1) / total) * 100);
}

export function normalizeCode(value: string): string {
  return value.replace(/\s+/g, " ").replace(/;\s*/g, ";").trim();
}
