'use client';

import { skipToken, useQuery } from '@tanstack/react-query';

import {
  getExperienceDetail,
  getExperiences,
  type GetExperiencesParams,
} from '@/app/api/experience';

export const experienceQueryKeys = {
  all: ['experiences'] as const,
  lists: () => [...experienceQueryKeys.all, 'list'] as const,
  list: (params?: GetExperiencesParams) =>
    [...experienceQueryKeys.lists(), params ?? null] as const,
  details: () => [...experienceQueryKeys.all, 'detail'] as const,
  detail: (experienceId: number | null | undefined) =>
    [...experienceQueryKeys.details(), experienceId ?? null] as const,
};

export function useExperiences(params?: GetExperiencesParams) {
  return useQuery({
    queryKey: experienceQueryKeys.list(params),
    queryFn: () => getExperiences(params),
  });
}

export function useExperienceDetail(experienceId: number | null | undefined) {
  return useQuery({
    queryKey: experienceQueryKeys.detail(experienceId),
    queryFn: experienceId != null ? () => getExperienceDetail(experienceId) : skipToken,
  });
}
