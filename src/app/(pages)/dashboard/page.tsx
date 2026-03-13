"use client";
import { useTranslations } from "next-intl";
import { LessonWrapper } from "@/src/shared/ui/paragraph";
import { BaseBtn } from "@/src/shared/ui/button";
import { ProgressBar } from "@/src/widgets/progress";
import { useRouter } from "next/navigation";
import { Typography } from "antd";
import { ResultBar } from "@/src/widgets/result";
import { LevelImage } from "@/src/shared/ui/mainImage";

export default function Dashboard() {
  const translation = useTranslations("Dashboard");
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full justify-between">
        <div className="flex w-full flex-col gap-3">
          <Typography.Title level={2} style={{ margin: 0 }}>
            Dashboard
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
