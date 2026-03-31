"use client";

import { useEffect, useMemo, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import type { PracticeTopic } from "@/src/entities/practice";
import { getPracticeData } from "@/src/entities/practice";
import { cn } from "@/src/shared/lib";
import { BaseBtn } from "@/src/shared/ui/button";
import { Icon } from "@/src/shared/ui/icon";
import { PracticeTopicCard } from "@/src/widgets/practice";

const PAGE_SIZE = 9;

export default function PracticePage() {
  const t = useTranslations("Practice");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [topics, setTopics] = useState<PracticeTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError(null);

    async function loadTopics() {
      try {
        const data = await getPracticeData(locale, "easy");

        if (!mounted) {
          return;
        }

        setTopics(data.topics);
        setError(null);
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Failed to load practice data");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadTopics();

    return () => {
      mounted = false;
    };
  }, [locale]);

  const totalPages = Math.max(1, Math.ceil(topics.length / PAGE_SIZE));

  const rawPage = Number(searchParams.get("page") ?? "1");
  const page = Number.isFinite(rawPage) ? Math.min(Math.max(rawPage, 1), totalPages) : 1;

  const currentTopics = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return topics.slice(start, start + PAGE_SIZE);
  }, [page, topics]);

  function setPage(nextPage: number) {
    const normalizedPage = Math.min(Math.max(nextPage, 1), totalPages);
    const params = new URLSearchParams(searchParams.toString());

    if (normalizedPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(normalizedPage));
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="grid gap-8">
      <section>
        <h1 className="text-4xl font-semibold md:text-5xl" style={{ color: "var(--text-main)" }}>
          {t("title")}
        </h1>

        <p
          className="mt-3 max-w-3xl text-base md:text-lg"
          style={{ color: "var(--text-main)", opacity: 0.82 }}
        >
          {t("subtitle")}
        </p>
      </section>

      {loading ? (
        <div className="text-slate-600 dark:text-slate-300">{t("loadingTopics")}</div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          Failed to load practice data: {error}
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          <section className="grid auto-rows-[1fr] gap-6 md:grid-cols-2 xl:grid-cols-3">
            {currentTopics.map((topic) => (
              <PracticeTopicCard key={topic.id} topic={topic} page={page} />
            ))}
          </section>

          {totalPages > 1 ? (
            <div className="mt-2 flex items-center justify-center gap-3">
              <BaseBtn
                variant="primary"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white p-0 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                style={{ color: "var(--text-main)" }}
              >
                <Icon name="leftArrow" size={12} color="currentColor" />
              </BaseBtn>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
                <BaseBtn
                  key={item}
                  variant="primary"
                  onClick={() => setPage(item)}
                  className={cn(
                    "h-10 w-10 rounded-xl p-0 text-sm shadow-sm transition",
                    item === page
                      ? "border-transparent bg-linear-to-r from-[#13b2f6] to-[#84f59b] text-white"
                      : "border border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
                  )}
                  style={item === page ? undefined : { color: "var(--text-main)" }}
                >
                  {item}
                </BaseBtn>
              ))}

              <BaseBtn
                variant="primary"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white p-0 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                style={{ color: "var(--text-main)" }}
              >
                <Icon name="rightArrow" size={12} color="currentColor" />
              </BaseBtn>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
