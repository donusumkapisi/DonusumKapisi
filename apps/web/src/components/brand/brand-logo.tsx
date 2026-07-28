import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Mobil uygulamanın ikonu. Logonun çerçevesi neredeyse siyah olduğu için
 * ikon kendi açık zeminini yanında taşır; böylece koyu başlık ve altbilgi
 * bölümlerinde de aynı şekilde okunur.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-black/5",
        className
      )}
    >
      <Image
        src="/brand/mark.png"
        alt=""
        width={256}
        height={256}
        className="size-[86%] object-contain"
        priority
      />
    </span>
  );
}

/** Kelime markasını da içeren tam logo kilidi — yalnızca açık zeminlerde. */
export function BrandLockup({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/logo.png"
      alt="DönüşümKapısı"
      width={488}
      height={333}
      className={cn("h-12 w-auto", className)}
      priority
    />
  );
}
