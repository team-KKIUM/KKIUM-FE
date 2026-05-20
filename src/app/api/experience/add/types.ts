import type { TagResponse } from '@/app/api/experience/types';

type ISODateString = string;

export interface ActivityAnalyzeInfo {
  name: string | null;
  teamNum: number | null;
  startDate: ISODateString | null;
  endDate: ISODateString | null;
  contributionRate: number | null;
  role: string | null;
}

export interface CareerAnalyzeInfo {
  name: string | null;
  company: string | null;
  employmentStatus: string | null;
  startDate: ISODateString | null;
  endDate: ISODateString | null;
}

export interface EducationAnalyzeInfo {
  organizationName: string | null;
  name: string | null;
  startDate: ISODateString | null;
  endDate: ISODateString | null;
}

export interface ExperienceAnalyzeResponse {
  title: string | null;
  oneLineIntro: string | null;
  activityInfo: ActivityAnalyzeInfo | null;
  careerInfo: CareerAnalyzeInfo | null;
  educationInfo: EducationAnalyzeInfo | null;
  situation: string | null;
  task: string | null;
  act: string | null;
  result: string | null;
  taken: string | null;
  tags: TagResponse[];
}

export interface NotionPageResponse {
  pageId: string;
  title: string;
}

export interface NotionPageListResponse {
  pages: NotionPageResponse[];
}
