"use client";

import { useEffect, useMemo, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { getPracticeData, type PracticeTopic } from "@/entities/practice";
import { cn, isTopicFullyCompleted } from "@/shared/lib";
import { TaskStatGetReturn } from "@shared/types";
import { BaseBtn } from "@/shared/ui/button";
import { Icon } from "@/shared/ui/icon";
import { PracticeTopicCard } from "@/widgets/practice";

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
  const [statsData, setStatsData] = useState<TaskStatGetReturn>([]);

  useEffect(() => {
    fetch("/api/statistics/task")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStatsData(data);
      });
  }, []);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError(null);

    async function loadTopics() {
      try {
        const data = await getPracticeData(locale, "easy");

        if (!mounted) return;

        setTopics(data.topics);
        setError(null);
      } catch (err) {
        if (!mounted) return;

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
        <h1 className="text-4xl font-semibold text-[var(--text-main)] md:text-5xl">{t("title")}</h1>

        <p className="mt-3 max-w-3xl text-base text-[var(--text-main)] opacity-82 md:text-lg">
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
              <PracticeTopicCard
                key={topic.id}
                topic={topic}
                page={page}
                completed={isTopicFullyCompleted(topic.id, statsData)}
              />
            ))}
          </section>

          {totalPages > 1 ? (
            <div className="mt-2 flex items-center justify-center gap-3">
              <BaseBtn
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="flex h-10 w-10 max-w-none items-center justify-center rounded-xl p-0"
              >
                <Icon name="leftArrow" size={12} />
              </BaseBtn>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
                <BaseBtn
                  key={item}
                  variant={item === page ? "primary" : "outline"}
                  onClick={() => setPage(item)}
                  className={cn("h-10 w-10 max-w-none rounded-xl p-0 text-sm")}
                >
                  {item}
                </BaseBtn>
              ))}

              <BaseBtn
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="flex h-10 w-10 max-w-none items-center justify-center rounded-xl p-0"
              >
                <Icon name="rightArrow" size={12} />
              </BaseBtn>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
