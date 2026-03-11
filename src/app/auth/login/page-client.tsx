"use client";

import React, { useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { cn } from "@shared/lib";

import { ThemeToggle } from "../ui";

type LoginFormState = {
  email: string;
  password: string;
};

export function LoginPageClient(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = useMemo(() => {
    return searchParams.get("callbackUrl") ?? searchParams.get("from") ?? "/dashboard";
  }, [searchParams]);

  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setErrorText(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: form.email.trim(),
        password: form.password,
        callbackUrl,
      });

      if (!result) {
        setErrorText("Не удалось выполнить вход");
        return;
      }

      if (result.error) {
        setErrorText("Неверный email или пароль");
        return;
      }

      router.replace(result.url ?? callbackUrl);
      router.refresh();
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  async function handleGitHubSignIn() {
    setErrorText(null);
    await signIn("github", { callbackUrl });
  }

  async function handleGoogleSignIn() {
    setErrorText(null);
    await signIn("google", { callbackUrl });
  }

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute top-[-120px] left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute bottom-[-100px] left-[-20px] h-[260px] w-[260px] rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute top-[28%] right-[-20px] h-[260px] w-[260px] rounded-full bg-emerald-400/15 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1200px] items-center justify-center px-4 py-4 md:py-6">
        <div
          className="relative z-10 grid w-full max-w-[980px] overflow-hidden rounded-[32px] border backdrop-blur-2xl md:grid-cols-[1.05fr_0.95fr]"
          style={{
            borderColor: "var(--card-border)",
            background: "var(--card-bg)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <section className="relative hidden min-h-[620px] overflow-hidden p-8 md:flex md:flex-col md:justify-between">
            <div>
              <div
                className="inline-flex rounded-full border px-4 py-2 text-sm font-medium"
                style={{
                  borderColor: "var(--card-border)",
                  background: "rgba(255,255,255,0.04)",
                  color: "var(--text-main)",
                }}
              >
                CodeCat
              </div>

              <h1 className="mt-8 max-w-[420px] text-4xl leading-tight font-semibold">
                Войди и продолжай обучение в своём темпе
              </h1>

              <p className="mt-4 max-w-[430px] text-base" style={{ color: "var(--text-muted)" }}>
                Тренируй JS, TS и алгоритмы в интерактивном формате. Сохраняй прогресс и переходи к
                практике.
              </p>
            </div>

            <div className="mx-auto flex w-full max-w-[420px] items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 scale-95 rounded-[48px] bg-cyan-300/10 blur-3xl" />
                <div className="absolute inset-0 scale-90 rounded-[48px] bg-fuchsia-300/10 blur-3xl" />

                <Image
                  src="/cat.png"
                  alt="CodeCat"
                  width={380}
                  height={380}
                  priority
                  className="relative z-10 h-auto w-auto object-contain opacity-95 drop-shadow-[0_24px_48px_rgba(0,0,0,0.20)]"
                  style={{
                    maskImage: "radial-gradient(circle at center, black 70%, transparent 98%)",
                    WebkitMaskImage:
                      "radial-gradient(circle at center, black 70%, transparent 98%)",
                  }}
                />
              </div>
            </div>
          </section>

          <section className="flex min-h-[620px] items-center justify-center p-5 sm:p-8">
            <div className="w-full max-w-[420px]">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div
                  className="inline-flex rounded-full border px-4 py-2 text-sm font-medium md:hidden"
                  style={{
                    borderColor: "var(--card-border)",
                    background: "rgba(255,255,255,0.04)",
                    color: "var(--text-main)",
                  }}
                >
                  CodeCat
                </div>

                <div className="ml-auto">
                  <ThemeToggle />
                </div>
              </div>

              <h2 className="text-3xl leading-tight font-semibold">Приветствую !</h2>
              <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                Введи email и пароль, чтобы перейти в профиль
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="you@example.com"
                    required
                    className={cn(
                      "h-12 w-full rounded-2xl border px-4 transition outline-none",
                      "focus:ring-4 focus:ring-cyan-400/15",
                    )}
                    style={{
                      borderColor: "var(--input-border)",
                      background: "var(--input-bg)",
                      color: "var(--text-main)",
                      boxShadow: "none",
                    }}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Пароль</label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="••••••••"
                    required
                    className={cn(
                      "h-12 w-full rounded-2xl border px-4 transition outline-none",
                      "focus:ring-4 focus:ring-cyan-400/15",
                    )}
                    style={{
                      borderColor: "var(--input-border)",
                      background: "var(--input-bg)",
                      color: "var(--text-main)",
                      boxShadow: "none",
                    }}
                  />
                </div>

                {errorText ? (
                  <div
                    className="rounded-2xl border px-4 py-3 text-sm"
                    style={{
                      borderColor: "var(--danger-border)",
                      background: "var(--danger-bg)",
                      color: "var(--danger-text)",
                    }}
                  >
                    {errorText}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "h-12 w-full rounded-2xl px-5 text-base font-semibold text-white shadow-lg transition",
                    "hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
                  )}
                  style={{
                    background: "linear-gradient(90deg, #0ea5e9 0%, #10b981 100%)",
                    boxShadow: "0 12px 30px rgba(14,165,233,0.22)",
                  }}
                >
                  {loading ? "Входим..." : "Войти"}
                </button>
              </form>

              <div className="mt-6">
                <div
                  className="relative py-3 text-center text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span className="relative z-10 bg-transparent px-3">или</span>
                </div>

                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={handleGitHubSignIn}
                    className="h-12 rounded-2xl border px-4 text-sm font-medium transition"
                    style={{
                      borderColor: "var(--card-border)",
                      background: "var(--input-bg)",
                      color: "var(--text-main)",
                    }}
                  >
                    Войти через GitHub
                  </button>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="h-12 rounded-2xl border px-4 text-sm font-medium transition"
                    style={{
                      borderColor: "var(--card-border)",
                      background: "var(--input-bg)",
                      color: "var(--text-main)",
                    }}
                  >
                    Войти через Gmail
                  </button>
                </div>
              </div>

              <p className="mt-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                Нет аккаунта?{" "}
                <Link href="/auth/register" className="font-medium underline underline-offset-4">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
