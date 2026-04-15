"use client";

import React, { useEffect, useState } from "react";

import { Typography } from "antd";
import { useTranslations } from "next-intl";

import { getTaskStats, getUserScore } from "@/entities/practice";
import { getLevelByScore } from "@/entities/practice";
import { useRouter } from "@i18n";
import { BaseBtn } from "@shared/ui/button";
import { LevelImage } from "@shared/ui/mainImage";
import { LessonWrapper } from "@shared/ui/paragraph";
import { LessonBoard } from "@widgets/LessonsPlan";
import { ProgressBar } from "@widgets/progress";
import { ResultBar } from "@widgets/result";

const TOTAL_TASKS = 90;

export default function Dashboard() {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState({ level: 1, cat: "newbie" as const });

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

  return (
    <section className="app-dashboard-page flex flex-col gap-8 text-(--text-main)">
      <div className="flex w-full flex-col justify-between gap-8 lg:flex-row">
        <div className="flex w-full flex-col gap-7 lg:w-[60%]">
          <Typography.Title level={2} style={{ margin: 0, color: "var(--text-main)" }}>
            {t("dashboardTitle")}
          </Typography.Title>

          <ProgressBar progress={progress} />

          <BaseBtn
            variant="primary"
            className="my-auto max-w-[350px] py-3 uppercase"
            onClick={() => router.push("/practice")}
          >
            {t("startTraining")}
          </BaseBtn>
        </div>

        <div className="hidden w-full justify-center md:flex lg:w-auto lg:justify-start">
          <LevelImage typeCat={level.cat} alt={level.cat} levelNumber={level.level} />
        </div>
      </div>

      <div className="app-dashboard-result">
        <ResultBar />
      </div>

      <LessonBoard />
    </section>
  );
}
