import type { AbstractIntlMessages } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "~/lib/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !LOCALES.includes(locale as Locale)) locale = DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`./${locale}.json`))
      .default as AbstractIntlMessages,
  };
});
