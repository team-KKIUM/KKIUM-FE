export function formatExperiencePeriod(startDate: string, endDate: string) {
  const start = startDate.replaceAll('-', '.');
  const end = endDate.replaceAll('-', '.');

  if (!start || !end) return '';

  if (startDate.slice(0, 4) === endDate.slice(0, 4)) {
    return `${start}~${end.slice(5)}`;
  }

  return `${start}~${end}`;
}
