"use client";

import { useTranslations } from "next-intl";

import { BaseBtn } from "@shared/ui/button";

import { useProfileForm } from "../model";

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

export function SettingsProfileForm() {
  const t = useTranslations("Settings");
  const {
    mounted,
    draft,
    setDraft,
    loading,
    notice,
    changed,
    canEdit,
    isEditingName,
    isEditingEmail,
    startEditName,
    startEditEmail,
    cancelEdit,
    save,
    logout,
  } = useProfileForm();

  if (!mounted) {
    return <div className={`${cardClass} min-h-60 animate-pulse`} />;
  }

  return (
    <section className={cardClass}>
      <div>
        <h2 className="text-[28px] leading-tight font-bold text-[var(--text-main)]">
          {t("profileTitle")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{t("profileDescription")}</p>
      </div>

      <div className="mt-6 grid gap-4">
        <label
          className={`${inputCardBaseClass} ${
            isEditingName
              ? "border-[rgba(19,178,246,0.35)] shadow-[0_0_0_3px_rgba(19,178,246,0.08)]"
              : "border-[var(--card-border)]"
          }`}
        >
          <div className="mb-2 text-sm font-medium text-[var(--text-muted)]">{t("nameLabel")}</div>

          <div className="flex items-center gap-3">
            <input
              value={draft.name}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              disabled={!isEditingName}
              className={inputClass}
              placeholder={t("namePlaceholder")}
            />

            <BaseBtn
              variant="outline"
              className="inline-flex h-11 w-11 max-w-none items-center justify-center rounded-2xl p-0 leading-none"
              data-sound-ignore="true"
              onClick={startEditName}
              aria-label={t("editName")}
              title={t("editName")}
            >
              <EditIcon />
            </BaseBtn>
          </div>
        </label>

        <label
          className={`${inputCardBaseClass} ${
            isEditingEmail
              ? "border-[rgba(19,178,246,0.35)] shadow-[0_0_0_3px_rgba(19,178,246,0.08)]"
              : "border-[var(--card-border)]"
          }`}
        >
          <div className="mb-2 text-sm font-medium text-[var(--text-muted)]">{t("emailLabel")}</div>

          <div className="flex items-center gap-3">
            <input
              value={draft.email}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              disabled={!isEditingEmail}
              className={inputClass}
              placeholder={t("emailPlaceholder")}
              type="email"
            />

            <BaseBtn
              variant="outline"
              className="inline-flex h-11 w-11 max-w-none items-center justify-center rounded-2xl p-0 leading-none"
              data-sound-ignore="true"
              onClick={startEditEmail}
              aria-label={t("editEmail")}
              title={t("editEmail")}
            >
              <EditIcon />
            </BaseBtn>
          </div>
        </label>
      </div>

      <div className="mt-6 flex flex-col items-start gap-3">
        <BaseBtn
          variant="primary"
          className="w-60 max-w-full text-[18px]"
          onClick={save}
          disabled={!changed || !canEdit || loading}
          loading={loading}
          data-sound-ignore="true"
        >
          {loading ? t("saving") : t("saveProfile")}
        </BaseBtn>

        {canEdit ? (
          <BaseBtn
            variant="outline"
            className="w-60 max-w-full text-[18px]"
            onClick={cancelEdit}
            data-sound-ignore="true"
          >
            {t("cancel")}
          </BaseBtn>
        ) : null}

        <BaseBtn
          variant="outline"
          className="w-60 max-w-full border-[rgba(220,38,38,0.25)] text-[18px] text-red-600 transition-all duration-200 hover:border-[rgba(220,38,38,0.45)] hover:bg-red-50 hover:text-red-700 dark:text-red-300 dark:hover:bg-red-500/10 dark:hover:text-red-200"
          data-sound-ignore="true"
          onClick={logout}
        >
          {t("logout")}
        </BaseBtn>
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
