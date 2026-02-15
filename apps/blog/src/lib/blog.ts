import { authors, posts, souls } from "#site/content";

export type Post = (typeof posts)[number];
export type Author = (typeof authors)[number];
export type Soul = (typeof souls)[number];

/** Get all published posts, sorted by date (newest first). */
function getAllPosts(): Post[] {
  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Get all published posts for a specific locale, sorted by date (newest first). */
export function getPostsByLocale(locale: string): Post[] {
  return getAllPosts().filter((post) => post.locale === locale);
}

/** Get a single post by its slug param and locale. */
export function getPostBySlug(slug: string, locale: string): Post | undefined {
  return posts.find(
    (post) =>
      post.slugAsParams === slug && post.locale === locale && post.published,
  );
}

/** Get a single author by slug. */
function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((author) => author.slugAsParams === slug);
}

/** Get the author objects for a given post. */
export function getPostAuthors(post: Post): Author[] {
  return post.authors
    .map((authorSlug) => getAuthorBySlug(authorSlug))
    .filter((author): author is Author => author !== undefined);
}

/** Get a single soul by its slugAsParams and locale. */
export function getSoulBySlug(slug: string, locale: string): Soul | undefined {
  return souls.find(
    (soul) => soul.slugAsParams === slug && soul.locale === locale,
  );
}

/** Get the soul for a post (or undefined if none). */
export function getPostSoul(post: Post): Soul | undefined {
  if (!post.soul) return undefined;
  return getSoulBySlug(post.soul, post.locale);
}

/** Get all published souls for a locale. */
export function getSoulsByLocale(locale: string): Soul[] {
  return souls.filter((soul) => soul.locale === locale && soul.published);
}
