const MONTHS_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MONTHS_ID = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

/**
 * Format a date into '25 Sep 2026' style.
 *
 * @param date - Date object, ISO string, or timestamp
 * @param locale - 'en' or 'id'
 * @returns Formatted date string, e.g. "25 Sep 2026"
 */
export function formatDate(
  date: Date | string | number | undefined | null,
  locale: 'en' | 'id' = 'en'
): string {
  if (!date) return '';
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  const day = d.getDate();
  const year = d.getFullYear();
  const months = locale === 'id' ? MONTHS_ID : MONTHS_EN;
  const month = months[d.getMonth()];

  return `${day} ${month} ${year}`;
}
