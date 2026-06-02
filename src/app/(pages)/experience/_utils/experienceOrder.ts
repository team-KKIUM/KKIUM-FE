import type { ExperienceCategory } from '@/app/(pages)/experience/_utils/ExperienceCategory';

export type ExperienceOrderMap = Record<ExperienceCategory, string[]>;

export interface ExperienceOrderItem {
  id: string;
  type: Exclude<ExperienceCategory, 'all'>;
}

export const EXPERIENCE_ORDER_CATEGORIES = [
  'all',
  'activity',
  'career',
  'education',
  'etc',
] as const satisfies readonly ExperienceCategory[];

function areStringArraysEqual(source: string[], target: string[]) {
  return source.length === target.length && source.every((item, index) => item === target[index]);
}

function createEmptyExperienceOrderMap(): ExperienceOrderMap {
  return {
    all: [],
    activity: [],
    career: [],
    education: [],
    etc: [],
  };
}

function getExperienceIdsByCategory(
  experiences: readonly ExperienceOrderItem[],
  category: Exclude<ExperienceCategory, 'all'>,
) {
  return experiences
    .filter((experience) => experience.type === category)
    .map((experience) => experience.id);
}

export function createExperienceOrderMap(
  experiences: readonly ExperienceOrderItem[],
): ExperienceOrderMap {
  return {
    all: experiences.map((experience) => experience.id),
    activity: getExperienceIdsByCategory(experiences, 'activity'),
    career: getExperienceIdsByCategory(experiences, 'career'),
    education: getExperienceIdsByCategory(experiences, 'education'),
    etc: getExperienceIdsByCategory(experiences, 'etc'),
  };
}

export function syncExperienceOrderMap(
  currentOrderMap: ExperienceOrderMap,
  experiences: readonly ExperienceOrderItem[],
  syncedCategory: ExperienceCategory,
): ExperienceOrderMap {
  const defaultOrderMap = createExperienceOrderMap(experiences);

  if (syncedCategory === 'all') {
    return defaultOrderMap;
  }

  return EXPERIENCE_ORDER_CATEGORIES.reduce<ExperienceOrderMap>((nextOrderMap, category) => {
    if (category === syncedCategory) {
      nextOrderMap[category] = defaultOrderMap[category];
      return nextOrderMap;
    }

    const nextIds = defaultOrderMap[category];
    const nextIdSet = new Set(nextIds);
    const currentIds = currentOrderMap[category] ?? [];
    const currentIdSet = new Set(currentIds);
    const preservedIds = currentIds.filter((id) => nextIdSet.has(id));
    const addedIds = nextIds.filter((id) => !currentIdSet.has(id));

    nextOrderMap[category] = [...preservedIds, ...addedIds];

    return nextOrderMap;
  }, createEmptyExperienceOrderMap());
}

export function removeExperienceFromOrderMap(
  orderMap: ExperienceOrderMap,
  experienceId: string,
): ExperienceOrderMap {
  return EXPERIENCE_ORDER_CATEGORIES.reduce<ExperienceOrderMap>((nextOrderMap, category) => {
    nextOrderMap[category] = (orderMap[category] ?? []).filter((id) => id !== experienceId);
    return nextOrderMap;
  }, createEmptyExperienceOrderMap());
}

export function parseOrderedExperienceIds(orderedExperienceIds: readonly string[]) {
  const parsedExperienceIds = orderedExperienceIds.map(Number);

  if (
    parsedExperienceIds.some((experienceId) => !Number.isInteger(experienceId) || experienceId <= 0)
  ) {
    return null;
  }

  return parsedExperienceIds;
}

export function areExperienceOrderMapsEqual(
  source: ExperienceOrderMap,
  target: ExperienceOrderMap,
) {
  return EXPERIENCE_ORDER_CATEGORIES.every((category) =>
    areStringArraysEqual(source[category], target[category]),
  );
}
