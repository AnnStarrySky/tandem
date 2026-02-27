import { twMerge } from "tailwind-merge";
type ClassDictionary = Record<string, boolean | undefined | null>;

export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassDictionary
  | ClassValue[];

export function classNames(...args: ClassValue[]): string {
  const result: string[] = [];

  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === "string" || typeof arg === "number") {
      result.push(String(arg));
      continue;
    }

    if (Array.isArray(arg)) {
      const nested = classNames(...arg);
      if (nested) result.push(nested);
      continue;
    }

    if (typeof arg === "object") {
      for (const key in arg) {
        if (arg[key]) result.push(key);
      }
    }
  }

  return twMerge(result.join(" "));
}

export const cn = classNames;
