import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../lib";

type BaseBtnProps = {
  variant?: "primary" | "secondary" | "outline";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const BaseBtn: React.FC<PropsWithChildren<BaseBtnProps>> = ({
  children,
  variant = "primary",
  ...rest
}) => {
  const variantStyles = {
    primary: "bg-gradient-to-r from-[#13b2f6] to-[#84f59b] text-white border-0",
    secondary: "bg-[#84f59b] text-white border-0",
    outline: "bg-transparent border border-[#13b2f6] text-[#13b2f6]",
  };

  return (
    <button
      {...rest}
      className={cn(
        "mb-4 cursor-pointer rounded-lg px-6 py-2 transition-all duration-300",
        variantStyles[variant],
        {
          "cursor-pointer hover:shadow-lg active:scale-95": !rest.disabled,
          "cursor-not-allowed opacity-50": rest.disabled,
        },
        rest.className,
      )}
    >
      {children}
    </button>
  );
};
