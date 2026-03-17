import { cn } from "@/src/shared/lib";
import { Typography } from "antd";
import { Icon } from "@/src/shared/ui/icon";
import { useTranslations } from "next-intl";

type Props = {
  tasks: number;
  className?: string;
};

export const CompletedTasks = ({ tasks, className }: Props) => {
  const translation = useTranslations("Dashboard");
  return (
    <div className={cn("flex flex-1 justify-center gap-2", className)}>
      <Icon name="check" color="green" />
      <Typography.Text style={{ fontSize: "18px" }}>
        {translation("completedtasks")}: {tasks}{" "}
      </Typography.Text>
    </div>
  );
};
