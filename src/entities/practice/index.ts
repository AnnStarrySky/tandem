export * from "./model";
export * from "./api";
export * from "./storage";

export async function getPracticeData(
  locale: string,
  difficulty: import("./model").PracticeDifficulty,
) {
  const { getPracticeDataApi } = await import("./api");

  return getPracticeDataApi({
    locale,
    difficulty,
  });
}

export async function getPracticeTopic(
  topicId: string,
  locale: string,
  difficulty: import("./model").PracticeDifficulty,
) {
  const { getPracticeTopicApi } = await import("./api");

  return getPracticeTopicApi({
    topicId,
    locale,
    difficulty,
  });
}

export async function getPracticeTask(
  topicId: string,
  difficulty: import("./model").PracticeDifficulty,
  locale: string,
) {
  const { getPracticeTaskApi } = await import("./api");

  return getPracticeTaskApi({
    topicId,
    locale,
    difficulty,
  });
}
