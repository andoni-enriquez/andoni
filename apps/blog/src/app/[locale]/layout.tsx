import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { WebSiteJsonLd } from "~/lib/structured-data";
import "@andoni/tailwind-config";

const mono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "andoni",
    template: "%s — andoni",
  },
  description:
    "Building with a soul — documenting the process, the thinking, and everything in between.",
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={mono.variable}>
      <head>
        <WebSiteJsonLd locale={locale} />
      </head>

      <body className="font-mono">
        <NextIntlClientProvider messages={messages}>
          <main className="max-w-160 px-6 py-8">{props.children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
