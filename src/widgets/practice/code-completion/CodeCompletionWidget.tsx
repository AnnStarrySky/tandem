"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import type {
  CodeCompletionQuestion,
  CodeCompletionTask,
  PracticeCompleteResult,
} from "@/src/entities/practice";

import { getPracticeWideActionButtonClass } from "../lib";
import { PracticeResultModal } from "../resultModal";

type Props = {
  task: CodeCompletionTask;
  onComplete?: (result: PracticeCompleteResult) => void;
};

function calculateEarnedPoints(score: number, total: number, maxPoints: number): number {
  if (total === 0) return 0;
  return Math.round((score / total) * maxPoints);
}

function getNextDifficultyHref(pathname: string): string | null {
  if (pathname.endsWith("/easy")) return pathname.replace(/\/easy$/, "/medium");
  if (pathname.endsWith("/medium")) return pathname.replace(/\/medium$/, "/hard");
  return null;
}

export function CodeCompletionWidget({ task, onComplete }: Props) {
  const t = useTranslations("Practice");
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [lockedQuestions, setLockedQuestions] = useState<Record<string, boolean>>({});
  const [showHelp, setShowHelp] = useState(false);
  const [finished, setFinished] = useState(false);

  const total = task.questions.length;
  const currentQuestion = task.questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion.id];
  const isLocked = Boolean(lockedQuestions[currentQuestion.id]);

  const score = useMemo(() => {
    return task.questions.reduce((acc, question) => {
      return answers[question.id] === question.correctAnswer ? acc + 1 : acc;
    }, 0);
  }, [answers, task.questions]);

  const correctAnswers = score;
  const wrongAnswers = total - correctAnswers;
  const earnedPoints = calculateEarnedPoints(score, total, task.points);
  const progressPercent = Math.round(((currentQuestionIndex + 1) / total) * 100);

  function handleSelectAnswer(option: string) {
    if (isLocked) return;

    const isCorrectAnswer = option === currentQuestion.correctAnswer;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));

    setLockedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));

    if (isCorrectAnswer) {
      setShowHelp(false);
    }
  }

  function handleNext() {
    setShowHelp(false);

    if (currentQuestionIndex === total - 1) {
      const result: PracticeCompleteResult = {
        score,
        total,
        correctAnswers,
        wrongAnswers,
        answers,
      };

      setFinished(true);
      onComplete?.(result);
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
  }

  function handleRetry() {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setLockedQuestions({});
    setShowHelp(false);
    setFinished(false);
  }

  function handleNextLevel() {
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const nextHref = getNextDifficultyHref(pathname);

    if (nextHref) {
      router.push(nextHref);
    }
  }

  function renderAnswerButton(question: CodeCompletionQuestion, option: string) {
    const selected = answers[question.id] === option;
    const correct = isLocked && question.correctAnswer === option;
    const wrong = isLocked && selected && question.correctAnswer !== option;

    return (
      <button
        key={option}
        type="button"
        onClick={() => handleSelectAnswer(option)}
        disabled={isLocked}
        className={[
          "w-full rounded-[18px] border px-4 py-3 text-left transition-all duration-200",
          "text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]",
          selected
            ? "border-[#8ff7ad] bg-[rgba(143,247,173,0.18)] shadow-[0_0_0_1px_rgba(143,247,173,0.25),0_10px_22px_rgba(143,247,173,0.12)]"
            : "border-white/10 bg-[rgba(255,255,255,0.08)]",
          correct
            ? "border-[#8ff7ad] bg-[rgba(143,247,173,0.24)] shadow-[0_0_0_1px_rgba(143,247,173,0.28),0_12px_26px_rgba(143,247,173,0.14)]"
            : "",
          wrong
            ? "border-[#ff6b81] bg-[rgba(255,107,129,0.22)] shadow-[0_0_0_1px_rgba(255,107,129,0.30),0_12px_26px_rgba(255,107,129,0.12)]"
            : "",
          !isLocked ? "hover:-translate-y-0.5 hover:border-white/30" : "",
          isLocked ? "cursor-default" : "cursor-pointer",
        ].join(" ")}
      >
        <div className="flex items-center gap-4">
          <div
            className={[
              "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold",
              selected
                ? "border-[#8ff7ad] bg-[rgba(143,247,173,0.18)] text-white"
                : "border-white/20 text-white/80",
              correct ? "border-[#8ff7ad] bg-[rgba(143,247,173,0.24)] text-white" : "",
              wrong ? "border-[#ff6b81] bg-[rgba(255,107,129,0.20)] text-white" : "",
            ].join(" ")}
          >
            {question.options.indexOf(option) + 1}
          </div>

          <span className="text-[15px] font-medium">{option}</span>
        </div>
      </button>
    );
  }

  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const nextHref = getNextDifficultyHref(pathname);

  return (
    <>
      <section className="relative w-full rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#c63ae6_0%,#6b38ff_48%,#4725d8_100%)] p-3 shadow-[0_18px_40px_rgba(72,30,140,0.22)]">
        <div className="rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.05)] p-4 md:p-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div className="text-xs font-semibold tracking-[0.22em] text-white/75 uppercase">
              {t("medium")}
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white">
              {currentQuestionIndex + 1} / {total}
            </div>
          </div>

          <div className="mb-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#13b2f6] to-[#84f59b] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mb-4 rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.06)] px-5 py-6 text-center text-white">
            <div className="mb-2 text-[11px] tracking-[0.28em] text-white/65 uppercase">
              {t("question")} {currentQuestionIndex + 1}
            </div>

            <h2 className="text-xl font-semibold md:text-2xl">{currentQuestion.title}</h2>
            <p className="mt-2 text-white/80">{currentQuestion.description}</p>
          </div>

          <pre className="mb-4 overflow-x-auto rounded-[18px] border border-white/10 bg-[rgba(17,24,39,0.45)] p-4 text-sm leading-7 text-white">
            <code>{currentQuestion.code}</code>
          </pre>

          <div className="grid gap-3">
            {currentQuestion.options.map((option) => renderAnswerButton(currentQuestion, option))}
          </div>

          {showHelp ? (
            <div className="mt-4 rounded-2xl border border-[#84f59b]/45 bg-[rgba(132,245,155,0.16)] p-4 text-sm leading-6 text-white shadow-[0_8px_18px_rgba(132,245,155,0.10)]">
              {t("correctAnswer")}:{" "}
              <span className="font-semibold">{currentQuestion.correctAnswer}</span>
              {currentQuestion.hint ? (
                <div className="mt-2 text-white/90">
                  {t("hint")}: {currentQuestion.hint}
                </div>
              ) : null}
              {currentQuestion.explanation ? (
                <div className="mt-2 text-white/90">{currentQuestion.explanation}</div>
              ) : null}
            </div>
          ) : null}

          {isLocked ? (
            <div
              className={[
                "mt-4 rounded-2xl p-4 text-sm shadow-[0_8px_18px_rgba(0,0,0,0.10)]",
                selectedAnswer === currentQuestion.correctAnswer
                  ? "border border-[#84f59b]/45 bg-[rgba(132,245,155,0.18)] text-[#ecfff1]"
                  : "border border-[#ff6b81]/45 bg-[rgba(255,107,129,0.18)] text-[#ffe9ee]",
              ].join(" ")}
            >
              {selectedAnswer === currentQuestion.correctAnswer
                ? t("correctGreatJob")
                : `${t("wrongAnswer")} ${t("correctAnswer")}: ${currentQuestion.correctAnswer}`}
            </div>
          ) : null}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setShowHelp((prev) => !prev)}
              className={getPracticeWideActionButtonClass(false)}
            >
              {showHelp ? t("hideHelp") : t("help")}
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!isLocked}
              className={getPracticeWideActionButtonClass(!isLocked)}
            >
              {currentQuestionIndex === total - 1 ? t("finish") : t("next")}
            </button>
          </div>
        </div>
      </section>

      {finished ? (
        <PracticeResultModal
          score={score}
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
          total={total}
          earnedPoints={earnedPoints}
          maxPoints={task.points}
          onRetry={handleRetry}
          onNextLevel={nextHref ? handleNextLevel : undefined}
        />
      ) : null}
    </>
  );
}
