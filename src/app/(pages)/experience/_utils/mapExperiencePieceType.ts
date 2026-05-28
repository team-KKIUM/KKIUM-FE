import type { ExperiencePieceType } from '@/app/api/experience/types';
import type { ExperienceCategory } from '@/app/(pages)/experience/_components/ExperienceCategoryTab';

export type UiExperienceCategory = Exclude<ExperienceCategory, 'all'>;

const EXPERIENCE_PIECE_TYPE_MAP: Record<ExperiencePieceType, UiExperienceCategory> = {
  ACTIVITY: 'activity',
  CAREER: 'career',
  EDUCATION: 'education',
  ETC: 'etc',
};

export function normalizeExperiencePieceType(
  value: unknown,
): ExperiencePieceType | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim().toUpperCase();

  if (normalized in EXPERIENCE_PIECE_TYPE_MAP) {
    return normalized as ExperiencePieceType;
  }

  return undefined;
}

export function mapExperiencePieceTypeToCategory(
  value: unknown,
  fallback: UiExperienceCategory = 'etc',
): UiExperienceCategory {
  const normalized = normalizeExperiencePieceType(value);
  return normalized ? EXPERIENCE_PIECE_TYPE_MAP[normalized] : fallback;
}
