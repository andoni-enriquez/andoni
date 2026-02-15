"use client";

import { cn } from "@andoni/ui/lib/utils";
import { useTranslations } from "next-intl";

type TocEntry = {
  title: string;
  url: string;
  items: TocEntry[];
};

type TocProps = {
  items: TocEntry[];
};

function TocItems({ items, depth = 0 }: { items: TocEntry[]; depth?: number }) {
  return (
    <ul className={cn("m-0 list-none space-y-1.5", depth > 0 && "pl-3")}>
      {items.map((item) => (
        <li key={item.url} className="m-0">
          <a
            href={item.url}
            className="inline-block text-[11px] text-fg-muted no-underline hover:text-fg"
          >
            {item.title}
          </a>
          {item.items.length > 0 && (
            <TocItems items={item.items} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

export function TableOfContents({ items }: TocProps) {
  const t = useTranslations("blog");

  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-[11px] uppercase tracking-wider text-fg-muted">
        {t("onThisPage")}
      </p>
      <TocItems items={items} />
    </div>
  );
}
