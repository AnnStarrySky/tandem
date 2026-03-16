import { cn } from "@/src/shared/lib";
import { Typography } from "antd";
import { Icon } from "@/src/shared/ui/icon";

type Props = {
  tasks: number;
  className?: string;
};

export const CompletedTasks = ({ tasks, className }: Props) => {
  return (
    <div className={cn("flex flex-1 justify-center gap-2", className)}>
      <Icon name="check" color="green" />
      <Typography.Text style={{ fontSize: "18px" }}>Completed {tasks} tasks</Typography.Text>
    </div>
  );
};
