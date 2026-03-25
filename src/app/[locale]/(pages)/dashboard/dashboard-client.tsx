"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { Typography } from "antd";
import { useLocale, useTranslations } from "next-intl";

import { BaseBtn } from "@shared/ui/button";
import { LevelImage } from "@shared/ui/mainImage";
import { LessonWrapper } from "@shared/ui/paragraph";
import { ProgressBar } from "@widgets/progress";
import { ResultBar } from "@widgets/result";
import { LessonBoard } from "@/src/widgets/LessonsPlan";

export default function Dashboard() {
  const translation = useTranslations("Dashboard");
  return (
    <section className="app-dashboard-page flex flex-col gap-8 text-[var(--text-main)]">
      <div className="flex w-full justify-between gap-8">
        <div className="flex w-[60%] flex-col gap-5">
          <Typography.Title level={2} style={{ margin: 0, color: "var(--text-main)" }}>
            {translation("dashboardTitle")}
          </Typography.Title>

          <LessonWrapper lessonNumber={1} topicKey="arrays" className="app-dashboard-lesson" />

          <ProgressBar progress={70} />

          <BaseBtn variant="primary" className="my-auto py-3 uppercase">
            {translation("startTraining")}
          </BaseBtn>
        </div>

        <LevelImage typeCat="legend" alt="legend" />
      </div>

      <div className="app-dashboard-result">
        <ResultBar />
      </div>
      <LessonBoard />
    </section>
  );
}
