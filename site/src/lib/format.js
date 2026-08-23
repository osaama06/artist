const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

function formatArabicDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getDate()} ${ARABIC_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateRange(start, end) {
  if (!start) return "";
  if (!end || end === start) return formatArabicDate(start);
  return `${formatArabicDate(start)} — ${formatArabicDate(end)}`;
}

export function formatPrice(price) {
  if (price === null || price === undefined) return null;
  return `${new Intl.NumberFormat("ar-SA").format(price)} ر.س`;
}
