import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getPostBySlug, getPostsByLocale } from "~/lib/blog";
import { routing } from "~/lib/i18n/routing";

type RouteParams = {
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
    const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
    return match ? raw.slice(match[0].length).trim() : raw.trim();
  } catch {
    return null;
  }
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) return new NextResponse("Not found", { status: 404 });

  const body = readMarkdownBody(slug, locale);
  if (body === null) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
}

export const dynamic = "force-static";
