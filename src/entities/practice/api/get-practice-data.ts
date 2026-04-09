import type { GetPracticeDataParams, PracticeData } from "./types";

const practiceDataCache = new Map<string, Promise<PracticeData>>();

function normalizeLocale(locale: string): "ru" | "en" {
  return locale === "ru" ? "ru" : "en";
}

export async function getPracticeDataApi({
  locale,
  difficulty,
}: GetPracticeDataParams): Promise<PracticeData> {
  const normalizedLocale = normalizeLocale(locale);
  const cacheKey = `${difficulty}-${normalizedLocale}`;

  const cached = practiceDataCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const request = fetch(`/data/data.${difficulty}.${normalizedLocale}.json`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(
        `Failed to load practice data for locale=${normalizedLocale} difficulty=${difficulty}`,
      );
    }

    return (await response.json()) as PracticeData;
  });

  practiceDataCache.set(cacheKey, request);

  try {
    return await request;
  } catch (error) {
    practiceDataCache.delete(cacheKey);
    throw error;
  }
}
