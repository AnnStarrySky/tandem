"use client";

import { useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import type {
  CodeCompletionQuestion,
  CodeCompletionTask,
  PracticeCompleteResult,
} from "@/entities/practice";
import { BaseBtn } from "@/shared/ui/button";
import { usePathname, useRouter } from "@i18n";

import {
  calculateEarnedPoints,
  getNextDifficultyHref,
  getProgressPercent,
  shuffleArray,
} from "../lib";
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
  const [retrySeed, setRetrySeed] = useState(0);

  const shuffledQuestions = useMemo(() => {
    void retrySeed;

    return task.questions.map((question) => ({
      ...question,
      options: shuffleArray([...question.options]),
    }));
  }, [task.questions, retrySeed]);

  const total = shuffledQuestions.length;
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion.id];
  const isLocked = Boolean(lockedQuestions[currentQuestion.id]);

  const score = useMemo(() => {
    return shuffledQuestions.reduce((acc, question) => {
      return answers[question.id] === question.correctAnswer ? acc + 1 : acc;
    }, 0);
  }, [answers, shuffledQuestions]);

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
    setRetrySeed((prev) => prev + 1);
  }

  function handleNextLevel() {
    if (nextHref) {
      router.push(nextHref);
    }
  }

  function handleBackToPractice() {
    router.push("/practice");
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
          "border-white/10 bg-[rgba(255,255,255,0.08)]",
          selected && !isLocked ? "practice-answer-selected" : "",
          correct ? "practice-answer-correct practice-answer-glow-correct" : "",
          wrong ? "practice-answer-wrong practice-answer-shake practice-answer-glow-wrong" : "",
          !isLocked ? "hover:-translate-y-0.5 hover:border-white/30" : "",
          isLocked ? "cursor-default" : "cursor-pointer",
        ].join(" ")}
      >
        <div className="flex items-center gap-4">
          <div
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
              "border-white/20 text-white/80",
              selected && !isLocked ? "bg-cyan-400/20 text-white" : "",
              correct ? "practice-answer-badge-correct" : "",
              wrong ? "practice-answer-badge-wrong" : "",
            ].join(" ")}
          >
            {correct ? "✓" : wrong ? "✕" : question.options.indexOf(option) + 1}
          </div>

          <span className="text-[15px] font-semibold">{option}</span>
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
                "rounded-2xl p-4 text-sm font-semibold shadow-[0_12px_28px_rgba(0,0,0,0.16)]",
                selectedAnswer === currentQuestion.correctAnswer
                  ? "practice-status-correct practice-answer-glow-correct"
                  : "practice-status-wrong practice-answer-shake",
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
            <BaseBtn
              onClick={() => setShowHelp((prev) => !prev)}
              className="w-full max-w-none rounded-2xl py-3 text-[15px]"
              fullWidth
            >
              {showHelp ? t("hideHelp") : t("help")}
            </BaseBtn>

            <BaseBtn
              onClick={handleNext}
              disabled={!isLocked}
              className="w-full max-w-none rounded-2xl py-3 text-[15px]"
              fullWidth
            >
              {currentQuestionIndex === total - 1 ? t("finish") : t("next")}
            </BaseBtn>
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
        onBackToPractice={!nextHref ? handleBackToPractice : undefined}
        onClose={handleRetry}
      />
    </>
  );
}
