export type CatType = "newbie" | "student" | "programmer" | "hacker" | "legend";

type Level = {
  level: number;
  cat: CatType;
  minScore: number;
};

const LEVELS: Level[] = [
  { level: 1, cat: "newbie", minScore: 0 },
  { level: 2, cat: "student", minScore: 100 },
  { level: 3, cat: "programmer", minScore: 300 },
  { level: 4, cat: "hacker", minScore: 900 },
  { level: 5, cat: "legend", minScore: 1600 },
];

export function getLevelByScore(score: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].minScore) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}
