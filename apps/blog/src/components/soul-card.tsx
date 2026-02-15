import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Soul } from "~/lib/blog";

type SoulCardProps = {
  soul: Soul;
  model?: string | undefined;
};

export function SoulCard({ soul, model }: SoulCardProps) {
  const t = useTranslations("soul");

  return (
    <aside className="mt-10 border-t border-border pt-6">
      <p className="text-xs text-fg-muted">
        {t("writtenWith")}{" "}
        <strong className="font-medium text-fg">{soul.alias}</strong>{" "}
        {t("version", { version: soul.version })}
        {model && <> · {model}</>}
      </p>
      <p className="mt-2 text-xs text-fg-muted leading-relaxed">{soul.brief}</p>
      {soul.published && (
        <Link
          href={`/soul/${soul.slugAsParams}`}
          className="mt-2 inline-block text-xs text-fg-muted underline underline-offset-4 hover:text-fg"
        >
          {t("readMore")}
        </Link>
      )}
    </aside>
  );
}
