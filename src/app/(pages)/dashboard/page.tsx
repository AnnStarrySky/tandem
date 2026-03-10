"use client";
import { useTranslations } from "next-intl";
import { SectionTitle } from "@/src/shared/ui/sectiontitle";
import { LessonWrapper } from "@/src/shared/ui/paragraph";
import { BaseBtn } from "@/src/shared/ui/button";
import { MainImage } from "@/src/shared/ui/mainImage";
import { ProgressBar } from "@/src/shared/ui/progress";
import { useRouter } from "next/navigation";

export default function Home() {
  const translation = useTranslations("HomePage");
  const router = useRouter();
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex w-full flex-col gap-3">
          <SectionTitle>Dashboard</SectionTitle>
          <LessonWrapper lessonNumber={1} topic="Cycle" />
          <ProgressBar progress={70} />
          <div className="flex flex-1">
            <BaseBtn variant="primary" className="self-center">
              Start training
            </BaseBtn>
          </div>
        </div>
        <MainImage typeCat="programmer" alt="programmer" />
      </div>
      <div>
        <BaseBtn variant="outline" onClick={() => router.push("/")}>
          Back
        </BaseBtn>
      </div>
    </div>
  );
}
