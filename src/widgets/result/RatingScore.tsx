import React from "react";
import { cn } from "@/src/shared/lib";
import { Typography } from "antd";
import { Icon } from "@/src/shared/ui/icon";

type Props = {
  rating: number;
  className?: string;
};

export const RatingScore = ({ rating, className }: Props) => {
  return (
    <div
      className={cn(
        "flex flex-1 justify-center border-r border-r-[1px] border-[#f4f3f8] p-2",
        className,
      )}
    >
      <Icon name="rating" size={18} color="#6a7285" className="mr-2" />
      <Typography.Text style={{ fontSize: "18px" }}>Rating #{rating}</Typography.Text>
    </div>
  );
};
