"use client";

import React, { useEffect, useMemo, useState } from "react";

import { signOut, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

import { useEditableProfile, useSettings } from "@shared/lib/hooks";
import { useTheme } from "@shared/lib/theme";
import { BaseBtn } from "@shared/ui/button";

import { LanguageSwitcher } from "./language-switcher";

type RequestState = {
  type: "success" | "error";
  message: string;
} | null;

type ApiResponse = {
  success?: boolean;
  message?: string;
  user?: {
    id: number;
    email?: string | null;
    name?: string | null;
  };
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function SettingsClient() {
  const t = useTranslations("Settings");
  const locale = useLocale();
  const { data: session, update: updateSession } = useSession();

  const { theme, setTheme, mounted: themeMounted } = useTheme();
  const {
    settings,
    mounted: settingsMounted,
    setSoundEnabled,
    resetSettings,
    updateSettings,
  } = useSettings();

  const initialProfile = useMemo(
    () => ({
      name: session?.user?.name || "CodeCat User",
      email: session?.user?.email || "",
    }),
    [session?.user?.email, session?.user?.name],
  );

  const { profile, updateProfile } = useEditableProfile(initialProfile);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [profileState, setProfileState] = useState<RequestState>(null);
  const [passwordState, setPasswordState] = useState<RequestState>(null);

  const [draftName, setDraftName] = useState(initialProfile.name);
  const [draftEmail, setDraftEmail] = useState(initialProfile.email);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setDraftName(profile.name);
    setDraftEmail(profile.email);
  }, [profile.email, profile.name]);

  useEffect(() => {
    if (!settingsMounted || !themeMounted) {
      return;
    }

    if (settings.theme !== theme) {
      updateSettings({ theme });
    }
  }, [settings.theme, settingsMounted, theme, themeMounted, updateSettings]);

  const handleThemeChange = (nextTheme: "light" | "dark") => {
    setTheme(nextTheme);
    updateSettings({ theme: nextTheme });
  };

  const handleSaveProfile = async () => {
    const normalizedName = draftName.trim() || "CodeCat User";
    const normalizedEmail = draftEmail.trim().toLowerCase();

    setProfileState(null);

    if (!normalizedEmail) {
      setProfileState({
        type: "error",
        message: t("profile.errors.emailRequired"),
      });
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setProfileState({
        type: "error",
        message: t("profile.errors.emailRequired"),
      });
      return;
    }

    try {
      setIsSavingProfile(true);

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: normalizedName,
          email: normalizedEmail,
        }),
      });

      const data = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || t("profile.errors.updateFailed"));
      }

      updateProfile({
        name: normalizedName,
        email: normalizedEmail,
      });

      await updateSession({
        user: {
          ...session?.user,
          name: normalizedName,
          email: normalizedEmail,
        },
      });

      setIsEditingProfile(false);
      setProfileState({
        type: "success",
        message: t("profile.successReLogin"),
      });
    } catch (error) {
      setProfileState({
        type: "error",
        message: error instanceof Error ? error.message : t("profile.errors.updateFailed"),
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelProfile = () => {
    setDraftName(profile.name);
    setDraftEmail(profile.email);
    setProfileState(null);
    setIsEditingProfile(false);
  };

  const handleSavePassword = async () => {
    setPasswordState(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordState({
        type: "error",
        message: t("profile.password.errors.fillAll"),
      });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordState({
        type: "error",
        message: t("profile.password.errors.minLength"),
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordState({
        type: "error",
        message: t("profile.password.errors.mismatch"),
      });
      return;
    }

    try {
      setIsSavingPassword(true);

      const response = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          nextPassword: newPassword,
        }),
      });

      const data = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || t("profile.password.errors.updateFailed"));
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);

      setPasswordState({
        type: "success",
        message: t("profile.password.success"),
      });
    } catch (error) {
      setPasswordState({
        type: "error",
        message: error instanceof Error ? error.message : t("profile.password.errors.updateFailed"),
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await signOut({
        callbackUrl: `/${locale}/auth/login`,
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleResetSettings = () => {
    resetSettings();
    setTheme("dark");
  };

  const getToggleVariant = (isActive: boolean) => (isActive ? "primary" : "outline");

  const renderState = (state: RequestState) => {
    if (!state) {
      return null;
    }

    const isSuccess = state.type === "success";

    return (
      <div
        className="rounded-xl border px-4 py-3 text-sm"
        style={{
          borderColor: isSuccess ? "rgba(16,185,129,0.25)" : "var(--danger-border)",
          background: isSuccess ? "rgba(16,185,129,0.10)" : "var(--danger-bg)",
          color: isSuccess ? "#10b981" : "var(--danger-text)",
        }}
      >
        {state.message}
      </div>
    );
  };

  return (
    <section className="flex w-full min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-4xl font-semibold">{t("title")}</h1>
        <p className="m-0 text-base text-[var(--text-muted)]">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-[var(--card-shadow)] backdrop-blur-md">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="m-0 text-2xl font-semibold">{t("profile.title")}</h2>
              <p className="m-0 mt-1 text-sm text-[var(--text-muted)]">
                {t("profile.description")}
              </p>
            </div>

            {!isEditingProfile ? (
              <BaseBtn
                variant="outline"
                className="w-auto max-w-none px-4 py-2 text-sm"
                onClick={() => {
                  setProfileState(null);
                  setIsEditingProfile(true);
                }}
              >
                {t("profile.edit")}
              </BaseBtn>
            ) : null}
          </div>

          <div className="flex flex-col gap-3">
            {renderState(profileState)}

            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] p-4">
              <div className="mb-2 text-sm text-[var(--text-muted)]">{t("profile.nameLabel")}</div>

              {isEditingProfile ? (
                <input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="w-full rounded-lg border border-[var(--input-border)] bg-transparent px-3 py-2 text-base outline-none"
                />
              ) : (
                <div className="text-base font-medium">{profile.name}</div>
              )}
            </div>

            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] p-4">
              <div className="mb-2 text-sm text-[var(--text-muted)]">{t("profile.emailLabel")}</div>

              {isEditingProfile ? (
                <input
                  value={draftEmail}
                  onChange={(e) => setDraftEmail(e.target.value)}
                  className="w-full rounded-lg border border-[var(--input-border)] bg-transparent px-3 py-2 text-base outline-none"
                  type="email"
                />
              ) : (
                <div className="text-base font-medium break-all">
                  {profile.email || t("profile.noEmail")}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] p-4">
              <div className="mb-2 text-sm text-[var(--text-muted)]">
                {t("profile.password.label")}
              </div>

              <div className="mb-3 text-base font-medium">{t("profile.password.masked")}</div>

              {renderState(passwordState)}

              {!showPasswordForm ? (
                <BaseBtn
                  variant="outline"
                  className="mt-3 w-auto max-w-none px-4 py-2 text-sm"
                  onClick={() => {
                    setPasswordState(null);
                    setShowPasswordForm(true);
                  }}
                >
                  {t("profile.password.change")}
                </BaseBtn>
              ) : (
                <div className="mt-3 flex flex-col gap-3">
                  <input
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    type="password"
                    placeholder={t("profile.password.current")}
                    className="w-full rounded-lg border border-[var(--input-border)] bg-transparent px-3 py-2 text-base outline-none"
                  />
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    placeholder={t("profile.password.new")}
                    className="w-full rounded-lg border border-[var(--input-border)] bg-transparent px-3 py-2 text-base outline-none"
                  />
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder={t("profile.password.confirm")}
                    className="w-full rounded-lg border border-[var(--input-border)] bg-transparent px-3 py-2 text-base outline-none"
                  />

                  <div className="flex flex-wrap gap-3">
                    <BaseBtn
                      variant="outline"
                      className="w-auto max-w-none px-4 py-2 text-sm"
                      onClick={handleSavePassword}
                      disabled={isSavingPassword}
                    >
                      {isSavingPassword ? t("profile.password.saving") : t("profile.password.save")}
                    </BaseBtn>

                    <BaseBtn
                      variant="outline"
                      className="w-auto max-w-none px-4 py-2 text-sm"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordState(null);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                      disabled={isSavingPassword}
                    >
                      {t("common.cancel")}
                    </BaseBtn>
                  </div>
                </div>
              )}
            </div>

            {isEditingProfile ? (
              <div className="flex flex-wrap gap-3">
                <BaseBtn
                  variant="outline"
                  className="w-auto max-w-none px-4 py-2 text-sm"
                  onClick={handleSaveProfile}
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? t("profile.saving") : t("profile.save")}
                </BaseBtn>

                <BaseBtn
                  variant="outline"
                  className="w-auto max-w-none px-4 py-2 text-sm"
                  onClick={handleCancelProfile}
                  disabled={isSavingProfile}
                >
                  {t("common.cancel")}
                </BaseBtn>
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-[var(--card-shadow)] backdrop-blur-md">
          <div className="mb-4">
            <h2 className="m-0 text-2xl font-semibold">{t("appearance.title")}</h2>
            <p className="m-0 mt-1 text-sm text-[var(--text-muted)]">
              {t("appearance.description")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <BaseBtn
              variant={getToggleVariant(themeMounted && theme === "light")}
              className="w-auto max-w-none min-w-[140px] px-4 py-2 text-sm"
              onClick={() => handleThemeChange("light")}
            >
              {t("appearance.light")}
            </BaseBtn>

            <BaseBtn
              variant={getToggleVariant(themeMounted && theme === "dark")}
              className="w-auto max-w-none min-w-[140px] px-4 py-2 text-sm"
              onClick={() => handleThemeChange("dark")}
            >
              {t("appearance.dark")}
            </BaseBtn>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-[var(--card-shadow)] backdrop-blur-md">
          <div className="mb-4">
            <h2 className="m-0 text-2xl font-semibold">{t("language.title")}</h2>
            <p className="m-0 mt-1 text-sm text-[var(--text-muted)]">{t("language.description")}</p>
          </div>

          <LanguageSwitcher />
        </div>

        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-[var(--card-shadow)] backdrop-blur-md">
          <div className="mb-4">
            <h2 className="m-0 text-2xl font-semibold">{t("game.title")}</h2>
            <p className="m-0 mt-1 text-sm text-[var(--text-muted)]">{t("game.description")}</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] p-4">
              <div className="mb-2 text-sm text-[var(--text-muted)]">{t("game.sound.title")}</div>

              <div className="flex flex-wrap gap-3">
                <BaseBtn
                  variant={getToggleVariant(settingsMounted && settings.soundEnabled)}
                  className="w-auto max-w-none min-w-[90px] px-4 py-2 text-sm"
                  onClick={() => setSoundEnabled(true)}
                >
                  {t("common.on")}
                </BaseBtn>

                <BaseBtn
                  variant={getToggleVariant(settingsMounted && !settings.soundEnabled)}
                  className="w-auto max-w-none min-w-[90px] px-4 py-2 text-sm"
                  onClick={() => setSoundEnabled(false)}
                >
                  {t("common.off")}
                </BaseBtn>
              </div>
            </div>

            <div>
              <BaseBtn
                variant="outline"
                className="w-auto max-w-none px-4 py-2 text-sm"
                onClick={handleResetSettings}
              >
                {t("game.reset")}
              </BaseBtn>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-bg)] p-5 shadow-[var(--card-shadow)] backdrop-blur-md xl:col-span-2">
          <div className="mb-4">
            <h2 className="m-0 text-2xl font-semibold text-[var(--danger-text)]">
              {t("account.title")}
            </h2>
            <p className="m-0 mt-1 text-sm text-[var(--text-muted)]">{t("account.description")}</p>
          </div>

          <BaseBtn
            variant="outline"
            className="w-auto max-w-none px-4 py-2 text-sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? t("account.loggingOut") : t("account.logout")}
          </BaseBtn>
        </div>
      </div>
    </section>
  );
}
