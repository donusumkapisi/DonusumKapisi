const lightColors = {
  paper: "#ffffff",
  mist: "#eaf4f7",
  ink: "#163449",
  inkMuted: "#5b7a8a",
  deep: "#0e3446",
  turquoise: "#0fb4a5",
  turquoiseSoft: "#3fcbbd",
  ctaRed: "#e4483f",
  ctaOrange: "#f2924a",
  hairline: "#16344920",
  /** Header/hero yüzeyleri her zaman koyu (colors.deep) olduğu için bu yüzeyler
   * üzerindeki metin/ikonlar temadan bağımsız hep beyaz kalmalı — colors.paper
   * kullanmayın, o sayfa arka planını temsil eder ve karanlık modda koyulaşır. */
  onDark: "#ffffff",
};

const darkColors: Colors = {
  paper: "#0b1d27",
  mist: "#153545",
  ink: "#eef6f8",
  inkMuted: "#8fb0bf",
  deep: "#071620",
  turquoise: "#2ee0cd",
  turquoiseSoft: "#5be6d6",
  ctaRed: "#ff7b70",
  ctaOrange: "#ffaf72",
  hairline: "#eef6f826",
  onDark: "#ffffff",
};

export type Colors = typeof lightColors;
export type ColorScheme = "light" | "dark";

export const PALETTES: Record<ColorScheme, Colors> = { light: lightColors, dark: darkColors };

/** Geriye dönük statik referans — yeni kod useColors() kullanmalı. */
export const colors = lightColors;

const priceFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number) {
  return priceFormatter.format(value);
}

export function formatPriceRange(min: number, max: number) {
  return `${priceFormatter.format(min)} – ${priceFormatter.format(max)}`;
}
