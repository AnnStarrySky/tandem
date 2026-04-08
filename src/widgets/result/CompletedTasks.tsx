import { Typography } from "antd";
import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib";
import { Icon } from "@/shared/ui/icon";

type Props = {
  tasks: number;
  className?: string;
};

export const CompletedTasks = ({ tasks, className }: Props) => {
  const translation = useTranslations("Dashboard");
  return (
    <div className={cn("flex flex-1 justify-center gap-2 p-2", className)}>
      <Icon name="check" color="green" />
      <Typography.Text style={{ fontSize: "18px" }}>
        {translation("completedtasks")}: {tasks}{" "}
      </Typography.Text>
    </div>
  );
};
