"use client";
import { useRouter } from "next/navigation";

import { Typography } from "antd";
import { useTranslations } from "next-intl";

import { BaseBtn } from "@/src/shared/ui/button";
import { LevelImage } from "@/src/shared/ui/mainImage";
import { LessonWrapper } from "@/src/shared/ui/paragraph";
import { ProgressBar } from "@/src/widgets/progress";
import { ResultBar } from "@/src/widgets/result";

export default function Dashboard() {
  const translation = useTranslations("Dashboard");
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-between">
        <div className="flex w-[60%] flex-col gap-3">
          <Typography.Title level={2} style={{ margin: 0 }}>
            {translation("dashboardTitle")}
          </Typography.Title>
          <LessonWrapper lessonNumber={1} topicKey="arrays" />
          <ProgressBar progress={70} />
          <BaseBtn variant="primary" className="my-auto py-3 uppercase">
            {translation("startTraining")}
          </BaseBtn>
        </div>
        <LevelImage typeCat="hacker" alt="hacker" />
      </div>
      <ResultBar />
      <div>
        <BaseBtn variant="outline" className="mt-3" onClick={() => router.push("/")}>
          Back
        </BaseBtn>
      </div>
    </div>
  );
import React from "react";

import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions, AUTH_ROUTES } from "@shared/config/auth";

import Dashboard from "./dashboard-client";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props): Promise<React.JSX.Element> {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/${locale}${AUTH_ROUTES.signIn}`);
  }

  return <Dashboard />;
}
