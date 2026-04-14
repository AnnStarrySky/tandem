"use client";

import React from "react";

import { Typography } from "antd";
import { useTranslations } from "next-intl";

import { useRouter } from "@i18n";
import { BaseBtn } from "@shared/ui/button";
import { LevelImage } from "@shared/ui/mainImage";
import { LessonWrapper } from "@shared/ui/paragraph";
import { LessonBoard } from "@widgets/LessonsPlan";
import { ProgressBar } from "@widgets/progress";
import { ResultBar } from "@widgets/result";

export default function Dashboard() {
  const t = useTranslations("Dashboard");
  const router = useRouter();

  return (
    <section className="app-dashboard-page flex flex-col gap-8 text-(--text-main)">
      <div className="flex w-full flex-col justify-between gap-8 lg:flex-row">
        <div className="flex w-full flex-col gap-5 lg:w-[60%]">
          <Typography.Title level={2} style={{ margin: 0, color: "var(--text-main)" }}>
            {t("dashboardTitle")}
          </Typography.Title>

          <LessonWrapper lessonNumber={1} topicKey="arrays" className="app-dashboard-lesson" />

          <ProgressBar progress={0} />

          <BaseBtn
            variant="primary"
            className="my-auto max-w-[350px] py-3 uppercase"
            onClick={() => router.push("/practice")}
          >
            {t("startTraining")}
          </BaseBtn>
        </div>

        <div className="hidden w-full justify-center md:flex lg:w-auto lg:justify-start">
          <LevelImage typeCat="newbie" alt="newbie" levelNumber={1} />
        </div>
      </div>

      <div className="app-dashboard-result">
        <ResultBar />
      </div>

      <LessonBoard />
    </section>
  );
}
