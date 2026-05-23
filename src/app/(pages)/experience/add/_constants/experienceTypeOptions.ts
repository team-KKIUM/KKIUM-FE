import type { ExperienceAddBasicInfoForm } from '@/app/(pages)/experience/add/_types/experienceAddForm';

export const EXPERIENCE_TYPE_OPTIONS = [
  {
    value: 'activity',
    label: '학내외활동',
    defaultIconSrc: '/activity-default.svg',
    selectedIconSrc: '/activity-selected.svg',
  },
  {
    value: 'career',
    label: '인턴/직무경력',
    defaultIconSrc: '/career-default.svg',
    selectedIconSrc: '/career-selected.svg',
  },
  {
    value: 'education',
    label: '수강/교육',
    defaultIconSrc: '/education-default.svg',
    selectedIconSrc: '/education-selected.svg',
  },
  {
    value: 'etc',
    label: '기타',
    defaultIconSrc: '/etc-default.svg',
    selectedIconSrc: '/etc-selected.svg',
  },
] as const;

export type ExperienceType = (typeof EXPERIENCE_TYPE_OPTIONS)[number]['value'];

type ExperienceTypeField = {
  name: keyof Omit<ExperienceAddBasicInfoForm, 'type'>;
  placeholder?: string;
  variant?: 'input' | 'date';
};

type ExperienceTypeFieldGroup = {
  number: string;
  label: string;
  fields: readonly ExperienceTypeField[];
};

export const EXPERIENCE_TYPE_FIELD_GROUPS: Record<
  ExperienceType,
  readonly ExperienceTypeFieldGroup[]
> = {
  activity: [
    {
      number: '02.',
      label: '제목',
      fields: [{ name: 'title', placeholder: '제목을 작성해주세요.' }],
    },
    {
      number: '03.',
      label: '한 줄 설명',
      fields: [{ name: 'oneLineIntro', placeholder: '이 경험을 간단히 설명해주세요.' }],
    },
    {
      number: '04.',
      label: '팀원 수',
      fields: [{ name: 'teamNum', placeholder: '예시 : 5' }],
    },
    {
      number: '05.',
      label: '내 역할 및 기여도',
      fields: [
        { name: 'role', placeholder: '기획자' },
        { name: 'contributionRate', placeholder: '20%' },
      ],
    },
    {
      number: '06.',
      label: '날짜',
      fields: [
        { name: 'startDate', variant: 'date' },
        { name: 'endDate', variant: 'date' },
      ],
    },
  ],
  career: [
    {
      number: '02.',
      label: '제목',
      fields: [{ name: 'title', placeholder: '제목을 작성해주세요.' }],
    },
    {
      number: '03.',
      label: '한 줄 설명',
      fields: [{ name: 'oneLineIntro', placeholder: '이 경험을 간단히 설명해주세요.' }],
    },
    {
      number: '04.',
      label: '회사/기관/단체명',
      fields: [{ name: 'company', placeholder: '회사/기관/단체명을 입력해주세요.' }],
    },
    {
      number: '05.',
      label: '고용 형태',
      fields: [{ name: 'employmentStatus', placeholder: '고용 형태를 선택해주세요' }],
    },
    {
      number: '06.',
      label: '날짜',
      fields: [
        { name: 'startDate', variant: 'date' },
        { name: 'endDate', variant: 'date' },
      ],
    },
  ],
  education: [
    {
      number: '02.',
      label: '제목',
      fields: [{ name: 'title', placeholder: '제목을 작성해주세요.' }],
    },
    {
      number: '03.',
      label: '한 줄 설명',
      fields: [{ name: 'oneLineIntro', placeholder: '이 경험을 간단히 설명해주세요.' }],
    },
    {
      number: '04.',
      label: '기관명',
      fields: [{ name: 'organizationName', placeholder: '교육기관명을 입력해주세요.' }],
    },
    {
      number: '05.',
      label: '수강명',
      fields: [{ name: 'name', placeholder: '수강명을 입력해주세요.' }],
    },
    {
      number: '06.',
      label: '날짜',
      fields: [
        { name: 'startDate', variant: 'date' },
        { name: 'endDate', variant: 'date' },
      ],
    },
  ],
  etc: [
    {
      number: '02.',
      label: '제목',
      fields: [{ name: 'title', placeholder: '제목을 작성해주세요.' }],
    },
    {
      number: '03.',
      label: '한 줄 설명',
      fields: [{ name: 'oneLineIntro', placeholder: '이 경험을 간단히 설명해주세요.' }],
    },
    {
      number: '04.',
      label: '날짜',
      fields: [
        { name: 'startDate', variant: 'date' },
        { name: 'endDate', variant: 'date' },
      ],
    },
  ],
};
