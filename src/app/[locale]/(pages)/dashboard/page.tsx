"use client";
import { useRouter } from "next/navigation";

import { Typography } from "antd";
import { useTranslations } from "next-intl";

import { BaseBtn } from "@/src/shared/ui/button";
import { LevelImage } from "@/src/shared/ui/mainImage";
import { LessonWrapper } from "@/src/shared/ui/paragraph";
import { ProgressBar } from "@/src/widgets/progress";
import { ResultBar } from "@/src/widgets/result";

export default function Dashboard() {
  const translation = useTranslations("Dashboard");
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-between">
        <div className="flex w-[60%] flex-col gap-3">
          <Typography.Title level={2} style={{ margin: 0 }}>
            {translation("dashboardTitle")}
          </Typography.Title>
          <LessonWrapper lessonNumber={1} topicKey="arrays" />
          <ProgressBar progress={70} />
          <BaseBtn variant="primary" className="my-auto">
            {translation("startTraining")}
          </BaseBtn>
        </div>
        <LevelImage typeCat="hacker" alt="hacker" />
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
