import type { ExperienceAnalyzeResponse } from '@/app/api/experience/add/types';
import {
  createEmptyBasicInfoForm,
  createEmptyCoreInfoForm,
} from '@/app/(pages)/experience/add/_types/experienceAddForm';

function toFormValue(value: string | number | null | undefined) {
  return value == null ? '' : String(value);
}

export function mapAnalyzeResponseToBasicInfoForm(response: ExperienceAnalyzeResponse) {
  const baseForm = {
    ...createEmptyBasicInfoForm(),
    title: toFormValue(response.title),
    oneLineIntro: toFormValue(response.oneLineIntro),
  };

  if (response.activityInfo) {
    return {
      ...baseForm,
      type: 'activity' as const,
      teamNum: toFormValue(response.activityInfo.teamNum),
      role: toFormValue(response.activityInfo.role),
      contributionRate: toFormValue(response.activityInfo.contributionRate),
      startDate: toFormValue(response.activityInfo.startDate),
      endDate: toFormValue(response.activityInfo.endDate),
    };
  }

  if (response.careerInfo) {
    return {
      ...baseForm,
      type: 'career' as const,
      company: toFormValue(response.careerInfo.company),
      employmentStatus: toFormValue(response.careerInfo.employmentStatus),
      startDate: toFormValue(response.careerInfo.startDate),
      endDate: toFormValue(response.careerInfo.endDate),
    };
  }

  if (response.educationInfo) {
    return {
      ...baseForm,
      type: 'education' as const,
      organizationName: toFormValue(response.educationInfo.organizationName),
      name: toFormValue(response.educationInfo.name),
      startDate: toFormValue(response.educationInfo.startDate),
      endDate: toFormValue(response.educationInfo.endDate),
    };
  }

  return {
    ...baseForm,
    type: 'etc' as const,
  };
}

export function mapAnalyzeResponseToCoreInfoForm(response: ExperienceAnalyzeResponse) {
  return {
    ...createEmptyCoreInfoForm(),
    situation: toFormValue(response.situation),
    task: toFormValue(response.task),
    act: toFormValue(response.act),
    result: toFormValue(response.result),
    taken: toFormValue(response.taken),
  };
}

export function mapAnalyzeResponseToResultInfoForm(response: ExperienceAnalyzeResponse) {
  return {
    skillTags: response.tags.filter((tag) => tag.category === 'TECH').map((tag) => tag.field),
    competencyTags: response.tags
      .filter((tag) => tag.category === 'COMPETENCY')
      .map((tag) => tag.field),
  };
}
