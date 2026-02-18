import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1 className="mb-4 mt-10 text-base font-medium tracking-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mb-3 mt-10 text-sm font-medium tracking-tight" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mb-2 mt-8 text-sm font-medium" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="mb-2 mt-6 text-sm font-medium" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p
      className="text-sm leading-relaxed text-fg-muted [&:not(:first-child)]:mt-4"
      {...props}
    >
      {children}
    </p>
  ),
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-fg"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href ?? "#"}
        className="underline underline-offset-4 hover:text-fg"
        {...props}
      >
        {children}
      </Link>
    );
  },
  ul: ({ children, ...props }) => (
    <ul
      className="my-4 ml-4 list-disc text-sm text-fg-muted [&>li]:mt-1.5"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="my-4 ml-4 list-decimal text-sm text-fg-muted [&>li]:mt-1.5"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  pre: ({ children, ...props }) => (
    <pre
      className="my-5 overflow-x-auto border border-border p-4 text-[13px] leading-relaxed"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, ...props }) => {
    const isInline = typeof children === "string";
    if (isInline) {
      return (
        <code
          className="border border-border px-1 py-0.5 text-[13px]"
          {...props}
        >
          {children}
        </code>
      );
    }
    return <code {...props}>{children}</code>;
  },
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mt-5 border-l-2 border-border pl-4 text-sm italic text-fg-muted"
      {...props}
    >
      {children}
    </blockquote>
  ),
  mark: ({ children, ...props }) => (
    <mark
      className="bg-transparent text-sm text-fg underline decoration-border decoration-1 underline-offset-4"
      {...props}
    >
      {children}
    </mark>
  ),
  hr: () => <hr className="my-10 border-border" />,
  img: ({ src, alt, ...props }) => (
    <Image
      src={src ?? ""}
      alt={alt ?? ""}
      width={620}
      height={310}
      className="my-5"
      {...props}
    />
  ),
  table: ({ children, ...props }) => (
    <div className="my-5 overflow-x-auto">
      <table className="min-w-full text-sm border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border-b border-border px-3 py-2 text-left text-xs font-medium"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="border-b border-border px-3 py-2 text-xs text-fg-muted"
      {...props}
    >
      {children}
    </td>
  ),
};
