"use client";

import { useTranslations } from "next-intl";

import { BaseBtn } from "@shared/ui/button";

import { usePreferencesForm } from "../model";

const cardClass =
  "rounded-[28px] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-[var(--card-shadow)] md:p-7";

const innerCardClass = "rounded-3xl border border-[var(--card-border)] bg-[var(--input-bg)] p-5";

type RenderToggleButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
  soundIgnore?: boolean;
};

function RenderToggleButton({
  label,
  active,
  onClick,
  soundIgnore = false,
}: RenderToggleButtonProps) {
  return (
    <BaseBtn
      variant={active ? "primary" : "outline"}
      onClick={onClick}
      data-sound-ignore={soundIgnore ? "true" : undefined}
      className="flex-1 text-base"
    >
      {label}
    </BaseBtn>
  );
}

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
            <RenderToggleButton
              label="EN"
              active={settings.language === "en"}
              onClick={() => handleLanguageChange("en")}
              soundIgnore
            />

            <RenderToggleButton
              label="RU"
              active={settings.language === "ru"}
              onClick={() => handleLanguageChange("ru")}
              soundIgnore
            />
          </div>
        </div>

        <div className={innerCardClass}>
          <div className="mb-3 text-sm font-medium text-[var(--text-muted)]">{t("themeTitle")}</div>

          <div className="flex flex-wrap gap-3">
            <RenderToggleButton
              label={t("lightTheme")}
              active={theme === "light"}
              onClick={() => handleThemeChange("light")}
              soundIgnore
            />

            <RenderToggleButton
              label={t("darkTheme")}
              active={theme === "dark"}
              onClick={() => handleThemeChange("dark")}
              soundIgnore
            />
          </div>
        </div>

        <div className={innerCardClass}>
          <div className="mb-3 text-sm font-medium text-[var(--text-muted)]">{t("soundTitle")}</div>

          <div className="flex flex-wrap gap-3">
            <RenderToggleButton
              label={t("soundOn")}
              active={settings.soundEnabled}
              onClick={() => handleSoundChange(true)}
              soundIgnore
            />

            <RenderToggleButton
              label={t("soundOff")}
              active={!settings.soundEnabled}
              onClick={() => handleSoundChange(false)}
              soundIgnore
            />
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
