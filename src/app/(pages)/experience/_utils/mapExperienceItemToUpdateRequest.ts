import type { ExperienceItem } from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import type { ExperienceUpdateRequest } from '@/app/api/experience/types';

export function mapExperienceItemToUpdateRequest(
  experience: Pick<
    ExperienceItem,
    | 'type'
    | 'title'
    | 'description'
    | 'basicDetail'
    | 'detail'
    | 'skillTags'
    | 'competencyTags'
    | 'startDate'
    | 'endDate'
  >,
): ExperienceUpdateRequest {
  return {
    title: experience.title,
    oneLineIntro: experience.description,
    tags: [
      ...experience.skillTags.map((tag) => ({ category: 'TECH' as const, field: tag })),
      ...experience.competencyTags.map((tag) => ({
        category: 'COMPETENCY' as const,
        field: tag,
      })),
    ],
    situation: experience.detail.situation,
    task: experience.detail.task,
    act: experience.detail.action,
    result: experience.detail.result,
    taken: experience.detail.taken,
    detail: {
      ...getTypeDetail(experience),
      startDate: experience.startDate,
      endDate: experience.endDate,
    },
  };
}

function getTypeDetail(
  experience: Pick<ExperienceItem, 'type' | 'basicDetail'>,
): Omit<ExperienceUpdateRequest['detail'], 'startDate' | 'endDate'> {
  switch (experience.type) {
    case 'activity':
      return {
        name: experience.basicDetail.name,
        teamNum: toNumber(experience.basicDetail.teamNum),
        role: experience.basicDetail.role,
        contributionRate: toNumber(experience.basicDetail.contributionRate),
      };
    case 'career':
      return {
        name: experience.basicDetail.name,
        company: experience.basicDetail.company,
        employmentStatus: experience.basicDetail.employmentStatus,
      };
    case 'education':
      return {
        organizationName: experience.basicDetail.organizationName,
        name: experience.basicDetail.name,
      };
    case 'etc':
      return {};
  }
}

function toNumber(value: string | undefined) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return undefined;
  }

  const numberValue = parseInt(trimmedValue, 10);

  return Number.isInteger(numberValue) ? numberValue : undefined;
}
