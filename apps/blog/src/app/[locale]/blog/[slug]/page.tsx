import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "~/components/mdx";
import { SoulCard } from "~/components/soul-card";
import { TableOfContents } from "~/components/toc";
import {
  getPostAuthors,
  getPostBySlug,
  getPostSoul,
  getPostsByLocale,
} from "~/lib/blog";
import { localePath } from "~/lib/constants";
import { routing } from "~/lib/i18n/routing";
import { ArticleJsonLd } from "~/lib/structured-data";

type PostPageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => {
    const posts = getPostsByLocale(locale);
    return posts.map((post) => ({
      locale,
      slug: post.slugAsParams,
    }));
  });
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const authors = getPostAuthors(post);

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: localePath(locale, `/blog/${slug}`),
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, localePath(l, `/blog/${slug}`)]),
        ),
        "x-default": localePath(routing.defaultLocale, `/blog/${slug}`),
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: authors.map((a) => a.name),
      images: post.image ? [{ url: post.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : [],
    },
  };
}

function useMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug, locale);
  const t = await getTranslations("blog");

  if (!post) {
    notFound();
  }

  const MDXContent = useMDXComponent(post.body);
  const authors = getPostAuthors(post);
  const soul = getPostSoul(post);

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        slug={post.slugAsParams}
        locale={locale}
        datePublished={post.date}
        {...(post.updated === undefined ? {} : { dateModified: post.updated })}
        authors={authors.map((a) => ({
          name: a.name,
          ...(a.twitter === undefined ? {} : { twitter: a.twitter }),
        }))}
        {...(post.image === undefined ? {} : { image: post.image })}
      />

      <Link
        href="/"
        className="mb-10 inline-block text-xs text-fg-muted underline underline-offset-4 hover:text-fg"
      >
        {t("backToBlog")}
      </Link>

      <header className="mb-10">
        <h1 className="mb-3 text-base font-medium leading-snug">
          {post.title}
        </h1>
        <p className="mb-4 text-sm text-fg-muted leading-relaxed">
          {post.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString(locale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
          {post.updated && (
            <span>
              ({t("updated")}{" "}
              {new Date(post.updated).toLocaleDateString(locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              )
            </span>
          )}
          <span>
            {post.readingTime} {t("minRead")}
          </span>
          {authors.length > 0 && (
            <>
              <span>&middot;</span>
              <span>{authors.map((a) => a.name).join(", ")}</span>
            </>
          )}
        </div>
      </header>

      <div className="flex gap-10">
        <article className="min-w-0 flex-1">
          <MDXContent components={mdxComponents} />
          {soul && <SoulCard soul={soul} />}
        </article>

        {post.toc && post.toc.length > 0 && (
          <aside className="hidden w-48 shrink-0 xl:block">
            <div className="sticky top-8">
              <TableOfContents items={post.toc} />
            </div>
          </aside>
        )}
      </div>
    </>
  );
}

export const dynamic = "force-static";
