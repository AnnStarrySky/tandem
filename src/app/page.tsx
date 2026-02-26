import Image from "next/image";
import { Button } from "antd";
import { useTranslations } from "next-intl";
import BaseButton from "../shared/ui/button";

export default function Home() {
  const translation = useTranslations("HomePage");
  return (
    <div>
      <BaseButton />
    </div>
  );
}
