# andoni

## About

Personal blog that documents the process of building — trade-offs, architecture decisions, dead ends, and the lateral connections that only become visible when you write them down. Posts are written with AI through soul documents (system prompts that encode how I think and write), and the entire repo — code, content, souls, prompts — is public because the process is the product.

Built as a Turborepo monorepo with Next.js 16, Velite MDX static generation, and next-intl for internationalization.

## Project Structure

```
apps
  └─ blog
      ├─ Next.js 16, React 19, Tailwind CSS 4
      ├─ MDX blog with Velite static generation
      └─ i18n with next-intl

packages
  └─ ui
      └─ Shared utilities (cn, clsx + tailwind-merge)

tooling
  ├─ tailwind
  |   └─ Shared Tailwind CSS 4 theme
  └─ typescript
      └─ Shared tsconfig base
```

## Setup

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Lint & format
bun lint
bun format

# Type check
bun typecheck
```

## Deployment

Deployed to Vercel via `turbo run build`. Pushing to `main` triggers a production deployment.
