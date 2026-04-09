"use client";

import {
  SettingsPasswordForm,
  SettingsPreferencesForm,
  SettingsProfileForm,
} from "@features/settings";

export default function SettingsClient() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <SettingsProfileForm />
      <SettingsPasswordForm />
      <div className="xl:col-span-2">
        <SettingsPreferencesForm />
      </div>
    </div>
  );
}
