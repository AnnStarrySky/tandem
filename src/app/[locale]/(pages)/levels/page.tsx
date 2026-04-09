"use client";

import { useEffect, useState } from "react";
import { Typography } from "antd";
import { useTranslations } from "next-intl";

import { LevelImage } from "@/shared/ui/mainImage";

const LEVELS = [
  { level: 1, cat: "newbie" as const },
  { level: 2, cat: "student" as const },
  { level: 3, cat: "programmer" as const, translateY: 5 },
  { level: 4, cat: "hacker" as const },
  { level: 5, cat: "legend" as const },
];

export default function LevelsPage() {
  const t = useTranslations("LevelTable");
  const [visible, setVisible] = useState<boolean[]>([false, false, false, false, false]);

  useEffect(() => {
    LEVELS.forEach((_, i) => {
      setTimeout(() => {
        setVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * 400);
    });
  }, []);

  const conditionKey = (level: number) =>
    `level${level}condition` as
      | "level1condition"
      | "level2condition"
      | "level3condition"
      | "level4condition"
      | "level5condition";

  const pointsKey = (level: number) =>
    `level${level}points` as
      | "level1points"
      | "level2points"
      | "level3points"
      | "level4points"
      | "level5points";

  return (
    <div className="flex flex-col gap-8 text-[var(--text-main)]">
      <div>
        <Typography.Title level={2} style={{ margin: 0, color: "var(--text-main)" }}>
          {t("title")}
        </Typography.Title>
        <Typography.Text style={{ color: "#6a7285" }}>{t("subtitle")}</Typography.Text>
      </div>

      {/* Картинки котов */}
      <div className="flex flex-col items-center gap-6 overflow-hidden sm:flex-row sm:flex-wrap sm:justify-center">
        {LEVELS.map(({ level, cat, translateY }, i) => (
          <div
            key={level}
            style={{
              transform: visible[i] ? "translateX(0)" : "translateX(-170px)",
              opacity: visible[i] ? 1 : 0,
              transition: "transform 0.5s ease, opacity 0.4s ease",
            }}
          >
            <LevelImage
              typeCat={cat}
              alt={cat}
              levelNumber={level}
              size={150}
              translateY={translateY}
            />
          </div>
        ))}
      </div>

      {/* Типы задач */}
      <div className="rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        <Typography.Title level={4} style={{ margin: "0 0 12px", color: "var(--text-main)" }}>
          {t("taskTypes")}
        </Typography.Title>
        <div className="flex flex-col gap-2">
          {[
            { label: t("quiz"), points: t("quizPoints"), color: "#84f59b" },
            { label: t("codeCompletion"), points: t("codeCompletionPoints"), color: "#13b2f6" },
            { label: t("codeWriting"), points: t("codeWritingPoints"), color: "#f67213" },
          ].map(({ label, points, color }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ background: color }} />
              <Typography.Text style={{ color: "var(--text-main)" }}>
                {label} — <span style={{ color: "#6a7285" }}>{points}</span>
              </Typography.Text>
            </div>
          ))}
        </div>
      </div>

      {/* Карточки порогов */}
      <div className="flex flex-col gap-2">
        <Typography.Title level={4} style={{ margin: "0 0 8px", color: "var(--text-main)" }}>
          {t("levels")}
        </Typography.Title>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map(({ level, cat }) => (
            <div
              key={level}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] p-4 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]"
            >
              <div className="mb-2 text-lg font-semibold text-[var(--text-main)]">
                {t("colLevel")} {level} — {cat}
              </div>
              <div className="text-sm text-[var(--text-main)] opacity-70">
                {t("colCondition")}: {t(conditionKey(level))}
              </div>
              <div className="mt-1 text-sm font-medium text-[var(--text-main)]">
                {t("colPoints")}: {t(pointsKey(level))} XP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
