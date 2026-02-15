import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "~/components/mdx";
import { TableOfContents } from "~/components/toc";
import { getSoulBySlug, getSoulsByLocale } from "~/lib/blog";
import { localePath } from "~/lib/constants";
import { routing } from "~/lib/i18n/routing";

type SoulPageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => {
    const souls = getSoulsByLocale(locale);
    return souls.map((soul) => ({
      locale,
      slug: soul.slugAsParams,
    }));
  });
}

export async function generateMetadata({
  params,
}: SoulPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const soul = getSoulBySlug(slug, locale);

  if (!soul || !soul.published) {
    return { title: "Soul Not Found" };
  }

  return {
    title: soul.name,
    description: soul.brief,
    alternates: {
      canonical: localePath(locale, `/soul/${slug}`),
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, localePath(l, `/soul/${slug}`)]),
        ),
        "x-default": localePath(routing.defaultLocale, `/soul/${slug}`),
      },
    },
  };
}

function useMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}

export default async function SoulPage({ params }: SoulPageProps) {
  const { slug, locale } = await params;
  const soul = getSoulBySlug(slug, locale);
  const t = await getTranslations("soul");

  if (!soul || !soul.published) {
    notFound();
  }

  const MDXContent = useMDXComponent(soul.body);

  return (
    <>
      <Link
        href="/"
        className="mb-10 inline-block text-xs text-fg-muted underline underline-offset-4 hover:text-fg"
      >
        {t("backToBlog")}
      </Link>

      <header className="mb-10">
        <h1 className="mb-3 text-lg font-medium leading-snug">{soul.name}</h1>
        <p className="mb-4 text-sm text-fg-muted leading-relaxed">
          {soul.brief}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted">
          <span>{soul.alias}</span>
          <span>&middot;</span>
          <span>{t("version", { version: soul.version })}</span>
          <span>&middot;</span>
          <time dateTime={soul.lastReflection}>
            {new Date(soul.lastReflection).toLocaleDateString(locale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
      </header>

      <div className="flex gap-10">
        <article className="min-w-0 flex-1">
          <MDXContent components={mdxComponents} />
        </article>

        {soul.toc && soul.toc.length > 0 && (
          <aside className="hidden w-48 shrink-0 xl:block">
            <div className="sticky top-8">
              <TableOfContents items={soul.toc} />
            </div>
          </aside>
        )}
      </div>
    </>
  );
}

export const dynamic = "force-static";
