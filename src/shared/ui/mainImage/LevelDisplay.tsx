"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { cn } from "../../lib";
import { IconLogo } from "../icon";

type Props = {
  levelNumber: number;
  className?: string;
};

type ThemeMode = "light" | "dark";

export const LevelDisplay = ({ levelNumber, className }: Props) => {
  const translation = useTranslations("Dashboard");
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const readTheme = () => {
      const nextTheme =
        document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

      setTheme(nextTheme);
    };

    readTheme();

    const observer = new MutationObserver(() => {
      readTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "align-center absolute bottom-[0%] left-[-10%] z-10 flex justify-center rounded-full px-4 py-1 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]",
        className,
      )}
      style={{
        background: isDark ? "rgba(15, 23, 42, 0.82)" : "rgba(255, 255, 255, 0.92)",
        color: isDark ? "#f8fafc" : "#0f172a",
        backdropFilter: "blur(8px)",
        border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.08)",
      }}
    >
      <div
        style={{
          color: isDark ? "#f8fafc" : "#0f172a",
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconLogo size={23} />
      </div>

      <span
        style={{
          color: isDark ? "#f8fafc" : "#0f172a",
          marginLeft: "4px",
          fontWeight: 600,
        }}
      >
        {translation("levelcat")}
        {levelNumber}
      </span>
    </div>
  );
};
