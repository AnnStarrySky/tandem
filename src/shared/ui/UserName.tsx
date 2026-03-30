import { cn } from "../lib";

type Props = {
  userName: string;
  className?: string;
};

export const UserName = ({ userName, className }: Props) => {
  return <div className={cn("", className)}>{userName}</div>;
};
