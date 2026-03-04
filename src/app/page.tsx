import { useTranslations } from "next-intl";
import { SectionTitle } from "../shared/ui/sectiontitle";
import { LessonWrapper } from "../shared/ui/paragraph";
import { BaseBtn } from "../shared/ui/button";
import programmer from "../../public/programmer.png";
import { MainImage } from "../shared/ui/mainImage";
import { ProgressBar } from "../shared/ui/progress";
export default function Home() {
  const translation = useTranslations("HomePage");

  return (
    <div className="flex justify-between">
      <div className="flex w-full flex-col gap-3">
        <SectionTitle>Dashboard</SectionTitle>
        <LessonWrapper lessonNumber={1} topic="Cycle" />
        <ProgressBar progress={70} />
        <div className="flex flex-1">
          <BaseBtn variant="primary" className="w-[400px] self-center text-[24px]">
            Start training
          </BaseBtn>
        </div>
      </div>
      <MainImage src={programmer} alt="Cat" />
    </div>
  );
}
