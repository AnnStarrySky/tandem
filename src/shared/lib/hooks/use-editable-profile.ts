"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { PROFILE_STORAGE_KEY } from "@shared/config/settings";

import type { EditableProfile } from "@shared/types";

function readProfile(initialProfile: EditableProfile): EditableProfile {
  if (typeof window === "undefined") {
    return initialProfile;
  }

  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);

    if (!raw) {
      return initialProfile;
    }

    const parsed = JSON.parse(raw) as Partial<EditableProfile>;

    return {
      name: parsed.name ?? initialProfile.name,
      email: parsed.email ?? initialProfile.email,
    };
  } catch {
    return initialProfile;
  }
}

function writeProfile(profile: EditableProfile) {
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function useEditableProfile(initialProfile: EditableProfile) {
  const [profile, setProfile] = useState<EditableProfile>(initialProfile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const nextProfile = readProfile(initialProfile);

    setProfile(nextProfile);
    setMounted(true);
  }, [initialProfile]);

  const updateProfile = useCallback((patch: Partial<EditableProfile>) => {
    setProfile((prev) => {
      const next = {
        ...prev,
        ...patch,
      };

      writeProfile(next);

      return next;
    });
  }, []);

  return useMemo(
    () => ({
      profile,
      mounted,
      updateProfile,
    }),
    [mounted, profile, updateProfile],
  );
}
