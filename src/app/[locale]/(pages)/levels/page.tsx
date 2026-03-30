"use client";

import { Typography } from "antd";
import { useTranslations } from "next-intl";

import { LevelImage } from "@/src/shared/ui/mainImage";

const LEVELS = [
  { level: 1, cat: "newbie" as const },
  { level: 2, cat: "student" as const },
  { level: 3, cat: "programmer" as const, translateY: 10 },
  { level: 4, cat: "hacker" as const },
  { level: 5, cat: "legend" as const },
];

export default function LevelsPage() {
  const t = useTranslations("LevelTable");

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
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:flex-wrap sm:justify-center">
        {LEVELS.map(({ level, cat, translateY }) => (
          <LevelImage
            key={level}
            typeCat={cat}
            alt={cat}
            levelNumber={level}
            size={150}
            translateY={translateY}
          />
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

      {/* Таблица порогов */}
      <div className="overflow-hidden rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        <Typography.Title level={4} style={{ margin: "16px 20px 0", color: "var(--text-main)" }}>
          {t("levels")}
        </Typography.Title>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--card-border)]">
              <th className="px-5 py-3 text-left font-medium text-[var(--text-main)] opacity-60">
                {t("colLevel")}
              </th>
              <th className="px-5 py-3 text-left font-medium text-[var(--text-main)] opacity-60">
                {t("colCat")}
              </th>
              <th className="px-5 py-3 text-left font-medium text-[var(--text-main)] opacity-60">
                {t("colCondition")}
              </th>
              <th className="px-5 py-3 text-left font-medium text-[var(--text-main)] opacity-60">
                {t("colPoints")}
              </th>
            </tr>
          </thead>
          <tbody>
            {LEVELS.map(({ level, cat }) => (
              <tr key={level} className="border-b border-[var(--card-border)] last:border-0">
                <td className="px-5 py-3 text-[var(--text-main)]">{level}</td>
                <td className="px-5 py-3 text-[var(--text-main)] capitalize">{cat}</td>
                <td className="px-5 py-3 text-[var(--text-main)]">{t(conditionKey(level))}</td>
                <td className="px-5 py-3 font-medium text-[var(--text-main)]">
                  {t(pointsKey(level))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
