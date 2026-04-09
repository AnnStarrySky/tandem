import type { AppMessages } from "@/i18n/messages";

declare module "next-intl" {
  interface AppConfig {
    Messages: AppMessages;
  }
}
