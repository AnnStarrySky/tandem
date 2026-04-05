"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { useEditableProfile, useLocaleSwitch, useSettings, useUiSound } from "@shared/lib/hooks";
import { useTheme } from "@shared/lib/theme";
import { BaseBtn } from "@shared/ui/button";

import type { AppLanguage } from "@shared/types";

type ProfileResponse = {
  success: boolean;
  message?: string;
  user?: {
    id: number;
    name?: string | null;
    email?: string | null;
  };
};

type PasswordResponse = {
  success: boolean;
  message?: string;
};

type NoticeState = {
  type: "success" | "error";
  text: string;
} | null;

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}

export default function SettingsClient() {
  const t = useTranslations("Settings");
  const { data: session, update } = useSession();
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings, resetSettings, mounted: settingsMounted } = useSettings();
  const { playClickSound } = useUiSound();
  const { replaceLocale } = useLocaleSwitch();

  const initialProfile = useMemo(
    () => ({
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
    }),
    [session?.user?.email, session?.user?.name],
  );

  const { profile, mounted: profileMounted, updateProfile } = useEditableProfile(initialProfile);

  const [profileDraft, setProfileDraft] = useState(initialProfile);
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileNotice, setProfileNotice] = useState<NoticeState>(null);
  const [passwordNotice, setPasswordNotice] = useState<NoticeState>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);

  useEffect(() => {
    setProfileDraft(initialProfile);
  }, [initialProfile]);

  const cardStyle: CSSProperties = {
    background: "var(--card-bg)",
    borderColor: "var(--card-border)",
    boxShadow: "var(--card-shadow)",
  };

  const innerCardStyle: CSSProperties = {
    background: "var(--input-bg)",
    borderColor: "var(--card-border)",
  };

  const textMainStyle: CSSProperties = {
    color: "var(--text-main)",
  };

  const textMutedStyle: CSSProperties = {
    color: "var(--text-muted)",
  };

  const noticeBaseClass =
    "mt-4 rounded-2xl border px-4 py-3 text-sm leading-6 transition-all duration-300";

  const profileChanged =
    profileDraft.name.trim() !== (profile.name ?? "").trim() ||
    profileDraft.email.trim() !== (profile.email ?? "").trim();

  const canEditProfile = isEditingName || isEditingEmail;

  async function handleSaveProfile(): Promise<void> {
    setProfileNotice(null);

    const trimmedName = profileDraft.name.trim();
    const trimmedEmail = profileDraft.email.trim().toLowerCase();
    const currentEmail = (profile.email ?? session?.user?.email ?? "").trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !currentEmail) {
      setProfileNotice({
        type: "error",
        text: t("profileValidation"),
      });
      return;
    }

    setProfileLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          currentEmail,
          name: trimmedName,
          email: trimmedEmail,
        }),
      });

      const data = (await res.json()) as ProfileResponse;

      if (!res.ok || !data.success || !data.user) {
        setProfileNotice({
          type: "error",
          text: data.message ?? t("profileSaveError"),
        });
        return;
      }

      updateProfile({
        name: data.user.name ?? trimmedName,
        email: data.user.email ?? trimmedEmail,
      });

      setProfileDraft({
        name: data.user.name ?? trimmedName,
        email: data.user.email ?? trimmedEmail,
      });

      await update({
        user: {
          ...session?.user,
          name: data.user.name ?? trimmedName,
          email: data.user.email ?? trimmedEmail,
        },
      });

      setIsEditingName(false);
      setIsEditingEmail(false);

      playClickSound();

      setProfileNotice({
        type: "success",
        text: t("profileSaveSuccess"),
      });
    } catch {
      setProfileNotice({
        type: "error",
        text: t("profileSaveError"),
      });
    } finally {
      setProfileLoading(false);
    }
  }

  function handleCancelProfileEdit(): void {
    playClickSound();
    setProfileDraft({
      name: profile.name ?? "",
      email: profile.email ?? "",
    });
    setIsEditingName(false);
    setIsEditingEmail(false);
    setProfileNotice(null);
  }

  async function handleChangePassword(): Promise<void> {
    setPasswordNotice(null);

    const currentEmail = (profile.email ?? session?.user?.email ?? "").trim().toLowerCase();

    if (!currentEmail || !currentPassword || !nextPassword || !confirmPassword) {
      setPasswordNotice({
        type: "error",
        text: t("passwordValidationRequired"),
      });
      return;
    }

    if (nextPassword.length < 6) {
      setPasswordNotice({
        type: "error",
        text: t("passwordValidationLength"),
      });
      return;
    }

    if (nextPassword !== confirmPassword) {
      setPasswordNotice({
        type: "error",
        text: t("passwordValidationMatch"),
      });
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: currentEmail,
          currentPassword,
          nextPassword,
        }),
      });

      const data = (await res.json()) as PasswordResponse;

      if (!res.ok || !data.success) {
        setPasswordNotice({
          type: "error",
          text: data.message ?? t("passwordChangeError"),
        });
        return;
      }

      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
      setIsEditingSecurity(false);

      playClickSound();

      setPasswordNotice({
        type: "success",
        text: t("passwordChangeSuccess"),
      });
    } catch {
      setPasswordNotice({
        type: "error",
        text: t("passwordChangeError"),
      });
    } finally {
      setPasswordLoading(false);
    }
  }

  function handleCancelSecurityEdit(): void {
    playClickSound();
    setCurrentPassword("");
    setNextPassword("");
    setConfirmPassword("");
    setIsEditingSecurity(false);
    setPasswordNotice(null);
  }

  function handleThemeChange(nextTheme: "light" | "dark"): void {
    playClickSound();
    setTheme(nextTheme);
    updateSettings({ theme: nextTheme });
  }

  function handleLanguageChange(nextLanguage: AppLanguage): void {
    playClickSound();
    updateSettings({ language: nextLanguage });
    replaceLocale(nextLanguage);
  }

  async function handleLogout(): Promise<void> {
    playClickSound();
    await signOut({ callbackUrl: "/" });
  }

  function renderToggleButton(
    label: string,
    active: boolean,
    onClick: () => void,
    soundIgnore = false,
  ) {
    return (
      <button
        type="button"
        onClick={onClick}
        data-sound-ignore={soundIgnore ? "true" : undefined}
        className="min-w-28 cursor-pointer rounded-2xl border px-5 py-2.5 text-base font-semibold transition-all duration-200 hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
        style={{
          borderColor: active ? "transparent" : "var(--card-border)",
          background: active ? "linear-gradient(90deg, #13b2f6 0%, #84f59b 100%)" : "transparent",
          color: active ? "#ffffff" : "var(--text-main)",
          boxShadow: active ? "0 10px 24px rgba(19,178,246,0.18)" : "none",
        }}
      >
        {label}
      </button>
    );
  }

  if (!profileMounted || !settingsMounted) {
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="min-h-60 animate-pulse rounded-[28px] border p-6"
            style={cardStyle}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="rounded-[28px] border p-6 md:p-7" style={cardStyle}>
        <div>
          <h2 className="text-[28px] leading-tight font-bold" style={textMainStyle}>
            {t("profileTitle")}
          </h2>
          <p className="mt-2 text-sm leading-6" style={textMutedStyle}>
            {t("profileDescription")}
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          <label
            className="rounded-[22px] border p-4 transition-all duration-200"
            style={{
              ...innerCardStyle,
              borderColor: isEditingName ? "rgba(19, 178, 246, 0.35)" : "var(--card-border)",
              boxShadow: isEditingName ? "0 0 0 3px rgba(19,178,246,0.08)" : "none",
            }}
          >
            <div className="mb-2 text-sm font-medium" style={textMutedStyle}>
              {t("nameLabel")}
            </div>

            <div className="flex items-center gap-3">
              <input
                value={profileDraft.name}
                onChange={(event) =>
                  setProfileDraft((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                disabled={!isEditingName}
                className="w-full border-none bg-transparent text-lg outline-none disabled:cursor-default disabled:opacity-100"
                style={textMainStyle}
                placeholder={t("namePlaceholder")}
              />

              <button
                type="button"
                data-sound-ignore="true"
                onClick={() => {
                  playClickSound();
                  setIsEditingName(true);
                  setProfileNotice(null);
                }}
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border transition-all duration-200 hover:-translate-y-px"
                style={{
                  borderColor: isEditingName ? "rgba(19, 178, 246, 0.35)" : "var(--card-border)",
                  color: isEditingName ? "#13b2f6" : "var(--text-main)",
                  background: isEditingName ? "rgba(19, 178, 246, 0.08)" : "transparent",
                  boxShadow: isEditingName ? "0 0 0 3px rgba(19,178,246,0.08)" : "none",
                }}
                aria-label={t("editName")}
                title={t("editName")}
              >
                <EditIcon />
              </button>
            </div>
          </label>

          <label
            className="rounded-[22px] border p-4 transition-all duration-200"
            style={{
              ...innerCardStyle,
              borderColor: isEditingEmail ? "rgba(19, 178, 246, 0.35)" : "var(--card-border)",
              boxShadow: isEditingEmail ? "0 0 0 3px rgba(19,178,246,0.08)" : "none",
            }}
          >
            <div className="mb-2 text-sm font-medium" style={textMutedStyle}>
              {t("emailLabel")}
            </div>

            <div className="flex items-center gap-3">
              <input
                value={profileDraft.email}
                onChange={(event) =>
                  setProfileDraft((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                disabled={!isEditingEmail}
                className="w-full border-none bg-transparent text-lg outline-none disabled:cursor-default disabled:opacity-100"
                style={textMainStyle}
                placeholder={t("emailPlaceholder")}
                type="email"
              />

              <button
                type="button"
                data-sound-ignore="true"
                onClick={() => {
                  playClickSound();
                  setIsEditingEmail(true);
                  setProfileNotice(null);
                }}
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border transition-all duration-200 hover:-translate-y-px"
                style={{
                  borderColor: isEditingEmail ? "rgba(19, 178, 246, 0.35)" : "var(--card-border)",
                  color: isEditingEmail ? "#13b2f6" : "var(--text-main)",
                  background: isEditingEmail ? "rgba(19, 178, 246, 0.08)" : "transparent",
                  boxShadow: isEditingEmail ? "0 0 0 3px rgba(19,178,246,0.08)" : "none",
                }}
                aria-label={t("editEmail")}
                title={t("editEmail")}
              >
                <EditIcon />
              </button>
            </div>
          </label>
        </div>

        <div className="mt-6 flex flex-col items-start gap-3">
          <BaseBtn
            variant="primary"
            className="w-60 max-w-full text-[18px]"
            onClick={handleSaveProfile}
            disabled={!profileChanged || !canEditProfile || profileLoading}
            data-sound-ignore="true"
          >
            {profileLoading ? t("saving") : t("saveProfile")}
          </BaseBtn>

          {canEditProfile ? (
            <BaseBtn
              variant="outline"
              className="w-60 max-w-full text-[18px]"
              onClick={handleCancelProfileEdit}
              data-sound-ignore="true"
            >
              {t("cancel")}
            </BaseBtn>
          ) : null}

          <button
            type="button"
            data-sound-ignore="true"
            onClick={handleLogout}
            className="w-60 max-w-full cursor-pointer rounded-xl border px-4 py-2 text-[18px] font-semibold transition-all duration-300 hover:-translate-y-px active:scale-[0.98]"
            style={{
              color: "#dc2626",
              borderColor: "rgba(220, 38, 38, 0.25)",
              background: "rgba(220, 38, 38, 0.08)",
              boxShadow: "0 10px 24px rgba(220, 38, 38, 0.08)",
            }}
          >
            {t("logout")}
          </button>
        </div>

        {profileNotice ? (
          <div
            className={noticeBaseClass}
            style={
              profileNotice.type === "success"
                ? {
                    borderColor: "var(--card-border)",
                    background: "var(--input-bg)",
                    color: "var(--text-main)",
                  }
                : {
                    borderColor: "var(--danger-border)",
                    background: "var(--danger-bg)",
                    color: "var(--danger-text)",
                  }
            }
          >
            {profileNotice.text}
          </div>
        ) : null}
      </section>

      <section className="rounded-[28px] border p-6 md:p-7" style={cardStyle}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[28px] leading-tight font-bold" style={textMainStyle}>
              {t("securityTitle")}
            </h2>

            <p className="mt-2 text-sm leading-6" style={textMutedStyle}>
              {t("securityDescription")}
            </p>
          </div>

          <button
            type="button"
            data-sound-ignore="true"
            onClick={() => {
              playClickSound();
              setIsEditingSecurity(true);
              setPasswordNotice(null);
            }}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border transition-all duration-200 hover:-translate-y-px"
            style={{
              borderColor: isEditingSecurity ? "rgba(19, 178, 246, 0.35)" : "var(--card-border)",
              color: isEditingSecurity ? "#13b2f6" : "var(--text-main)",
              background: isEditingSecurity ? "rgba(19, 178, 246, 0.08)" : "transparent",
              boxShadow: isEditingSecurity ? "0 0 0 3px rgba(19,178,246,0.08)" : "none",
            }}
            aria-label={t("editSecurity")}
            title={t("editSecurity")}
          >
            <EditIcon />
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <label
            className="rounded-[22px] border p-4 transition-all duration-200"
            style={{
              ...innerCardStyle,
              borderColor: isEditingSecurity ? "rgba(19, 178, 246, 0.35)" : "var(--card-border)",
              boxShadow: isEditingSecurity ? "0 0 0 3px rgba(19,178,246,0.08)" : "none",
            }}
          >
            <div className="mb-2 text-sm font-medium" style={textMutedStyle}>
              {t("currentPasswordLabel")}
            </div>
            <input
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              disabled={!isEditingSecurity}
              className="w-full border-none bg-transparent text-lg outline-none disabled:cursor-default disabled:opacity-100"
              style={textMainStyle}
              type="password"
              placeholder={t("currentPasswordPlaceholder")}
            />
          </label>

          <label
            className="rounded-[22px] border p-4 transition-all duration-200"
            style={{
              ...innerCardStyle,
              borderColor: isEditingSecurity ? "rgba(19, 178, 246, 0.35)" : "var(--card-border)",
              boxShadow: isEditingSecurity ? "0 0 0 3px rgba(19,178,246,0.08)" : "none",
            }}
          >
            <div className="mb-2 text-sm font-medium" style={textMutedStyle}>
              {t("newPasswordLabel")}
            </div>
            <input
              value={nextPassword}
              onChange={(event) => setNextPassword(event.target.value)}
              disabled={!isEditingSecurity}
              className="w-full border-none bg-transparent text-lg outline-none disabled:cursor-default disabled:opacity-100"
              style={textMainStyle}
              type="password"
              placeholder={t("newPasswordPlaceholder")}
            />
          </label>

          <label
            className="rounded-[22px] border p-4 transition-all duration-200"
            style={{
              ...innerCardStyle,
              borderColor: isEditingSecurity ? "rgba(19, 178, 246, 0.35)" : "var(--card-border)",
              boxShadow: isEditingSecurity ? "0 0 0 3px rgba(19,178,246,0.08)" : "none",
            }}
          >
            <div className="mb-2 text-sm font-medium" style={textMutedStyle}>
              {t("confirmPasswordLabel")}
            </div>
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              disabled={!isEditingSecurity}
              className="w-full border-none bg-transparent text-lg outline-none disabled:cursor-default disabled:opacity-100"
              style={textMainStyle}
              type="password"
              placeholder={t("confirmPasswordPlaceholder")}
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col items-start gap-3">
          <BaseBtn
            variant="primary"
            className="w-65 max-w-full text-[18px]"
            onClick={handleChangePassword}
            disabled={passwordLoading || !isEditingSecurity}
            data-sound-ignore="true"
          >
            {passwordLoading ? t("changingPassword") : t("changePassword")}
          </BaseBtn>

          {isEditingSecurity ? (
            <BaseBtn
              variant="outline"
              className="w-65 max-w-full text-[18px]"
              onClick={handleCancelSecurityEdit}
              data-sound-ignore="true"
            >
              {t("cancel")}
            </BaseBtn>
          ) : null}
        </div>

        {passwordNotice ? (
          <div
            className={noticeBaseClass}
            style={
              passwordNotice.type === "success"
                ? {
                    borderColor: "var(--card-border)",
                    background: "var(--input-bg)",
                    color: "var(--text-main)",
                  }
                : {
                    borderColor: "var(--danger-border)",
                    background: "var(--danger-bg)",
                    color: "var(--danger-text)",
                  }
            }
          >
            {passwordNotice.text}
          </div>
        ) : null}
      </section>

      <section className="rounded-[28px] border p-6 md:p-7 xl:col-span-2" style={cardStyle}>
        <h2 className="text-[28px] leading-tight font-bold" style={textMainStyle}>
          {t("preferencesTitle")}
        </h2>

        <p className="mt-2 text-sm leading-6" style={textMutedStyle}>
          {t("preferencesDescription")}
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <div className="rounded-3xl border p-5" style={innerCardStyle}>
            <div className="mb-3 text-sm font-medium" style={textMutedStyle}>
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

          <div className="rounded-3xl border p-5" style={innerCardStyle}>
            <div className="mb-3 text-sm font-medium" style={textMutedStyle}>
              {t("themeTitle")}
            </div>

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

          <div className="rounded-3xl border p-5" style={innerCardStyle}>
            <div className="mb-3 text-sm font-medium" style={textMutedStyle}>
              {t("soundTitle")}
            </div>

            <div className="flex flex-wrap gap-3">
              {renderToggleButton(
                t("soundOn"),
                settings.soundEnabled,
                () => {
                  updateSettings({ soundEnabled: true });
                  playClickSound();
                },
                true,
              )}

              {renderToggleButton(
                t("soundOff"),
                !settings.soundEnabled,
                () => {
                  updateSettings({ soundEnabled: false });
                },
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
            onClick={() => {
              playClickSound();
              resetSettings();
            }}
          >
            {t("resetSettings")}
          </BaseBtn>
        </div>
      </section>
    </div>
  );
}
