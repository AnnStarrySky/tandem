"use client";

import dynamic from "next/dynamic";
import { Typography } from "antd";
import { cn } from "../../lib";
import { Topic } from "./Topic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full animate-pulse rounded-lg bg-[#2e2e2e]/50" />,
});

const defineTheme = (monaco: any) => {
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
    colors: { "editor.background": "#2e2e2e" },
  });
};

export const TopicDescription = ({ topic, className }: { topic: Topic; className?: string }) => {
  return (
    <div
      className={cn(
        "mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-[var(--card-shadow)]",
        className,
      )}
    >
      <Typography.Title level={3} className="!text-[var(--text-main)]">
        {topic.title}
      </Typography.Title>

      <div
        dangerouslySetInnerHTML={{ __html: topic.description }}
        className="mb-4 text-[var(--text-main)]"
      />

      <div className="overflow-hidden rounded-lg border border-[var(--card-border)] bg-[#2e2e2e]">
        <MonacoEditor
          height="220px"
          defaultLanguage="javascript"
          value={topic.example}
          theme="codecat-arcade"
          beforeMount={defineTheme}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 22,
            padding: { top: 12, bottom: 12 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
            folding: false,
            renderLineHighlight: "none",
            fixedOverflowWidgets: true,
            scrollbar: {
              vertical: "hidden",
              horizontal: "hidden",
              handleMouseWheel: false,
              alwaysConsumeMouseWheel: false,
            },
            overviewRulerLanes: 0,
          }}
        />
      </div>
    </div>
  );
};
