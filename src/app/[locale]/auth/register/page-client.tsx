"use client";

import React, { useMemo, useState } from "react";

import Image from "next/image";

import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@shared/lib";
import { ThemeToggle } from "@shared/ui";

import { Link, useRouter } from "../../../../i18n";
import { LanguageToggle } from "../ui";

type RegisterFormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterPageClient(): React.JSX.Element {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("AuthRegister");
  const tCommon = useTranslations("AuthCommon");

  const [form, setForm] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const callbackUrl = useMemo(() => {
    return `/${locale}/dashboard`;
  }, [locale]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorText(null);

    if (form.password !== form.confirmPassword) {
      setErrorText(t("errors.passwordMismatch"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          name: form.name.trim() || undefined,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (!response.ok) {
        setErrorText(data?.message ?? t("errors.registerFailed"));
        return;
      }

      const signInResult = await signIn("credentials", {
        redirect: false,
        email: form.email.trim(),
        password: form.password,
        callbackUrl,
      });

      if (!signInResult || signInResult.error) {
        router.replace("/auth/login");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : t("errors.unknown"));
    } finally {
      setLoading(false);
    }
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
          className="relative z-10 grid w-full max-w-[980px] overflow-hidden rounded-[32px] border backdrop-blur-2xl md:grid-cols-[0.95fr_1.05fr]"
          style={{
            borderColor: "var(--card-border)",
            background: "var(--card-bg)",
            boxShadow: "var(--card-shadow)",
          }}
        >
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
                  {tCommon("brand")}
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </div>

              <h2 className="text-3xl leading-tight font-semibold">{t("title")}</h2>
              <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                {t("subtitle")}
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">{t("name")}</label>
                  <input
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder={t("namePlaceholder")}
                    className={cn(
                      "h-12 w-full rounded-2xl border px-4 transition outline-none",
                      "focus:ring-4 focus:ring-fuchsia-400/15",
                    )}
                    style={{
                      borderColor: "var(--input-border)",
                      background: "var(--input-bg)",
                      color: "var(--text-main)",
                    }}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">{t("email")}</label>
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
                    placeholder={t("emailPlaceholder")}
                    required
                    className={cn(
                      "h-12 w-full rounded-2xl border px-4 transition outline-none",
                      "focus:ring-4 focus:ring-fuchsia-400/15",
                    )}
                    style={{
                      borderColor: "var(--input-border)",
                      background: "var(--input-bg)",
                      color: "var(--text-main)",
                    }}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">{t("password")}</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder={t("passwordPlaceholder")}
                    required
                    minLength={6}
                    className={cn(
                      "h-12 w-full rounded-2xl border px-4 transition outline-none",
                      "focus:ring-4 focus:ring-fuchsia-400/15",
                    )}
                    style={{
                      borderColor: "var(--input-border)",
                      background: "var(--input-bg)",
                      color: "var(--text-main)",
                    }}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">{t("confirmPassword")}</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder={t("confirmPasswordPlaceholder")}
                    required
                    minLength={6}
                    className={cn(
                      "h-12 w-full rounded-2xl border px-4 transition outline-none",
                      "focus:ring-4 focus:ring-fuchsia-400/15",
                    )}
                    style={{
                      borderColor: "var(--input-border)",
                      background: "var(--input-bg)",
                      color: "var(--text-main)",
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
                    background: "linear-gradient(90deg, #d946ef 0%, #0ea5e9 100%)",
                    boxShadow: "0 12px 30px rgba(217,70,239,0.22)",
                  }}
                >
                  {loading ? t("submitting") : t("submit")}
                </button>
              </form>

              <p className="mt-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                {t("hasAccount")}{" "}
                <Link href="/auth/login" className="font-medium underline underline-offset-4">
                  {t("loginLink")}
                </Link>
              </p>
            </div>
          </section>

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
                {tCommon("brand")}
              </div>

              <h1 className="mt-8 max-w-[420px] text-4xl leading-tight font-semibold">
                {t("heroTitle")}
              </h1>

              <p className="mt-4 max-w-[430px] text-base" style={{ color: "var(--text-muted)" }}>
                {t("heroText")}
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
        </div>
      </div>
    </main>
  );
}
