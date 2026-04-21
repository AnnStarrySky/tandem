"use client";

import { useEffect, useState } from "react";
import { Typography } from "antd";
import { useTranslations } from "next-intl";

import { LevelImage } from "@/shared/ui/mainImage";

const LEVELS = [
  { level: 1, cat: "newbie" },
  { level: 2, cat: "student" },
  { level: 3, cat: "programmer", translateY: 10 },
  { level: 4, cat: "hacker" },
  { level: 5, cat: "legend" },
];

export default function LevelsPage() {
  const t = useTranslations("LevelTable");
  const [visibleLevels, setVisibleLevels] = useState<number[]>([]);

  useEffect(() => {
    LEVELS.forEach((_, i) => {
      setTimeout(() => {
        setVisibleLevels((prev) => [...prev, i]);
      }, i * 400);
    });
  }, []);

  return (
    <div className="flex flex-col gap-8 text-[var(--text-main)]">
      <div>
        <Typography.Title level={2} style={{ margin: 0, color: "var(--text-main)" }}>
          {t("title")}
        </Typography.Title>
        <Typography.Text style={{ color: "#6a7285" }}>{t("subtitle")}</Typography.Text>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:flex-wrap sm:justify-center">
        {LEVELS.map((lvl, i) => (
          <div
            key={lvl.level}
            style={{
              transform: visibleLevels.includes(i) ? "translateX(0)" : "translateX(-170px)",
              opacity: visibleLevels.includes(i) ? 1 : 0,
              transition: "all 0.5s ease",
            }}
          >
            <LevelImage
              typeCat={lvl.cat}
              alt={lvl.cat}
              levelNumber={lvl.level}
              size={150}
              translateY={lvl.translateY}
            />
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-[var(--input-bg)] p-5">
        <Typography.Title level={4} style={{ color: "var(--text-main)" }}>
          {t("taskTypes")}
        </Typography.Title>

        {[
          { label: t("quiz"), points: t("quizPoints"), color: "#84f59b" },
          { label: t("codeCompletion"), points: t("codeCompletionPoints"), color: "#13b2f6" },
          { label: t("codeWriting"), points: t("codeWritingPoints"), color: "#f67213" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ background: item.color }} />
            <Typography.Text style={{ color: "var(--text-main)" }}>
              {item.label} — <span style={{ color: "#6a7285" }}>{item.points}</span>
            </Typography.Text>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEVELS.map((lvl) => (
          <div key={lvl.level} className="rounded-lg border bg-[var(--input-bg)] p-4">
            <div className="mb-2 text-lg font-semibold">
              {t("colLevel")} {lvl.level} — {lvl.cat}
            </div>

            <div className="text-sm opacity-70">{t(`level${lvl.level}condition`)}</div>

            <div className="mt-1 text-sm font-medium">{t(`level${lvl.level}points`)} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
}
