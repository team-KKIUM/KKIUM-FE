import { api } from '@/app/api/client';

import type { ExperienceDetailResponse, ExperienceListResponse, PieceType } from './types';

export type GetExperiencesParams = {
  type?: PieceType;
  cursor?: number | null;
  size?: number;
};

export function getExperiences(params?: GetExperiencesParams) {
  return api.get<ExperienceListResponse>('/api/v1/experiences', {
    params,
  });
}

export function getExperienceDetail(experienceId: number) {
  return api.get<ExperienceDetailResponse>(`/api/v1/experiences/${experienceId}`);
}
