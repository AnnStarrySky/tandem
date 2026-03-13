"use client";
import { useState } from "react";
import { Typography } from "antd";
import { TopicList, TopicDescription } from "@/src/shared/ui/glossary";
import { Topic } from "@/src/shared/types";
import { BaseBtn } from "@/src/shared/ui/button";

export default function GlossaryPage() {
  const [lang, setLang] = useState<"en" | "ru">("en");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const topics: Topic[] = [
    {
      id: 1,
      title: { en: "Data types", ru: "Типы данных" },
      description: {
        en: "<p>JavaScript has several data types: Number, String, Boolean, Null, Undefined, Object, Symbol.</p>",
        ru: "<p>В JavaScript есть несколько типов данных: Number, String, Boolean, Null, Undefined, Object, Symbol.</p>",
      },
      example: {
        en: "let age = 25;\nlet name = 'Alice';\nlet isActive = true;",
        ru: "let age = 25;\nlet name = 'Alice';\nlet isActive = true;",
      },
    },
    {
      id: 2,
      title: { en: "Functions", ru: "Функции" },
      description: {
        en: "<p>Functions are blocks of code designed to perform a particular task. You can define them using function declarations or arrow functions.</p>",
        ru: "<p>Функции — это блоки кода, предназначенные для выполнения определённой задачи. Их можно объявлять с помощью function или стрелочных функций.</p>",
      },
      example: {
        en: "function greet(name) {\n  return `Hello, ${name}`;\n}\n\nconst greetArrow = (name) => `Hello, ${name}`;",
        ru: "function greet(name) {\n  return `Привет, ${name}`;\n}\n\nconst greetArrow = (name) => `Привет, ${name}`;",
      },
    },
    {
      id: 3,
      title: { en: "Arrays and Objects", ru: "Массивы и объекты" },
      description: {
        en: "<p>Arrays store ordered collections of values. Objects store key-value pairs. You can access array elements by index and object properties by key.</p>",
        ru: "<p>Массивы хранят упорядоченные коллекции значений. Объекты хранят пары ключ-значение. Элементы массива доступны по индексу, свойства объекта — по ключу.</p>",
      },
      example: {
        en: "const numbers = [1, 2, 3];\nconst person = { name: 'Alice', age: 25 };",
        ru: "const numbers = [1, 2, 3];\nconst person = { name: 'Alice', age: 25 };",
      },
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Typography.Title level={2}>Glossary</Typography.Title>
      </div>

      <TopicList topics={topics} lang={lang} onSelect={setSelectedTopic} className="mt-6" />

      <BaseBtn
        variant="outline"
        className="mt-4"
        onClick={() => setLang(lang === "en" ? "ru" : "en")}
      >
        {lang === "en" ? "RU" : "EN"}
      </BaseBtn>

      {selectedTopic && <TopicDescription topic={selectedTopic} lang={lang} />}
    </div>
  );
}
