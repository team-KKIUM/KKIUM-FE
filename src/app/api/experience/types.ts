export type PieceType = 'ACTIVITY' | 'CAREER' | 'EDUCATION' | 'ETC';

export type TagCategory = 'TECH' | 'COMPETENCY';

type ISODateString = string;

export interface TagResponse {
  category: TagCategory;
  field: string;
}

export interface ExperienceCardResponse {
  pieceId: number;
  experienceId: number;
  type: PieceType;
  title: string;
  oneLineIntro: string;
  startDate: ISODateString;
  endDate: ISODateString;
  tags: TagResponse[];
}

export interface ExperienceListResponse {
  hasNext: boolean;
  nextCursor: number | null;
  experiences: ExperienceCardResponse[];
}

export interface ActivityDetail {
  name: string;
  teamNum: number;
  role: string;
  contributionRate: number;
  startDate: ISODateString;
  endDate: ISODateString;
}

export interface CareerDetail {
  name: string;
  company: string;
  employmentStatus: string;
  startDate: ISODateString;
  endDate: ISODateString;
}

export interface EducationDetail {
  organizationName: string;
  name: string;
  startDate: ISODateString;
  endDate: ISODateString;
}

export interface EtcDetail {
  startDate: ISODateString;
  endDate: ISODateString;
}

interface ExperienceDetailBase {
  pieceId: number;
  experienceId: number;
  title: string;
  oneLineIntro: string;
  tags: TagResponse[];
  situation: string;
  task: string;
  act: string;
  result: string;
  taken: string;
}

export type ExperienceDetailResponse =
  | (ExperienceDetailBase & {
      type: 'ACTIVITY';
      detail: ActivityDetail;
    })
  | (ExperienceDetailBase & {
      type: 'CAREER';
      detail: CareerDetail;
    })
  | (ExperienceDetailBase & {
      type: 'EDUCATION';
      detail: EducationDetail;
    })
  | (ExperienceDetailBase & {
      type: 'ETC';
      detail: EtcDetail;
    });
