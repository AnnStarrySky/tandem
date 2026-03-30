import type { PracticeData, PracticeDifficulty } from "../model";

const practiceDataCache = new Map<string, PracticeData>();

export async function getPracticeData(
  locale: string,
  difficulty: PracticeDifficulty,
): Promise<PracticeData> {
  const normalizedLocale = locale === "ru" ? "ru" : "en";
  const cacheKey = `${difficulty}-${normalizedLocale}`;

  const cached = practiceDataCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const response = await fetch(`/data/data.${difficulty}.${normalizedLocale}.json`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load practice data for locale: ${normalizedLocale}, difficulty: ${difficulty}`,
    );
  }

  const data = (await response.json()) as PracticeData;
  practiceDataCache.set(cacheKey, data);

  return data;
}
