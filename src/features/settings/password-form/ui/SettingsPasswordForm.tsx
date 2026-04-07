"use client";

import { useTranslations } from "next-intl";

import { BaseBtn } from "@shared/ui/button";

import { usePasswordForm } from "../model";

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="block h-5 w-5 shrink-0"
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

const cardClass =
  "rounded-[28px] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-[var(--card-shadow)] md:p-7";

const inputCardBaseClass =
  "rounded-[22px] border bg-[var(--input-bg)] p-4 transition-all duration-200";

const inputClass =
  "w-full border-none bg-transparent text-lg text-[var(--text-main)] outline-none placeholder:text-[var(--input-placeholder)] disabled:cursor-default disabled:opacity-100";

const noticeBaseClass =
  "mt-4 rounded-2xl border px-4 py-3 text-sm leading-6 transition-all duration-300";

export function SettingsPasswordForm() {
  const t = useTranslations("Settings");
  const {
    currentPassword,
    setCurrentPassword,
    nextPassword,
    setNextPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    notice,
    isEditing,
    startEdit,
    cancelEdit,
    save,
  } = usePasswordForm();

  return (
    <section className={cardClass}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[28px] leading-tight font-bold text-[var(--text-main)]">
            {t("securityTitle")}
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            {t("securityDescription")}
          </p>
        </div>

        <BaseBtn
          variant="outline"
          className="inline-flex h-11 w-11 max-w-none items-center justify-center rounded-2xl p-0 leading-none"
          data-sound-ignore="true"
          onClick={startEdit}
          aria-label={t("editSecurity")}
          title={t("editSecurity")}
        >
          <EditIcon />
        </BaseBtn>
      </div>

      <div className="mt-6 grid gap-4">
        <label
          className={`${inputCardBaseClass} ${
            isEditing
              ? "border-[rgba(19,178,246,0.35)] shadow-[0_0_0_3px_rgba(19,178,246,0.08)]"
              : "border-[var(--card-border)]"
          }`}
        >
          <div className="mb-2 text-sm font-medium text-[var(--text-muted)]">
            {t("currentPasswordLabel")}
          </div>
          <input
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            disabled={!isEditing}
            className={inputClass}
            type="password"
            placeholder={t("currentPasswordPlaceholder")}
          />
        </label>

        <label
          className={`${inputCardBaseClass} ${
            isEditing
              ? "border-[rgba(19,178,246,0.35)] shadow-[0_0_0_3px_rgba(19,178,246,0.08)]"
              : "border-[var(--card-border)]"
          }`}
        >
          <div className="mb-2 text-sm font-medium text-[var(--text-muted)]">
            {t("newPasswordLabel")}
          </div>
          <input
            value={nextPassword}
            onChange={(event) => setNextPassword(event.target.value)}
            disabled={!isEditing}
            className={inputClass}
            type="password"
            placeholder={t("newPasswordPlaceholder")}
          />
        </label>

        <label
          className={`${inputCardBaseClass} ${
            isEditing
              ? "border-[rgba(19,178,246,0.35)] shadow-[0_0_0_3px_rgba(19,178,246,0.08)]"
              : "border-[var(--card-border)]"
          }`}
        >
          <div className="mb-2 text-sm font-medium text-[var(--text-muted)]">
            {t("confirmPasswordLabel")}
          </div>
          <input
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={!isEditing}
            className={inputClass}
            type="password"
            placeholder={t("confirmPasswordPlaceholder")}
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col items-start gap-3">
        <BaseBtn
          variant="primary"
          className="w-65 max-w-full text-[18px]"
          onClick={save}
          disabled={loading || !isEditing}
          loading={loading}
          data-sound-ignore="true"
        >
          {loading ? t("changingPassword") : t("changePassword")}
        </BaseBtn>

        {isEditing ? (
          <BaseBtn
            variant="outline"
            className="w-65 max-w-full text-[18px]"
            onClick={cancelEdit}
            data-sound-ignore="true"
          >
            {t("cancel")}
          </BaseBtn>
        ) : null}
      </div>

      {notice ? (
        <div
          className={`${noticeBaseClass} ${
            notice.type === "success"
              ? "border-[var(--card-border)] bg-[var(--input-bg)] text-[var(--text-main)]"
              : "border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger-text)]"
          }`}
        >
          {notice.text}
        </div>
      ) : null}
    </section>
  );
}
