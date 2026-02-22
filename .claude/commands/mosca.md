---
description: Draft a blog post using the mosca soul system
allowed-tools: Read(apps/blog/content/soul/en/fly.mdx), Read(apps/blog/content/blog/en/*), Write(apps/blog/content/blog/en/*), Edit(apps/blog/content/blog/en/*)
---

# Mosca — Blog Post Drafting

## When to use

- User wants to draft a blog post.
- User runs `/mosca` with `$ARGUMENTS` describing the topic, angle, or rough idea.

## Workflow

### 1. Load soul

Read the soul document at `apps/blog/content/soul/en/fly.mdx`. Internalize the voice, reasoning patterns, and values before writing anything. This is the primary reference for tone and structure.

### 2. Understand the input

Parse `$ARGUMENTS` for the topic, angle, or rough idea.

- If the input is too vague to write a focused post, ask the user to clarify before proceeding.
- If there's a clear direction, confirm the angle briefly and proceed.

### 3. Draft

Write the post as MDX with the following structure:

**Frontmatter (required fields):**

```yaml
---
title: "Post Title"
date: YYYY-MM-DD  # today's date
description: "One-sentence description, max 300 chars."
soul: fly
model: "opus-4.6"
authors:
  - andoni
published: false
---
```

**Body guidelines — follow the mosca voice:**

- Direct, understated, technically precise. Short sentences. Em dashes over parentheses.
- Use `<mark>` tags on supporting beats — pivots, reversals, structural statements that carry the argument forward. Never highlight the alpha (the core thesis, the competitive insight). The reader earns the alpha by reading. Use sparingly (see `apps/blog/content/blog/en/inception.mdx` for reference).
- Use horizontal rules (`---`) between major sections.
- Use "I" freely. Opinions are sharp. Deep dives are patient. Tutorials are efficient. Reflections are loose.
- Target reader: an engineer who cares about "why" as much as "how."
- Every section earns its place. If a section doesn't pull weight, delete it.
- Craft over speed. Honesty over diplomacy. Teaching over showing off.

### 4. Gap analysis

After drafting, explicitly review for these five dimensions. Print each as a heading with your assessment:

- **Compound vision** — Are there angles or perspectives not covered? A fly sees in mosaic. What ommatidia are missing?
- **Structural integrity** — Does each section earn its place? Could any be cut or merged without loss?
- **Voice consistency** — Did any section drift from the mosca voice? Look for hedging, filler, corporate tone, or over-explanation.
- **Argument strength** — Would a skeptical engineer push back on any claim? Are opinions supported by reasoning or experience?
- **Unnecessary weight** — The best code is the code you delete. Are there sentences or paragraphs that exist out of habit rather than necessity?

### 5. Iterate

Present the gap analysis to the user. Ask what to refine, cut, or expand. Repeat steps 3–4 until the user is satisfied.

### 6. Write

Save the final MDX to `apps/blog/content/blog/en/{slug}.mdx` with `published: false`. The slug should be a short, lowercase, hyphenated version of the topic.

## Output

1. The drafted post (shown to the user for review).
2. The gap analysis (five dimensions).
3. Final `.mdx` file path after writing.

## Guardrails

- Always read the soul document before drafting. Do not rely on memory alone.
- Always set `published: false`. The user publishes manually.
- Do not invent quotes, statistics, or citations. If referencing research, flag it for the user to verify.
- The soul document is the authority on voice. When in doubt, re-read it.
