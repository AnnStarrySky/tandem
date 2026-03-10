"use client";
import { useTranslations } from "next-intl";
import { LessonWrapper } from "@/src/shared/ui/paragraph";
import { BaseBtn } from "@/src/shared/ui/button";
import { MainImage } from "@/src/shared/ui/mainImage";
import { ProgressBar } from "@/src/widgets/progress";
import { useRouter } from "next/navigation";
import { Typography } from "antd";
import { ResultBar } from "@/src/widgets/result";

export default function Home() {
  const translation = useTranslations("HomePage");
  const router = useRouter();
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <div className="flex w-full flex-col gap-4">
          <Typography.Title level={2}>Dashboard</Typography.Title>
          <LessonWrapper lessonNumber={1} topic="Cycle" />
          <ProgressBar progress={70} />
          <BaseBtn variant="primary">Start training</BaseBtn>
        </div>
        <MainImage typeCat="programmer" alt="programmer" />
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
