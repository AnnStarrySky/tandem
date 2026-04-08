"use client";

import { useState } from "react";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { useUiSound } from "@shared/lib/hooks";

type PasswordResponse = {
  success: boolean;
  message?: string;
};

type NoticeState = {
  type: "success" | "error";
  text: string;
} | null;

export function usePasswordForm() {
  const t = useTranslations("Settings");
  const { data: session } = useSession();
  const { playClickSound } = useUiSound();

  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [isEditing, setIsEditing] = useState(false);

  function startEdit() {
    playClickSound();
    setIsEditing(true);
    setNotice(null);
  }

  function cancelEdit() {
    playClickSound();
    setCurrentPassword("");
    setNextPassword("");
    setConfirmPassword("");
    setIsEditing(false);
    setNotice(null);
  }

  async function save() {
    setNotice(null);

    const currentEmail = (session?.user?.email ?? "").trim().toLowerCase();

    if (!currentEmail || !currentPassword || !nextPassword || !confirmPassword) {
      setNotice({
        type: "error",
        text: t("passwordValidationRequired"),
      });
      return;
    }

    if (nextPassword.length < 6) {
      setNotice({
        type: "error",
        text: t("passwordValidationLength"),
      });
      return;
    }

    if (nextPassword !== confirmPassword) {
      setNotice({
        type: "error",
        text: t("passwordValidationMatch"),
      });
      return;
    }

    setLoading(true);

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
        setNotice({
          type: "error",
          text: data.message ?? t("passwordChangeError"),
        });
        return;
      }

      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
      setIsEditing(false);

      playClickSound();

      setNotice({
        type: "success",
        text: t("passwordChangeSuccess"),
      });
    } catch {
      setNotice({
        type: "error",
        text: t("passwordChangeError"),
      });
    } finally {
      setLoading(false);
    }
  }

  return {
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
  };
}
