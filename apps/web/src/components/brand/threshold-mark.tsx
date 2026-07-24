import { cn } from "@/lib/utils";

/**
 * DönüşümKapısı imzası: teknik bir cephe çizimindeki kapı eşiği gibi
 * çizilmiş ince çizgili bir kapı formu. Çerçeve `currentColor` kullanır, bu
 * yüzden açık ve koyu bölümlerde metin rengini miras alarak uyum sağlar;
 * eşik çizgisi her zaman turkuaz kalır.
 */
export function ThresholdMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-6 text-ink", className)}
      aria-hidden="true"
    >
      <path
        d="M7 28V6.5C7 5.67157 7.67157 5 8.5 5H23.5C24.3284 5 25 5.67157 25 6.5V28"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="4"
        y1="28"
        x2="28"
        y2="28"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="28"
        x2="16"
        y2="10"
        stroke="var(--clay)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
