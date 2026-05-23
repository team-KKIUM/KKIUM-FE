import type { ExperienceCreateRequest } from '@/app/api/experience/add/types';
import type {
  ExperienceAddBasicInfoForm,
  ExperienceAddCoreInfoForm,
  ExperienceAddResultInfoForm,
} from '@/app/(pages)/experience/add/_types/experienceAddForm';

interface MapExperienceAddFormParams {
  basicInfo: ExperienceAddBasicInfoForm;
  coreInfo: ExperienceAddCoreInfoForm;
  resultInfo: ExperienceAddResultInfoForm;
}

const typeMap = {
  activity: 'ACTIVITY',
  career: 'CAREER',
  education: 'EDUCATION',
  etc: 'ETC',
} as const;

function toOptionalNumber(value: string) {
  const normalizedValue = value.replace(/[^\d.-]/g, '');

  if (!normalizedValue) return undefined;

  const numberValue = Number(normalizedValue);

  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function toOptionalString(value: string) {
  return value.trim() || undefined;
}

export function mapExperienceAddFormToCreateRequest({
  basicInfo,
  coreInfo,
  resultInfo,
}: MapExperienceAddFormParams): ExperienceCreateRequest {
  const request: ExperienceCreateRequest = {
    type: typeMap[basicInfo.type ?? 'etc'],
    title: basicInfo.title,
    oneLineIntro: basicInfo.oneLineIntro,
    startDate: basicInfo.startDate,
    endDate: basicInfo.endDate,
    situation: coreInfo.situation,
    task: coreInfo.task,
    act: coreInfo.act,
    result: coreInfo.result,
    taken: coreInfo.taken,
    tags: [
      ...resultInfo.skillTags.map((field) => ({ category: 'TECH' as const, field })),
      ...resultInfo.competencyTags.map((field) => ({
        category: 'COMPETENCY' as const,
        field,
      })),
    ],
  };

  if (basicInfo.type === 'activity') {
    return {
      ...request,
      name: toOptionalString(basicInfo.name) ?? basicInfo.title,
      teamNum: toOptionalNumber(basicInfo.teamNum),
      role: toOptionalString(basicInfo.role),
      contributionRate: toOptionalNumber(basicInfo.contributionRate),
    };
  }

  if (basicInfo.type === 'career') {
    return {
      ...request,
      company: toOptionalString(basicInfo.company),
      employmentStatus: toOptionalString(basicInfo.employmentStatus),
    };
  }

  if (basicInfo.type === 'education') {
    return {
      ...request,
      organizationName: toOptionalString(basicInfo.organizationName),
      name: toOptionalString(basicInfo.name) ?? basicInfo.title,
    };
  }

  return request;
}
