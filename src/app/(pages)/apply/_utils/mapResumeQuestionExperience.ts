import type { ExperienceItem } from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import { formatExperiencePeriod } from '@/app/(pages)/experience/_utils/formatExperiencePeriod';
import { mapExperiencePieceTypeToCategory } from '@/app/(pages)/experience/_utils/mapExperiencePieceType';
import type { ResumeQuestionExperience } from '@/app/api/apply/types';

import type { CoverLetterQuestionExperience } from '../_types/coverLetterQuestionExperience';

const emptyExperienceDetail: ExperienceItem['detail'] = {
  situation: '',
  task: '',
  action: '',
  result: '',
  taken: '',
};

export function mapResumeQuestionExperienceToCoverLetter(
  item: ResumeQuestionExperience,
): CoverLetterQuestionExperience {
  const startDate = item.startDate?.trim() ?? '';
  const endDate = item.endDate?.trim() ?? '';
  const type = mapExperiencePieceTypeToCategory(item.type);

  return {
    fitScore: item.usageFitScore,
    experience: {
      id: String(item.experienceId),
      type,
      title: item.title?.trim() ?? '',
      description: item.oneLineIntro?.trim() ?? '',
      startDate,
      endDate,
      period: formatExperiencePeriod(startDate, endDate),
      detailInfo: [],
      basicDetail: {},
      skillTags: [],
      competencyTags: [],
      detail: emptyExperienceDetail,
    },
  };
}

export function mapResumeQuestionExperiencesToCoverLetter(
  experiences: ResumeQuestionExperience[],
): CoverLetterQuestionExperience[] {
  return experiences.map(mapResumeQuestionExperienceToCoverLetter);
}
