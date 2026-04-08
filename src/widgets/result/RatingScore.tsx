import { Typography } from "antd";
import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib";
import { Icon } from "@/shared/ui/icon";

type Props = {
  rating: number;
  className?: string;
};

export const RatingScore = ({ rating, className }: Props) => {
  const translation = useTranslations("Dashboard");
  return (
    <div
      className={cn(
        "flex w-full flex-1 items-center justify-center border-b border-[var(--card-border)] p-2 lg:border-r lg:border-b-0",
        className,
      )}
    >
      <Icon name="rating" size={18} color="var(--text-main)" className="mr-2" />
      <Typography.Text style={{ fontSize: "18px" }}>
        {translation("rating")} #{rating}
      </Typography.Text>
    </div>
  );
};
