import type { ExperienceType } from '@/app/(pages)/experience/add/_constants/experienceTypeOptions';

export interface ExperienceAddBasicInfoForm {
  type: ExperienceType | null;
  title: string;
  oneLineIntro: string;
  teamNum: string;
  role: string;
  contributionRate: string;
  company: string;
  employmentStatus: string;
  organizationName: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface ExperienceAddCoreInfoForm {
  situation: string;
  task: string;
  act: string;
  result: string;
  taken: string;
}

export interface ExperienceAddResultInfoForm {
  skillTags: string[];
  competencyTags: string[];
}

export function createEmptyBasicInfoForm(): ExperienceAddBasicInfoForm {
  return {
    type: null,
    title: '',
    oneLineIntro: '',
    teamNum: '',
    role: '',
    contributionRate: '',
    company: '',
    employmentStatus: '',
    organizationName: '',
    name: '',
    startDate: '',
    endDate: '',
  };
}

export function createEmptyCoreInfoForm(): ExperienceAddCoreInfoForm {
  return {
    situation: '',
    task: '',
    act: '',
    result: '',
    taken: '',
  };
}

export function createEmptyResultInfoForm(): ExperienceAddResultInfoForm {
  return {
    skillTags: [],
    competencyTags: [],
  };
}
