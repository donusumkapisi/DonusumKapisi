/** Platform iletişim — taraflar birbirine doğrudan ulaşmaz; tüm irtibat buradan geçer. */
export const CONTACT_PHONE = "+90 501 083 95 56";
export const CONTACT_PHONE_DIGITS = "905010839556";
export const CONTACT_EMAIL = "info@donusumkapisi.com";

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${CONTACT_PHONE_DIGITS}?text=${encodeURIComponent(message)}`;
}

export function buildMailUrl(subject: string, body: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildCallUrl() {
  return `tel:${CONTACT_PHONE.replace(/\s+/g, "")}`;
}
