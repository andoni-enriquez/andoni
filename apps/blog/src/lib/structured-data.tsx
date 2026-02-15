import type { ReactNode } from "react";
import { localePath, SITE_NAME, SITE_URL } from "~/lib/constants";

function JsonLdScript({ data }: { data: Record<string, unknown> }): ReactNode {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type ArticleAuthor = {
  name: string;
  twitter?: string;
};

type ArticleJsonLdProps = {
  title: string;
  description: string;
  slug: string;
  locale: string;
  datePublished: string;
  dateModified?: string;
  authors?: ArticleAuthor[];
  image?: string;
};

function authorSameAs(author: ArticleAuthor): string[] {
  const links: string[] = [];
  if (author.twitter) {
    const handle = author.twitter.replace(/^@/, "");
    links.push(`https://twitter.com/${handle}`);
  }
  return links;
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  locale,
  datePublished,
  dateModified,
  authors,
  image,
}: ArticleJsonLdProps): ReactNode {
  const url = localePath(locale, `/blog/${slug}`);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: locale,
    author:
      authors && authors.length > 0
        ? authors.map((a) => {
            const sameAs = authorSameAs(a);
            return {
              "@type": "Person",
              name: a.name,
              ...(sameAs.length > 0 && { sameAs }),
            };
          })
        : { "@type": "Person", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  if (image) {
    data.image = image;
  }

  return <JsonLdScript data={data} />;
}

type WebSiteJsonLdProps = {
  locale?: string;
};

export function WebSiteJsonLd({
  locale = "en",
}: WebSiteJsonLdProps): ReactNode {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description:
      "Building with a soul — documenting the process, the thinking, and everything in between.",
    url: localePath(locale, ""),
    inLanguage: locale,
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return <JsonLdScript data={data} />;
}
