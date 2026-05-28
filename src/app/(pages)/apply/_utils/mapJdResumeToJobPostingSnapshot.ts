import type { JdResumeResponse } from '@/app/api/apply/types';

import type { ApplyJobPostingSnapshot } from '../_stores/useApplyJobPostingStore';

function formatJdPeriod(startDate: string, endDate: string) {
  if (!startDate && !endDate) {
    return '상시 채용';
  }

  const format = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}.${month}.${day}`;
  };

  const start = startDate ? format(startDate) : '';
  const end = endDate ? format(endDate) : '';
  return `${start}~${end}`.replace(/^~|~$/g, '');
}

export function mapJdResumeToJobPostingSnapshot(
  jdId: string,
  resume: JdResumeResponse,
): ApplyJobPostingSnapshot {
  return {
    jdId,
    title: resume.postingTitle,
    companyName: resume.companyName,
    jobField: resume.recruitmentField,
    period: formatJdPeriod(resume.startDate, resume.endDate),
  };
}
