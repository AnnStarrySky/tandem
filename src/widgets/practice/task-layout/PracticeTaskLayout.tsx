"use client";

import type { ReactNode } from "react";

type Props = {
  badge: string;
  currentStep: number;
  totalSteps: number;
  progressPercent: number;
  headerContent: ReactNode;
  mainContent: ReactNode;
  footerContent: ReactNode;
  helperContent?: ReactNode;
  statusContent?: ReactNode;
};

export function PracticeTaskLayout({
  badge,
  currentStep,
  totalSteps,
  progressPercent,
  headerContent,
  mainContent,
  footerContent,
  helperContent,
  statusContent,
}: Props) {
  return (
    <section className="relative w-full rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#c63ae6_0%,#6b38ff_48%,#4725d8_100%)] p-3 shadow-[0_18px_40px_rgba(72,30,140,0.22)]">
      <div className="rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.05)] p-4 md:p-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="text-xs font-semibold tracking-[0.22em] text-white/75 uppercase">
            {badge}
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white">
            {currentStep} / {totalSteps}
          </div>
        </div>

        <div className="mb-5 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-linear-to-r from-[#13b2f6] to-[#84f59b] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {headerContent}

        {mainContent}

        {helperContent ? <div className="mt-4">{helperContent}</div> : null}

        {statusContent ? <div className="mt-4">{statusContent}</div> : null}

        <div className="mt-5">{footerContent}</div>
      </div>
    </section>
  );
}
