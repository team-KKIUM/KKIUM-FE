export type ExperienceCategory = 'all' | 'activity' | 'career' | 'education' | 'etc';
export type ConcreteExperienceCategory = Exclude<ExperienceCategory, 'all'>;

export const EXPERIENCE_CATEGORY_META = {
  activity: {
    label: '학내외활동',
    defaultIconSrc: '/activity-default.svg',
    selectedIconSrc: '/activity-selected.svg',
  },
  career: {
    label: '인턴/직무경력',
    defaultIconSrc: '/career-default.svg',
    selectedIconSrc: '/career-selected.svg',
  },
  education: {
    label: '수강/교육',
    defaultIconSrc: '/education-default.svg',
    selectedIconSrc: '/education-selected.svg',
  },
  etc: {
    label: '기타',
    defaultIconSrc: '/etc-default.svg',
    selectedIconSrc: '/etc-selected.svg',
  },
} as const satisfies Record<
  ConcreteExperienceCategory,
  {
    label: string;
    defaultIconSrc: string;
    selectedIconSrc: string;
  }
>;

export const EXPERIENCE_CATEGORIES = Object.keys(
  EXPERIENCE_CATEGORY_META,
) as ConcreteExperienceCategory[];

export const EXPERIENCE_CATEGORY_ITEMS = {
  all: {
    label: '전체',
  },
  ...EXPERIENCE_CATEGORY_META,
} as const satisfies Record<
  ExperienceCategory,
  {
    label: string;
    defaultIconSrc?: string;
    selectedIconSrc?: string;
  }
>;

export function getExperienceCategoryMeta(category: ConcreteExperienceCategory) {
  return EXPERIENCE_CATEGORY_META[category];
}

export function getExperienceCategoryLabel(category: ExperienceCategory) {
  return EXPERIENCE_CATEGORY_ITEMS[category].label;
}

export function getExperienceCategoryIconSrc(
  category: ConcreteExperienceCategory,
  selected = true,
) {
  const meta = getExperienceCategoryMeta(category);

  return selected ? meta.selectedIconSrc : meta.defaultIconSrc;
}
