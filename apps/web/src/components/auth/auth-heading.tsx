import Link from "next/link";

export function AuthHeading({
  eyebrow,
  title,
  description,
  linkHref,
  linkBefore,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  linkHref?: string;
  linkBefore?: string;
  linkLabel?: string;
}) {
  const hasLink = Boolean(linkHref && linkLabel);

  return (
    <header className="mb-8">
      <p className="font-mono text-[0.65rem] tracking-[0.2em] text-clay uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-2.5 font-display text-[1.75rem] leading-tight text-ink sm:text-3xl">
        {title}
      </h1>
      {(description || hasLink) && (
        <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
          {description ? <span>{description} </span> : null}
          {hasLink ? (
            <>
              {linkBefore ? `${linkBefore} ` : null}
              <Link
                href={linkHref!}
                className="font-medium text-clay underline-offset-4 transition-colors hover:text-clay-soft hover:underline"
              >
                {linkLabel}
              </Link>
            </>
          ) : null}
        </p>
      )}
    </header>
  );
}
