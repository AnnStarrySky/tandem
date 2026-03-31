"use client";

import { useMemo, useState } from "react";

import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import type {
  CodeEditorQuestion,
  CodeEditorTask,
  PracticeCompleteResult,
} from "@/src/entities/practice";

import {
  calculateEarnedPoints,
  getNextDifficultyHref,
  getProgressPercent,
  normalizeCode,
} from "../lib";
import { PracticeResultModal } from "../resultModal";
import { PracticeTaskLayout } from "../task-layout";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[280px] items-center justify-center rounded-[18px] border border-white/10 bg-[rgba(17,24,39,0.55)] text-white/70">
      Loading editor...
    </div>
  ),
});

type Props = {
  task: CodeEditorTask;
  onComplete?: (result: PracticeCompleteResult) => void;
};

export function CodeEditorWidget({ task, onComplete }: Props) {
  const t = useTranslations("Practice");
  const router = useRouter();
  const pathname = usePathname();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [showHelp, setShowHelp] = useState(false);
  const [finished, setFinished] = useState(false);

  const total = task.questions.length;
  const currentQuestion = task.questions[currentQuestionIndex];
  const currentCode = answers[currentQuestion.id] ?? currentQuestion.starterCode;
  const isSubmitted = Boolean(submittedQuestions[currentQuestion.id]);

  const isCurrentCorrect = useMemo(() => {
    const normalizedCurrentCode = normalizeCode(currentCode);

    return currentQuestion.expectedAnswers.some(
      (answer) => normalizeCode(answer) === normalizedCurrentCode,
    );
  }, [currentCode, currentQuestion.expectedAnswers]);

  const score = useMemo(() => {
    return task.questions.reduce((acc, question) => {
      const code = answers[question.id];
      if (!code) return acc;

      const normalizedCurrentCode = normalizeCode(code);
      const isCorrect = question.expectedAnswers.some(
        (answer) => normalizeCode(answer) === normalizedCurrentCode,
      );

      return isCorrect ? acc + 1 : acc;
    }, 0);
  }, [answers, task.questions]);

  const correctAnswers = score;
  const wrongAnswers = total - correctAnswers;
  const earnedPoints = calculateEarnedPoints(score, total, task.points);
  const progressPercent = getProgressPercent(currentQuestionIndex, total);
  const nextHref = getNextDifficultyHref(pathname);

  function handleEditorChange(value?: string) {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value ?? "",
    }));

    setSubmittedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: false,
    }));
  }

  function handleSubmit() {
    setSubmittedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));
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
    setSubmittedQuestions({});
    setShowHelp(false);
    setFinished(false);
  }

  function handleNextLevel() {
    if (nextHref) {
      router.push(nextHref);
    }
  }

  function handleEditorWillMount(monaco: typeof import("monaco-editor")) {
    monaco.editor.defineTheme("codecat-arcade", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "b8c0ff" },
        { token: "keyword", foreground: "ff9cf0", fontStyle: "bold" },
        { token: "string", foreground: "8ff7ad" },
        { token: "number", foreground: "7ed8ff" },
        { token: "identifier", foreground: "ffffff" },
      ],
      colors: {
        "editor.background": "#2E1E77",
        "editorLineNumber.foreground": "#B8A8FF",
        "editorLineNumber.activeForeground": "#FFFFFF",
        "editorCursor.foreground": "#8FF7AD",
        "editor.selectionBackground": "#6C4DFF66",
        "editor.inactiveSelectionBackground": "#6C4DFF33",
        "editor.lineHighlightBackground": "#FFFFFF08",
        "editorIndentGuide.background1": "#FFFFFF12",
        "editorIndentGuide.activeBackground1": "#FFFFFF22",
      },
    });
  }

  function renderQuestionMeta(question: CodeEditorQuestion) {
    return (
      <>
        <h2 className="text-xl font-semibold md:text-2xl">{question.title}</h2>
        <p className="mt-2 text-white/85">{question.description}</p>

        <div className="mt-3 rounded-2xl bg-[rgba(255,255,255,0.06)] p-4 text-sm leading-6 text-white/90">
          {question.instructions}
        </div>

        {question.hint ? (
          <div className="mt-3 text-sm text-[#dbe6ff]">
            {t("hint")}: {question.hint}
          </div>
        ) : null}
      </>
    );
  }

  return (
    <>
      <PracticeTaskLayout
        badge={t("hard")}
        currentStep={currentQuestionIndex + 1}
        totalSteps={total}
        progressPercent={progressPercent}
        headerContent={
          <div className="mb-4 rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-4 text-white">
            <div className="mb-2 text-[11px] tracking-[0.28em] text-white/65 uppercase">
              {t("question")} {currentQuestionIndex + 1}
            </div>
            {renderQuestionMeta(currentQuestion)}
          </div>
        }
        mainContent={
          <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[rgba(17,24,39,0.35)] shadow-[0_10px_24px_rgba(0,0,0,0.14)]">
            <div className="flex items-center justify-between border-b border-white/10 bg-[rgba(255,255,255,0.06)] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff6b81]" />
                <span className="h-3 w-3 rounded-full bg-[#ffd166]" />
                <span className="h-3 w-3 rounded-full bg-[#84f59b]" />
              </div>

              <div className="text-sm font-medium text-white/80">solution.js</div>
            </div>

            <MonacoEditor
              height="300px"
              defaultLanguage="javascript"
              language="javascript"
              value={currentCode}
              beforeMount={handleEditorWillMount}
              onChange={handleEditorChange}
              theme="codecat-arcade"
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                lineHeight: 22,
                padding: { top: 14, bottom: 14 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
                renderLineHighlight: "all",
                roundedSelection: true,
                cursorBlinking: "smooth",
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>
        }
        helperContent={
          showHelp ? (
            <div className="rounded-2xl border border-[#84f59b]/45 bg-[rgba(132,245,155,0.16)] p-4 text-sm leading-6 text-white shadow-[0_8px_18px_rgba(132,245,155,0.10)]">
              <div className="mb-2 font-semibold">{t("expectedSolution")}:</div>

              <pre className="overflow-x-auto rounded-xl bg-[rgba(17,24,39,0.32)] p-4 text-sm text-white/95">
                <code>{currentQuestion.expectedAnswers[0]}</code>
              </pre>
            </div>
          ) : null
        }
        statusContent={
          isSubmitted ? (
            <div
              className={[
                "rounded-2xl p-4 text-sm shadow-[0_8px_18px_rgba(0,0,0,0.10)]",
                isCurrentCorrect
                  ? "border border-[#84f59b]/45 bg-[rgba(132,245,155,0.18)] text-[#ecfff1]"
                  : "border border-[#ff6b81]/45 bg-[rgba(255,107,129,0.18)] text-[#ffe9ee]",
              ].join(" ")}
            >
              {isCurrentCorrect ? t("solutionAccepted") : t("solutionMismatchHelp")}
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

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-[#13b2f6] to-[#84f59b] px-5 py-3 text-[15px] font-semibold text-white shadow-[0_10px_22px_rgba(19,178,246,0.22)] transition-transform duration-200 hover:translate-y-[-1px]"
              >
                {t("checkCode")}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-[#13b2f6] to-[#84f59b] px-5 py-3 text-[15px] font-semibold text-white shadow-[0_10px_22px_rgba(19,178,246,0.22)] transition-transform duration-200 hover:translate-y-[-1px]"
              >
                {currentQuestionIndex === total - 1 ? t("finish") : t("next")}
              </button>
            )}
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
