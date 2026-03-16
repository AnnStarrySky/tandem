"use client";

import React from "react";

import { Typography } from "antd";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { BaseBtn } from "@/src/shared/ui/button";
import { LevelImage } from "@/src/shared/ui/mainImage";
import { LessonWrapper } from "@/src/shared/ui/paragraph";
import { ProgressBar } from "@/src/widgets/progress";
import { ResultBar } from "@/src/widgets/result";

export function DashboardClient(): React.JSX.Element {
  const translation = useTranslations("Dashboard");
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full justify-between">
        <div className="flex w-full flex-col gap-3">
          <Typography.Title level={2} style={{ margin: 0 }}>
            {translation("title") ?? "Dashboard"}
          </Typography.Title>

          <LessonWrapper lessonNumber={1} topic="Cycle" />
          <ProgressBar progress={70} />

          <BaseBtn variant="primary" className="my-auto">
            Start training
          </BaseBtn>
        </div>

        <LevelImage typeCat="legend" alt="legend" />
      </div>

      <ResultBar />

      <div>
        <BaseBtn variant="outline" className="mt-3" onClick={() => router.push("/")}>
          Back
        </BaseBtn>
      </div>
    </div>
  );
}
