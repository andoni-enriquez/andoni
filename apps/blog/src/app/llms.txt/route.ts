import { NextResponse } from "next/server";
import { getPostsByLocale, getSoulsByLocale } from "~/lib/blog";
import { SITE_URL } from "~/lib/constants";

export async function GET() {
  const posts = getPostsByLocale("en");
  const souls = getSoulsByLocale("en");

  const lines: string[] = [
    "# andoni",
    "",
    "> Personal blog documenting the process of building — trade-offs, architecture decisions, dead ends, and the lateral connections that only become visible when you write them down.",
    "",
    "## Blog Posts",
    "",
    ...posts.map(
      (p) =>
        `- [${p.title}](${SITE_URL}/blog/${p.slugAsParams}/md): ${p.description}`,
    ),
    "",
    "## Soul Documents",
    "",
    ...souls.map(
      (s) => `- [${s.name}](${SITE_URL}/soul/${s.slugAsParams}): ${s.brief}`,
    ),
    "",
    "## Process",
    "",
    "Every post is drafted with Mosca — a soul document that acts as a system prompt encoding how the author thinks and writes. AI is a drafting partner, not a ghostwriter: it helps with structure, drafts, and gap identification, but does not replace opinions, experience, or editorial judgment. The soul document is the primary reference for voice and reasoning style. Mosca is versioned and evolves with each post — new patterns get encoded, weak directives get cut, and the document sharpens over time as a feedback loop between writing and thinking.",
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export const dynamic = "force-static";
