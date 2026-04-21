import type { MetadataRoute } from "next";
import { getPostsByLocale, getSoulsByLocale } from "~/lib/blog";
import { localePath, SITE_URL } from "~/lib/constants";
import { routing } from "~/lib/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.4,
    },
  ];

  for (const locale of routing.locales) {
    const posts = getPostsByLocale(locale);
    const souls = getSoulsByLocale(locale);

    for (const post of posts) {
      entries.push({
        url: localePath(locale, `/blog/${post.slugAsParams}`),
        lastModified: new Date(post.updated ?? post.date),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const soul of souls) {
      entries.push({
        url: localePath(locale, `/soul/${soul.slugAsParams}`),
        lastModified: new Date(soul.lastReflection),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
