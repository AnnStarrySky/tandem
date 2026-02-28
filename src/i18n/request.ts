import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  //TODO: Add logic for change locale
  const locale = "en";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
