type UserScore = {
  score: number;
  userRating: number;
};

export async function getUserScore(): Promise<UserScore> {
  const response = await fetch("/api/statistics/score");

  if (!response.ok) {
    return { score: 0, userRating: 0 };
  }

  return response.json();
}
