import { cn } from "@/lib/utils";

/**
 * Auth submit CTA — full-width clay button with subtle shine sweep.
 */
export function ShineButton({
  children,
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "group/shine relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-clay px-6 text-sm font-semibold tracking-wide text-white shadow-[0_12px_32px_-12px_var(--clay)] transition-[background-color,box-shadow,transform] duration-300 hover:bg-clay-soft hover:shadow-[0_16px_36px_-10px_var(--clay)] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="absolute inset-0 flex justify-center [transform:skew(-13deg)_translateX(-160%)] transition-transform duration-700 ease-out group-hover/shine:[transform:skew(-13deg)_translateX(160%)]"
      >
        <span className="h-full w-12 bg-white/20" />
      </span>
    </button>
  );
}
