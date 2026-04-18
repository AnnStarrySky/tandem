"use client";

import { useEffect, useMemo } from "react";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { BaseBtn } from "@/shared/ui/button";

type Props = {
  open?: boolean;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  total: number;
  earnedPoints: number;
  maxPoints: number;
  onRetry: () => void;
  onNextLevel?: () => void;
  onBackToPractice?: () => void;
  onClose?: () => void;
};

function getResultStatus(progress: number): "excellent" | "good" | "keepGoing" {
  if (progress >= 90) return "excellent";
  if (progress >= 60) return "good";

  return "keepGoing";
}

export function PracticeResultModal({
  open = true,
  score,
  correctAnswers,
  wrongAnswers,
  total,
  earnedPoints,
  maxPoints,
  onRetry,
  onNextLevel,
  onBackToPractice,
  onClose,
}: Props) {
  const t = useTranslations("Practice");
  const progress = total > 0 ? Math.round((score / total) * 100) : 0;

  const status = useMemo(() => getResultStatus(progress), [progress]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      confetti({
        particleCount: 140,
        spread: 90,
        startVelocity: 45,
        origin: { y: 0.35 },
      });

      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.65 },
      });

      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.65 },
      });
    }, 180);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  const showNextLevel = Boolean(onNextLevel);
  const showBackToPractice = !showNextLevel && Boolean(onBackToPractice);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label={t("closeModal")}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-[720px] overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,#c63ae6_0%,#6b38ff_48%,#4725d8_100%)] shadow-[0_24px_80px_rgba(39,12,90,0.45)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_42%)]" />

            <div className="relative p-3">
              <div className="rounded-[26px] border border-white/10 bg-[rgba(255,255,255,0.08)] p-6 text-white md:p-7">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 text-xs tracking-[0.24em] text-white/70 uppercase">
                      {t("gameCompleted")}
                    </div>

                    <h2 className="text-3xl font-semibold md:text-4xl">{t("yourResult")}</h2>
                  </div>

                  <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 uppercase">
                    {t(status)}
                  </div>
                </div>

                <div className="mb-5 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.08)] p-4">
                    <div className="text-sm text-white/70">{t("points")}</div>
                    <div className="mt-1 text-3xl font-semibold text-[#84f59b]">
                      {earnedPoints} / {maxPoints}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.08)] p-4">
                    <div className="text-sm text-white/70">{t("answers")}</div>
                    <div className="mt-1 text-3xl font-semibold">
                      {score} / {total}
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between text-sm text-white/75">
                    <span>{t("progress")}</span>
                    <span>{progress}%</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#13b2f6] to-[#84f59b]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.65, delay: 0.1 }}
                    />
                  </div>
                </div>

                <div className="mb-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#84f59b]/40 bg-[rgba(132,245,155,0.16)] p-4">
                    <div className="text-sm text-white/75">{t("correct")}</div>
                    <div className="mt-1 text-2xl font-semibold">{correctAnswers}</div>
                  </div>

                  <div className="rounded-2xl border border-[#ff6b81]/40 bg-[rgba(255,107,129,0.16)] p-4">
                    <div className="text-sm text-white/75">{t("wrong")}</div>
                    <div className="mt-1 text-2xl font-semibold">{wrongAnswers}</div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.08)] p-4">
                    <div className="text-sm text-white/75">{t("totalQuestions")}</div>
                    <div className="mt-1 text-2xl font-semibold">{total}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <BaseBtn
                    variant="outline"
                    onClick={onRetry}
                    className="max-w-none flex-1 border-white/15 bg-white/10 text-white hover:bg-white/15"
                    fullWidth
                  >
                    {t("tryAgain")}
                  </BaseBtn>

                  {showNextLevel ? (
                    <BaseBtn onClick={onNextLevel} className="max-w-none flex-1" fullWidth>
                      {t("nextLevel")}
                    </BaseBtn>
                  ) : null}

                  {showBackToPractice ? (
                    <BaseBtn
                      onClick={onBackToPractice}
                      className="max-w-none flex-1 bg-gradient-to-r from-[#13b2f6] to-[#84f59b] text-white"
                      fullWidth
                    >
                      {t("backToPractice")}
                    </BaseBtn>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
