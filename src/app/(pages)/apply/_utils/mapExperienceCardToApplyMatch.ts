import type { ExperienceCategory } from '@/app/(pages)/experience/_components/ExperienceCategoryTab';
import type {
  ExperienceCardResponse,
  ExperiencePieceType,
} from '@/app/api/experience/types';

import type { ApplyMyExperienceItem } from '../_constants/applyMockData';

const typeMap: Record<ExperiencePieceType, Exclude<ExperienceCategory, 'all'>> = {
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

export function mapExperienceCardToApplyMatch(
  card: ExperienceCardResponse,
): ApplyMyExperienceItem {
  return {
    id: String(card.experienceId),
    type: typeMap[card.type],
    title: card.title,
    description: card.oneLineIntro,
    skillTags: card.tags.filter((tag) => tag.category === 'TECH').map((tag) => tag.field),
    competencyTags: card.tags
      .filter((tag) => tag.category === 'COMPETENCY')
      .map((tag) => tag.field),
    matchScore: 0,
    analysis: emptyAnalysis,
  };
}
