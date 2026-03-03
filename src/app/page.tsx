import Image from "next/image";

import { Button } from "antd";
import { useTranslations } from "next-intl";
import { SectionTitle } from "../shared/ui/sectiontitle";

export default function Home() {
  const translation = useTranslations("HomePage");

  return (
    <div>
      <SectionTitle>Dashboard</SectionTitle>
      <p>Lesson 1</p>
    </div>
  );
}
