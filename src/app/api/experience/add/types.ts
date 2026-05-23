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

export interface ExperienceAnalyzeMaterialsRequest {
  file?: File;
  pageId?: string;
}

export interface ExperienceCreateTagRequest {
  category: 'TECH' | 'COMPETENCY';
  field: string;
}

export interface ExperienceCreateRequest {
  type: 'ACTIVITY' | 'CAREER' | 'EDUCATION' | 'ETC';
  title: string;
  oneLineIntro: string;
  startDate: string;
  endDate: string;
  situation: string;
  task: string;
  act: string;
  result: string;
  taken: string;
  tags: ExperienceCreateTagRequest[];
  name?: string;
  teamNum?: number;
  role?: string;
  contributionRate?: number;
  company?: string;
  employmentStatus?: string;
  organizationName?: string;
}

export interface NotionPageResponse {
  pageId: string;
  title: string;
}

export interface NotionPageListResponse {
  pages: NotionPageResponse[];
}
