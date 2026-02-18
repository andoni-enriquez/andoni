import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { getPostsByLocale } from "~/lib/blog";
import { localePath } from "~/lib/constants";
import { routing } from "~/lib/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    alternates: {
      canonical: localePath(locale, ""),
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, localePath(l, "")]),
        ),
        "x-default": localePath(routing.defaultLocale, ""),
      },
    },
  };
}

type HomePageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const t = await getTranslations("blog");
  const tPagination = await getTranslations("pagination");
  const locale = await getLocale();
  const { page } = await searchParams;
  const currentPage = page ? Number.parseInt(page, 10) : 1;

  const posts = getPostsByLocale(locale);

  const perPage = 10;
  const start = (currentPage - 1) * perPage;
  const paginatedPosts = posts.slice(start, start + perPage);
  const totalPages = Math.ceil(posts.length / perPage);

  return (
    <>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-base font-medium">thoughts</h1>
          <p className="text-xs text-fg-muted">by andoni</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://x.com/andonienri"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-muted hover:text-fg"
            aria-label="X (Twitter)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://github.com/andoni-enriquez/andoni"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-muted hover:text-fg"
            aria-label="GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="space-y-0 border-t border-border">
        {paginatedPosts.length === 0 ? (
          <p className="text-sm text-fg-muted">{t("noPostsFound")}</p>
        ) : (
          paginatedPosts.map((post) => (
            <article key={post.slug} className="py-4">
              <Link
                href={`/blog/${post.slugAsParams}`}
                className="group flex items-baseline justify-between gap-4"
              >
                <span className="text-sm group-hover:underline underline-offset-4">
                  {post.title}
                </span>
                <time
                  dateTime={post.date}
                  className="shrink-0 text-xs text-fg-muted"
                >
                  {new Date(post.date).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </Link>
            </article>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-between border-t border-border pt-4">
          {currentPage > 1 ? (
            <Link
              href={`/?page=${currentPage - 1}`}
              className="text-xs text-fg-muted underline underline-offset-4 hover:text-fg"
            >
              {tPagination("previous")}
            </Link>
          ) : (
            <span />
          )}
          <span className="text-xs text-fg-muted">
            {tPagination("pageOf", {
              current: currentPage,
              total: totalPages,
            })}
          </span>
          {currentPage < totalPages ? (
            <Link
              href={`/?page=${currentPage + 1}`}
              className="text-xs text-fg-muted underline underline-offset-4 hover:text-fg"
            >
              {tPagination("next")}
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}

export const revalidate = 3600;
