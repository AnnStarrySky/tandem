"use client";

import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "../../lib";

type BaseBtnProps = {
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const BaseBtn: React.FC<PropsWithChildren<BaseBtnProps>> = ({
  children,
  variant = "primary",
  fullWidth = false,
  loading = false,
  type = "button",
  disabled,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const variantStyles = {
    primary:
      "px-4 py-2 bg-gradient-to-r from-[#13b2f6] to-[#84f59b] text-white shadow-lg w-full max-w-[400px] text-[16px] font-semibold hover:opacity-90",
    secondary:
      "flex items-center justify-start px-4 py-2 border-transparent border-[2px] bg-[var(--input-bg)] text-[var(--text-main)] hover:bg-[#fefefe] dark:hover:bg-white/10",
    outline:
      "px-4 py-2 bg-transparent border border-[var(--card-border)] text-[var(--text-main)] hover:bg-white/60 dark:hover:bg-white/8",
  };

  return (
    <button
      {...rest}
      type={type}
      disabled={isDisabled}
      className={cn(
        "cursor-pointer rounded-lg text-[12px] shadow-lg transition-all duration-300",
        variantStyles[variant],
        fullWidth && "max-w-none",
        {
          "hover:shadow-xl active:scale-95": !isDisabled,
          "cursor-not-allowed opacity-50": isDisabled,
        },
        rest.className,
      )}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
