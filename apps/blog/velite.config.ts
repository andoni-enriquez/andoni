import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { defineConfig, defineCollection, s } from "velite";

const computedFields = <T extends { slug: string }>(data: T) => ({
  ...data,
  slugAsParams: data.slug.split("/").slice(1).join("/"),
});

const authors = defineCollection({
  name: "Author",
  pattern: "authors/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      name: s.string().max(100),
      twitter: s.string().max(100).optional(),
      body: s.mdx(),
    })
    .transform(computedFields),
});

const posts = defineCollection({
  name: "Post",
  pattern: "blog/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(100),
      date: s.isodate(),
      updated: s.isodate().optional(),
      description: s.string().max(300),
      image: s.string().max(200).optional(),
      published: s.boolean().default(true),
      soul: s.string().max(50).optional(),
      authors: s.array(s.string()).default(["andoni"]),
      metadata: s.metadata(),
      toc: s.toc(),
      body: s.mdx(),
    })
    .transform((data) => {
      // slug is "blog/{locale}/{name}", extract locale and clean slug
      const parts = data.slug.split("/");
      const locale = parts[1] ?? "en";
      const slugAsParams = parts.slice(2).join("/");
      return {
        ...data,
        locale,
        slugAsParams,
        readingTime: data.metadata.readingTime,
        wordCount: data.metadata.wordCount,
        permalink: `/blog/${slugAsParams}`,
      };
    }),
});

const souls = defineCollection({
  name: "Soul",
  pattern: "soul/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      name: s.string().max(100),
      alias: s.string().max(50),
      version: s.string().max(20),
      lastReflection: s.isodate(),
      published: s.boolean().default(false),
      brief: s.string().max(500),
      model: s.string().max(50).optional(),
      toc: s.toc(),
      body: s.mdx(),
    })
    .transform((data) => {
      const parts = data.slug.split("/");
      const locale = parts[1] ?? "en";
      const slugAsParams = parts.slice(2).join("/");
      return { ...data, locale, slugAsParams };
    }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { authors, posts, souls },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: "github-dark" }],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
});
