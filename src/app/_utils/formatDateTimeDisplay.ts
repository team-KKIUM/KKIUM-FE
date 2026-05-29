/** `2026-04-26T15:00:00` → `2026.04.26 15:00` (seconds omitted, no timezone shift). */
export function formatDateTimeDisplay(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::\d{2})?)?/);

  if (isoMatch) {
    const [, year, month, day, hours, minutes] = isoMatch;
    const dateText = `${year}.${month}.${day}`;

    if (hours !== undefined && minutes !== undefined) {
      return `${dateText} ${hours}:${minutes}`;
    }

    return dateText;
  }

  const date = new Date(trimmed);

  if (Number.isNaN(date.getTime())) {
    return trimmed;
  }

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateText = `${date.getFullYear()}.${month}.${day}`;
  const hasExplicitTime = /t\d{2}:\d{2}/i.test(trimmed);

  if (!hasExplicitTime) {
    return dateText;
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${dateText} ${hours}:${minutes}`;
}
