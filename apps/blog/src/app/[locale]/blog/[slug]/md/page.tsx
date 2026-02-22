import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPostBySlug, getPostsByLocale } from "~/lib/blog";
import { routing } from "~/lib/i18n/routing";

type MarkdownPageProps = {
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
}: MarkdownPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} (Markdown)`,
    robots: { index: false },
  };
}

function readMarkdownBody(slug: string, locale: string): string | null {
  const filePath = path.join(
    process.cwd(),
    "content",
    "blog",
    locale,
    `${slug}.mdx`,
  );

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    // Strip YAML frontmatter
    const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
    return match ? raw.slice(match[0].length).trim() : raw.trim();
  } catch {
    return null;
  }
}

export default async function MarkdownPage({ params }: MarkdownPageProps) {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug, locale);
  const t = await getTranslations("blog");

  if (!post) {
    notFound();
  }

  const body = readMarkdownBody(slug, locale);

  if (body === null) {
    notFound();
  }

  return (
    <>
      <Link
        href={`/blog/${slug}`}
        className="mb-10 inline-block text-xs text-fg-muted underline underline-offset-4 hover:text-fg"
      >
        {t("backToBlog")}
      </Link>

      <h1 className="mb-6 text-base font-medium leading-snug">{post.title}</h1>

      <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-fg-muted">
        {body}
      </pre>
    </>
  );
}

export const dynamic = "force-static";
