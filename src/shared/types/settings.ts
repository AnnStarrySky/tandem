export type AppTheme = "light" | "dark";
export type AppLanguage = "en" | "ru";

export type UserSettings = {
  theme: AppTheme;
  language: AppLanguage;
  soundEnabled: boolean;
};
