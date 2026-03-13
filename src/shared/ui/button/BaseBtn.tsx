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
    primary:
      "px-4 py-1 bg-gradient-to-r from-[#13b2f6] to-[#84f59b] text-white shadow-xl shadow-lg w-[full] max-w-[400px] text-[24px]",
    secondary:
      "flex items-center justify-start w-full px-4 py-1 bg-[#f4f3f8] border-transparent border-[2px] hover:bg-[#e0e5eb] hover:border-[2px] hover:border-white ",
    outline: "px-4 py-1 bg-transparent border border-[#13b2f6] text-[#13b2f6]",
  };

  return (
    <button
      {...rest}
      className={cn(
        "cursor-pointer rounded-lg text-[12px] shadow-lg transition-all duration-300",
        variantStyles[variant],
        {
          "cursor-pointer hover:shadow-xl active:scale-95": !rest.disabled,
          "cursor-not-allowed opacity-50": rest.disabled,
        },
        rest.className,
      )}
    >
      {children}
    </button>
  );
};
