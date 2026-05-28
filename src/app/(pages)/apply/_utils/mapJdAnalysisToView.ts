import type { JdAnalysisResponse } from '@/app/api/apply/types';
import type { ApplyAnalysisSection } from '../_constants/applyMockData';
import type { ApplyJobTagItem } from '../_components/(analysis)/ApplyJobTags';

function splitAnalysisLines(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return [];
  }

  return trimmed
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function mapSkillTags(labels: readonly string[]): ApplyJobTagItem[] {
  return labels
    .map((label) => label.trim())
    .filter(Boolean)
    .map((label) => ({ label, on: true }));
}

function formatAnalysisPeriod(startDate: string, endDate: string) {
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

export function mapJdAnalysisToView(data: JdAnalysisResponse) {
  const jdInfo = data.jdInfo;

  const sections: ApplyAnalysisSection[] = [
    { title: '주요 업무', items: splitAnalysisLines(jdInfo?.mainResponsibilities ?? '') },
    { title: '자격 요건', items: splitAnalysisLines(jdInfo?.requiredQualifications ?? '') },
    { title: '우대 사항', items: splitAnalysisLines(jdInfo?.preferredQualifications ?? '') },
  ].filter((section) => section.items.length > 0);

  return {
    fitScore: data.matchResult?.applicationFitScore,
    jobInfo: {
      postingTitle: jdInfo?.postingTitle ?? '',
      companyName: jdInfo?.companyName ?? '',
      jobField: jdInfo?.recruitmentField ?? '',
      period: formatAnalysisPeriod(jdInfo?.startDate ?? '', jdInfo?.endDate ?? ''),
    },
    tags: {
      skills: mapSkillTags(jdInfo?.hardSkills ?? []),
      competencies: mapSkillTags(jdInfo?.softSkills ?? []),
    },
    sections,
  };
}
