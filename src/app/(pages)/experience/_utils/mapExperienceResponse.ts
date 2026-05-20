import type {
  ExperienceCardResponse,
  ExperienceDetailResponse,
  PieceType,
  TagResponse,
} from '@/app/api/experience/types';
import type { ExperienceItem } from '@/app/(pages)/experience/_components/ExperienceCardGrid';

type UiExperienceType = ExperienceItem['type'];
type CommonExperienceFields = Pick<
  ExperienceCardResponse,
  'experienceId' | 'type' | 'title' | 'oneLineIntro' | 'tags' | 'startDate' | 'endDate'
>;

const typeMap: Record<PieceType, UiExperienceType> = {
  ACTIVITY: 'activity',
  CAREER: 'career',
  EDUCATION: 'education',
  ETC: 'etc',
};

const emptyDetail: ExperienceItem['detail'] = {
  situation: '',
  task: '',
  action: '',
  result: '',
  taken: '',
};

export function mapExperienceCardToItem(response: ExperienceCardResponse): ExperienceItem {
  const period = formatPeriod(response.startDate, response.endDate);

  return {
    ...mapCommonFields(response),
    detailInfo: [{ label: '기간', value: period }],
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
    detail: {
      situation: response.situation,
      task: response.task,
      action: response.act,
      result: response.result,
      taken: response.taken,
    },
  };
}

function mapCommonFields(response: CommonExperienceFields) {
  return {
    id: String(response.experienceId),
    type: typeMap[response.type],
    title: response.title,
    description: response.oneLineIntro,
    period: formatPeriod(response.startDate, response.endDate),
    skillTags: getTagsByCategory(response.tags, 'TECH'),
    competencyTags: getTagsByCategory(response.tags, 'COMPETENCY'),
  };
}

function getDetailInfo(response: ExperienceDetailResponse): ExperienceItem['detailInfo'] {
  const period = formatPeriod(response.detail.startDate, response.detail.endDate);

  switch (response.type) {
    case 'ACTIVITY':
      return [
        { label: '기간', value: period },
        { label: '팀원 수', value: `${response.detail.teamNum}명` },
        {
          label: '내 역할 및 기여도',
          value: `${response.detail.role}, ${response.detail.contributionRate}%`,
        },
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

function formatPeriod(startDate: string, endDate: string) {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (startDate.slice(0, 4) === endDate.slice(0, 4)) {
    return `${start}~${end.slice(5)}`;
  }

  return `${start}~${end}`;
}

function formatDate(date: string) {
  return date.replaceAll('-', '.');
}
