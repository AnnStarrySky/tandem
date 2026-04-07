"use client";

import { useTranslations } from "next-intl";

import { BaseBtn } from "@shared/ui/button";

import { usePreferencesForm } from "../model";

const cardClass =
  "rounded-[28px] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-[var(--card-shadow)] md:p-7";

const innerCardClass = "rounded-3xl border border-[var(--card-border)] bg-[var(--input-bg)] p-5";

export function SettingsPreferencesForm() {
  const t = useTranslations("Settings");
  const {
    mounted,
    settings,
    theme,
    handleThemeChange,
    handleLanguageChange,
    handleSoundChange,
    handleReset,
  } = usePreferencesForm();

  function renderToggleButton(
    label: string,
    active: boolean,
    onClick: () => void,
    soundIgnore = false,
  ) {
    return (
      <BaseBtn
        variant={active ? "primary" : "outline"}
        onClick={onClick}
        data-sound-ignore={soundIgnore ? "true" : undefined}
        className="max-w-none min-w-28 text-base"
      >
        {label}
      </BaseBtn>
    );
  }

  if (!mounted) {
    return <div className={`${cardClass} min-h-60 animate-pulse`} />;
  }

  return (
    <section className={cardClass}>
      <h2 className="text-[28px] leading-tight font-bold text-[var(--text-main)]">
        {t("preferencesTitle")}
      </h2>

      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        {t("preferencesDescription")}
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className={innerCardClass}>
          <div className="mb-3 text-sm font-medium text-[var(--text-muted)]">
            {t("languageTitle")}
          </div>

          <div className="flex flex-wrap gap-3">
            {renderToggleButton(
              "EN",
              settings.language === "en",
              () => handleLanguageChange("en"),
              true,
            )}
            {renderToggleButton(
              "RU",
              settings.language === "ru",
              () => handleLanguageChange("ru"),
              true,
            )}
          </div>
        </div>

        <div className={innerCardClass}>
          <div className="mb-3 text-sm font-medium text-[var(--text-muted)]">{t("themeTitle")}</div>

          <div className="flex flex-wrap gap-3">
            {renderToggleButton(
              t("lightTheme"),
              theme === "light",
              () => handleThemeChange("light"),
              true,
            )}
            {renderToggleButton(
              t("darkTheme"),
              theme === "dark",
              () => handleThemeChange("dark"),
              true,
            )}
          </div>
        </div>

        <div className={innerCardClass}>
          <div className="mb-3 text-sm font-medium text-[var(--text-muted)]">{t("soundTitle")}</div>

          <div className="flex flex-wrap gap-3">
            {renderToggleButton(
              t("soundOn"),
              settings.soundEnabled,
              () => handleSoundChange(true),
              true,
            )}
            {renderToggleButton(
              t("soundOff"),
              !settings.soundEnabled,
              () => handleSoundChange(false),
              true,
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <BaseBtn
          variant="outline"
          className="w-55 max-w-full text-[18px]"
          data-sound-ignore="true"
          onClick={handleReset}
        >
          {t("resetSettings")}
        </BaseBtn>
      </div>
    </section>
  );
}
