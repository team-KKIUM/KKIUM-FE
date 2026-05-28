import type { ExperienceCategory } from '@/app/(pages)/experience/_components/ExperienceCategoryTab';
import type { JdAnalysisExperience } from '@/app/api/apply/types';

import type { ApplyMyExperienceItem } from '../_constants/applyMockData';

const typeMap: Record<JdAnalysisExperience['type'], Exclude<ExperienceCategory, 'all'>> = {
  ACTIVITY: 'activity',
  CAREER: 'career',
  EDUCATION: 'education',
  ETC: 'etc',
};

const emptyAnalysis: ApplyMyExperienceItem['analysis'] = {
  goodPoints: '',
  badPoints: '',
  usageGuide: '',
};

export function mapJdAnalysisExperienceToApplyMatch(
  experience: JdAnalysisExperience,
): ApplyMyExperienceItem {
  return {
    id: String(experience.experienceId),
    type: typeMap[experience.type],
    title: experience.title,
    description: experience.oneLineIntro,
    skillTags: experience.tags
      .filter((tag) => tag.category === 'TECH')
      .map((tag) => tag.field),
    competencyTags: experience.tags
      .filter((tag) => tag.category === 'COMPETENCY')
      .map((tag) => tag.field),
    matchScore: experience.usageFitScore,
    analysis: emptyAnalysis,
  };
}
