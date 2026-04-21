"use client";

import React, { useEffect, useState } from "react";
import { Typography } from "antd";
import { useTranslations } from "next-intl";

import { getTaskStats, getUserScore, getLevelByScore, CatType } from "@/entities/practice";
import { useRouter } from "@i18n";
import { BaseBtn } from "@shared/ui/button";
import { LevelImage } from "@shared/ui/mainImage";
import { LessonBoard } from "@widgets/LessonsPlan";
import { ProgressBar } from "@widgets/progress";
import { ResultBar } from "@widgets/result";

const TOTAL_TASKS = 90;

export default function Dashboard() {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState<{ level: number; cat: CatType }>({ level: 1, cat: "newbie" });

  useEffect(() => {
    getTaskStats()
      .then(({ completedTasks }) => {
        setProgress(Math.round((completedTasks / TOTAL_TASKS) * 100));
      })
      .catch(() => {});

    getUserScore()
      .then(({ score }) => setLevel(getLevelByScore(score)))
      .catch(() => {});
  }, []);

  const [data, setData] = useState({
    progress: 0,
    completedTasks: 0,
    score: 0,
    rating: 0,
    level: { level: 1, cat: "newbie" as CatType },
  });

  useEffect(() => {
    Promise.all([getTaskStats(), getUserScore()])
      .then(([{ completedTasks }, { score, userRating }]) => {
        setData({
          completedTasks,
          score,
          rating: userRating,
          progress: Math.round((completedTasks / TOTAL_TASKS) * 100),
          level: getLevelByScore(score),
        });
      })
      .catch(console.error);
  }, []);

  const [data, setData] = useState({
    progress: 0,
    completedTasks: 0,
    score: 0,
    rating: 0,
    level: { level: 1, cat: "newbie" as CatType },
  });

  useEffect(() => {
    Promise.all([getTaskStats(), getUserScore()])
      .then(([{ completedTasks }, { score, userRating }]) => {
        setData({
          completedTasks,
          score,
          rating: userRating,
          progress: Math.round((completedTasks / TOTAL_TASKS) * 100),
          level: getLevelByScore(score),
        });
      })
      .catch(console.error);
  }, []);

  return (
    <section className="app-dashboard-page flex flex-col gap-8 text-(--text-main)">
      <div className="flex w-full flex-col justify-between gap-8 lg:flex-row">
        <div className="flex w-full flex-col gap-7 lg:w-[60%]">
          <Typography.Title level={2} style={{ margin: 0, color: "var(--text-main)" }}>
            {t("dashboardTitle")}
          </Typography.Title>

          <ProgressBar progress={data.progress} />

          <BaseBtn
            variant="primary"
            className="my-auto max-w-[350px] py-3 uppercase"
            onClick={() => router.push("/practice")}
          >
            {t("startTraining")}
          </BaseBtn>
        </div>

        <div className="hidden md:flex lg:w-auto">
          <LevelImage
            typeCat={data.level.cat}
            alt={data.level.cat}
            levelNumber={data.level.level}
          />
        </div>
      </div>

      <ResultBar score={data.score} rating={data.rating} completedTasks={data.completedTasks} />

      <LessonBoard />
    </section>
  );
}
