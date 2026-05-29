import { formatDateTimeDisplay } from '@/app/_utils/formatDateTimeDisplay';

export function formatRecruitmentPeriod(startDate: string, endDate: string): string {
  if (!startDate && !endDate) {
    return '상시 채용';
  }

  const start = startDate ? formatDateTimeDisplay(startDate) : '';
  const end = endDate ? formatDateTimeDisplay(endDate) : '';

  if (start && end) {
    return `${start} ~ ${end}`;
  }

  return start || end;
}
