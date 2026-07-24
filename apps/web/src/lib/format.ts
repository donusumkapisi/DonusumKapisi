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
