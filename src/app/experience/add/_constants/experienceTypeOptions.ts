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
      fields: [{ placeholder: '제목을 작성해주세요.' }],
    },
    {
      number: '03.',
      label: '한 줄 소개',
      fields: [{ placeholder: '제목을 작성해주세요.' }],
    },
    {
      number: '04.',
      label: '팀원 수',
      fields: [{ placeholder: '예시 : 5' }],
    },
    {
      number: '05.',
      label: '내 역할 및 기여도',
      fields: [{ placeholder: '기획자' }, { placeholder: '20%' }],
    },
    {
      number: '06.',
      label: '시작 날짜',
      fields: [{ variant: 'date' }],
    },
    {
      number: '07.',
      label: '종료 날짜',
      fields: [{ variant: 'date' }],
    },
  ],
  career: [
    {
      number: '02.',
      label: '제목',
      fields: [{ placeholder: '제목을 작성해주세요.' }],
    },
    {
      number: '03.',
      label: '한 줄 소개',
      fields: [{ placeholder: '제목을 작성해주세요.' }],
    },
    {
      number: '04.',
      label: '회사/기관/단체명',
      fields: [{ placeholder: '회사/기관/단체명을 입력해주세요.' }],
    },
    {
      number: '05.',
      label: '고용 형태',
      fields: [{ placeholder: '고용 형태를 선택해주세요' }],
    },
    {
      number: '06.',
      label: '시작 날짜',
      fields: [{ variant: 'date' }],
    },
    {
      number: '07.',
      label: '종료 날짜',
      fields: [{ variant: 'date' }],
    },
  ],
  education: [
    {
      number: '02.',
      label: '제목',
      fields: [{ placeholder: '제목을 작성해주세요.' }],
    },
    {
      number: '03.',
      label: '한 줄 소개',
      fields: [{ placeholder: '제목을 작성해주세요.' }],
    },
    {
      number: '04.',
      label: '기관명',
      fields: [{ placeholder: '교육기관명을 입력해주세요.' }],
    },
    {
      number: '05.',
      label: '수강명',
      fields: [{ placeholder: '수강명을 입력해주세요.' }],
    },
    {
      number: '06.',
      label: '시작 날짜',
      fields: [{ variant: 'date' }],
    },
    {
      number: '07.',
      label: '종료 날짜',
      fields: [{ variant: 'date' }],
    },
  ],
  etc: [
    {
      number: '02.',
      label: '제목',
      fields: [{ placeholder: '제목을 작성해주세요.' }],
    },
    {
      number: '03.',
      label: '한 줄 소개',
      fields: [{ placeholder: '제목을 작성해주세요.' }],
    },
    {
      number: '04.',
      label: '시작 날짜',
      fields: [{ variant: 'date' }],
    },
    {
      number: '05.',
      label: '종료 날짜',
      fields: [{ variant: 'date' }],
    },
  ],
};
