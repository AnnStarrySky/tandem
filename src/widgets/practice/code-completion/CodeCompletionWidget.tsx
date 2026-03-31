"use client";

import { useMemo, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import type {
  CodeCompletionQuestion,
  CodeCompletionTask,
  PracticeCompleteResult,
} from "@/src/entities/practice";

import { calculateEarnedPoints, getNextDifficultyHref, getProgressPercent } from "../lib";
import { PracticeResultModal } from "../resultModal";
import { PracticeTaskLayout } from "../task-layout";

type Props = {
  task: CodeCompletionTask;
  onComplete?: (result: PracticeCompleteResult) => void;
};

export function CodeCompletionWidget({ task, onComplete }: Props) {
  const t = useTranslations("Practice");
  const router = useRouter();
  const pathname = usePathname();

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
  const progressPercent = getProgressPercent(currentQuestionIndex, total);
  const nextHref = getNextDifficultyHref(pathname);

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
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
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

  return (
    <>
      <PracticeTaskLayout
        badge={t("medium")}
        currentStep={currentQuestionIndex + 1}
        totalSteps={total}
        progressPercent={progressPercent}
        headerContent={
          <div className="mb-4 rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.06)] px-5 py-6 text-center text-white">
            <div className="mb-2 text-[11px] tracking-[0.28em] text-white/65 uppercase">
              {t("question")} {currentQuestionIndex + 1}
            </div>

            <h2 className="text-xl font-semibold md:text-2xl">{currentQuestion.title}</h2>
            <p className="mt-2 text-white/80">{currentQuestion.description}</p>
          </div>
        }
        mainContent={
          <div className="grid gap-4">
            <pre className="overflow-x-auto rounded-[18px] border border-white/10 bg-[rgba(17,24,39,0.45)] p-4 text-sm leading-7 text-white">
              <code>{currentQuestion.code}</code>
            </pre>

            <div className="grid gap-3">
              {currentQuestion.options.map((option) => renderAnswerButton(currentQuestion, option))}
            </div>
          </div>
        }
        helperContent={
          showHelp ? (
            <div className="rounded-2xl border border-[#84f59b]/45 bg-[rgba(132,245,155,0.16)] p-4 text-sm leading-6 text-white shadow-[0_8px_18px_rgba(132,245,155,0.10)]">
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
          ) : null
        }
        statusContent={
          isLocked ? (
            <div
              className={[
                "rounded-2xl p-4 text-sm shadow-[0_8px_18px_rgba(0,0,0,0.10)]",
                selectedAnswer === currentQuestion.correctAnswer
                  ? "border border-[#84f59b]/45 bg-[rgba(132,245,155,0.18)] text-[#ecfff1]"
                  : "border border-[#ff6b81]/45 bg-[rgba(255,107,129,0.18)] text-[#ffe9ee]",
              ].join(" ")}
            >
              {selectedAnswer === currentQuestion.correctAnswer
                ? t("correctGreatJob")
                : `${t("wrongAnswer")} ${t("correctAnswer")}: ${currentQuestion.correctAnswer}`}
            </div>
          ) : null
        }
        footerContent={
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setShowHelp((prev) => !prev)}
              className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-[#13b2f6] to-[#84f59b] px-5 py-3 text-[15px] font-semibold text-white shadow-[0_10px_22px_rgba(19,178,246,0.22)] transition-transform duration-200 hover:translate-y-[-1px]"
            >
              {showHelp ? t("hideHelp") : t("help")}
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!isLocked}
              className={[
                "hover:translate-y-[-1px]w-full cursor-pointer rounded-2xl bg-gradient-to-r from-[#13b2f6] to-[#84f59b] px-5 py-3 text-[15px] font-semibold text-white shadow-[0_10px_22px_rgba(19,178,246,0.22)] transition-transform duration-200",
                !isLocked
                  ? "cursor-not-allowed bg-white/10 text-white/50 shadow-none"
                  : "bg-gradient-to-r from-[#13b2f6] to-[#84f59b] shadow-[0_10px_22px_rgba(19,178,246,0.22)] hover:translate-y-[-1px]",
              ].join(" ")}
            >
              {currentQuestionIndex === total - 1 ? t("finish") : t("next")}
            </button>
          </div>
        }
      />

      <PracticeResultModal
        open={finished}
        score={score}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        total={total}
        earnedPoints={earnedPoints}
        maxPoints={task.points}
        onRetry={handleRetry}
        onNextLevel={nextHref ? handleNextLevel : undefined}
        onClose={handleRetry}
      />
    </>
  );
}
