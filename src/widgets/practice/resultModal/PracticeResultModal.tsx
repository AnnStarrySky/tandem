"use client";

type Props = {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  total: number;
  earnedPoints: number;
  maxPoints: number;
  onRetry: () => void;
};

export function PracticeResultModal({
  score,
  correctAnswers,
  wrongAnswers,
  total,
  earnedPoints,
  maxPoints,
  onRetry,
}: Props) {
  const progress = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-140 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#c63ae6_0%,#6b38ff_48%,#4725d8_100%)] p-3 shadow-[0_18px_40px_rgba(72,30,140,0.32)]">
        <div className="rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.08)] p-6 text-white">
          <div className="mb-2 text-center text-xs tracking-[0.25em] text-white/70 uppercase">
            Game completed
          </div>

          <h2 className="mb-5 text-center text-3xl font-semibold">Your result</h2>

          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.08)] p-4">
              <div className="text-sm text-white/70">Points</div>
              <div className="mt-1 text-3xl font-semibold text-[#84f59b]">
                {earnedPoints} / {maxPoints}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.08)] p-4">
              <div className="text-sm text-white/70">Answers</div>
              <div className="mt-1 text-3xl font-semibold">
                {score} / {total}
              </div>
            </div>
          </div>

          <div className="mb-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#13b2f6] to-[#84f59b]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#84f59b]/40 bg-[rgba(132,245,155,0.16)] p-4">
              <div className="text-sm text-white/75">Correct</div>
              <div className="mt-1 text-2xl font-semibold">{correctAnswers}</div>
            </div>

            <div className="rounded-2xl border border-[#ff6b81]/40 bg-[rgba(255,107,129,0.16)] p-4">
              <div className="text-sm text-white/75">Wrong</div>
              <div className="mt-1 text-2xl font-semibold">{wrongAnswers}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.08)] p-4">
              <div className="text-sm text-white/75">Total</div>
              <div className="mt-1 text-2xl font-semibold">{total}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onRetry}
            className="w-full rounded-2xl bg-gradient-to-r from-[#13b2f6] to-[#84f59b] px-5 py-3 text-[15px] font-semibold text-white shadow-[0_10px_22px_rgba(19,178,246,0.22)] transition-transform duration-200 hover:translate-y-[-1px]"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
