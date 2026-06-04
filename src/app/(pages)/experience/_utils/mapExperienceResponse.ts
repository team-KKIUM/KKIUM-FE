import type {
  ExperienceCardResponse,
  ExperienceDetailResponse,
  TagResponse,
} from '@/app/api/experience/types';
import type { ExperienceItem } from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import { formatExperiencePeriod } from '@/app/(pages)/experience/_utils/formatExperiencePeriod';
import { mapExperiencePieceTypeToCategory } from '@/app/(pages)/experience/_utils/mapExperiencePieceType';

type CommonExperienceFields = Pick<
  ExperienceCardResponse,
  'experienceId' | 'type' | 'title' | 'oneLineIntro' | 'tags' | 'startDate' | 'endDate'
>;

const emptyDetail: ExperienceItem['detail'] = {
  situation: '',
  task: '',
  action: '',
  result: '',
  taken: '',
};

const emptyBasicDetail: ExperienceItem['basicDetail'] = {};

export function mapExperienceCardToItem(response: ExperienceCardResponse): ExperienceItem {
  const period = formatExperiencePeriod(response.startDate, response.endDate);

  return {
    ...mapCommonFields(response),
    detailInfo: [{ label: '기간', value: period }],
    basicDetail: emptyBasicDetail,
    detail: emptyDetail,
  };
}

export function mapExperienceDetailToItem(response: ExperienceDetailResponse): ExperienceItem {
  return {
    ...mapCommonFields({
      experienceId: response.experienceId,
      type: response.type,
      title: response.title,
      oneLineIntro: response.oneLineIntro,
      startDate: response.detail.startDate,
      endDate: response.detail.endDate,
      tags: response.tags,
    }),
    detailInfo: getDetailInfo(response),
    basicDetail: getBasicDetail(response),
    detail: {
      situation: response.situation,
      task: response.task,
      action: response.act,
      result: response.result,
      taken: response.taken,
    },
  };
}

function getBasicDetail(response: ExperienceDetailResponse): ExperienceItem['basicDetail'] {
  switch (response.type) {
    case 'ACTIVITY':
      return {
        name: response.detail.name,
        teamNum: String(response.detail.teamNum),
        role: response.detail.role,
        contributionRate: String(response.detail.contributionRate),
      };
    case 'CAREER':
      return {
        name: response.detail.name,
        company: response.detail.company,
        employmentStatus: response.detail.employmentStatus,
      };
    case 'EDUCATION':
      return {
        organizationName: response.detail.organizationName,
        name: response.detail.name,
      };
    case 'ETC':
      return {};
  }
}

function mapCommonFields(response: CommonExperienceFields) {
  return {
    id: String(response.experienceId),
    type: mapExperiencePieceTypeToCategory(response.type),
    title: response.title,
    description: response.oneLineIntro,
    startDate: response.startDate,
    endDate: response.endDate,
    period: formatExperiencePeriod(response.startDate, response.endDate),
    skillTags: getTagsByCategory(response.tags, 'TECH'),
    competencyTags: getTagsByCategory(response.tags, 'COMPETENCY'),
  };
}

function getDetailInfo(response: ExperienceDetailResponse): ExperienceItem['detailInfo'] {
  const period = formatExperiencePeriod(response.detail.startDate, response.detail.endDate);

  switch (response.type) {
    case 'ACTIVITY':
      return [
        { label: '기간', value: period },
        { label: '팀원 수', value: `${response.detail.teamNum}명` },
        { label: '내 역할', value: response.detail.role },
        { label: '기여도', value: `${response.detail.contributionRate}%` },
      ];
    case 'CAREER':
      return [
        { label: '기간', value: period },
        { label: '회사/기관/단체명', value: response.detail.company },
        { label: '고용 형태', value: response.detail.employmentStatus },
      ];
    case 'EDUCATION':
      return [
        { label: '기간', value: period },
        { label: '기관명', value: response.detail.organizationName },
        { label: '수강명', value: response.detail.name },
      ];
    case 'ETC':
      return [{ label: '기간', value: period }];
  }
}

function getTagsByCategory(tags: TagResponse[], category: TagResponse['category']) {
  return tags.filter((tag) => tag.category === category).map((tag) => tag.field);
}
