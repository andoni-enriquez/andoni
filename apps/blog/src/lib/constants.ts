import { DEFAULT_LOCALE } from "~/lib/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://andonienri.com";
export const SITE_NAME = "andoni";

/** Build a locale-prefixed path respecting localePrefix: "as-needed". */
export function localePath(locale: string, path: string): string {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}
