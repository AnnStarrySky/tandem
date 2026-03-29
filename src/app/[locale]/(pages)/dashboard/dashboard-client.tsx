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
      <div className="flex w-full flex-col justify-between gap-8 lg:flex-row">
        <div className="flex w-full flex-col gap-5 lg:w-[60%]">
          <Typography.Title level={2} style={{ margin: 0, color: "var(--text-main)" }}>
            {translation("dashboardTitle")}
          </Typography.Title>

          <LessonWrapper lessonNumber={1} topicKey="arrays" className="app-dashboard-lesson" />

          <ProgressBar progress={70} />

          <BaseBtn variant="primary" className="my-auto py-3 uppercase">
            {translation("startTraining")}
          </BaseBtn>
        </div>
        <div className="flex w-full justify-center lg:w-auto lg:justify-start">
          <LevelImage typeCat="programmer" alt="legend" />
        </div>
      </div>

      <div className="app-dashboard-result">
        <ResultBar />
      </div>
      <LessonBoard />
    </section>
  );
}
