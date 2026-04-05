"use client";

import React from "react";

import { LanguageToggle as SharedLanguageToggle } from "@/src/shared/ui";

export function LanguageToggle(): React.JSX.Element {
  return <SharedLanguageToggle variant="segmented" />;
}
