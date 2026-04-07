"use client";

import { useEffect, useMemo, useState } from "react";

import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { useUiSound } from "@shared/lib/hooks";

import { useEditableProfile } from "./use-editable-profile";

type ProfileResponse = {
  success: boolean;
  message?: string;
  user?: {
    id: number;
    name?: string | null;
    email?: string | null;
  };
};

type NoticeState = {
  type: "success" | "error";
  text: string;
} | null;

export function useProfileForm() {
  const t = useTranslations("Settings");
  const { data: session, update } = useSession();
  const { playClickSound } = useUiSound();

  const initialProfile = useMemo(
    () => ({
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
    }),
    [session?.user?.email, session?.user?.name],
  );

  const { profile, mounted, updateProfile } = useEditableProfile(initialProfile);

  const [draft, setDraft] = useState(initialProfile);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  useEffect(() => {
    setDraft(initialProfile);
  }, [initialProfile]);

  const changed =
    draft.name.trim() !== (profile.name ?? "").trim() ||
    draft.email.trim() !== (profile.email ?? "").trim();

  const canEdit = isEditingName || isEditingEmail;

  function startEditName() {
    playClickSound();
    setIsEditingName(true);
    setNotice(null);
  }

  function startEditEmail() {
    playClickSound();
    setIsEditingEmail(true);
    setNotice(null);
  }

  function cancelEdit() {
    playClickSound();
    setDraft({
      name: profile.name ?? "",
      email: profile.email ?? "",
    });
    setIsEditingName(false);
    setIsEditingEmail(false);
    setNotice(null);
  }

  async function save() {
    setNotice(null);

    const trimmedName = draft.name.trim();
    const trimmedEmail = draft.email.trim().toLowerCase();
    const currentEmail = (profile.email ?? session?.user?.email ?? "").trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !currentEmail) {
      setNotice({
        type: "error",
        text: t("profileValidation"),
      });
      return;
    }

    setLoading(true);

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
        setNotice({
          type: "error",
          text: data.message ?? t("profileSaveError"),
        });
        return;
      }

      updateProfile({
        name: data.user.name ?? trimmedName,
        email: data.user.email ?? trimmedEmail,
      });

      setDraft({
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

      setNotice({
        type: "success",
        text: t("profileSaveSuccess"),
      });
    } catch {
      setNotice({
        type: "error",
        text: t("profileSaveError"),
      });
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    playClickSound();
    await signOut({ callbackUrl: "/" });
  }

  return {
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
  };
}
