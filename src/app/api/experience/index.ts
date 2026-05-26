import { api } from '@/app/api/client';

import type {
  ExperienceDetailResponse,
  ExperienceListResponse,
  ExperiencePieceType,
  ExperienceOrderUpdateRequest,
  ExperienceTitleUpdateRequest,
  ExperienceUpdateRequest,
} from './types';

export type GetExperiencesParams = {
  type?: ExperiencePieceType;
  keyword?: string;
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

export function updateExperience(experienceId: number, request: ExperienceUpdateRequest) {
  return api.patch<null>(`/api/v1/experiences/${experienceId}`, request);
}

export function updateExperienceTitle(
  experienceId: number,
  request: ExperienceTitleUpdateRequest,
) {
  return api.patch<null>(`/api/v1/experiences/${experienceId}/title`, request);
}

export function deleteExperience(experienceId: number) {
  return api.delete<null>(`/api/v1/experiences/${experienceId}`);
}

export function updateExperienceOrder(request: ExperienceOrderUpdateRequest) {
  return api.patch<null>('/api/v1/experiences/order', request);
}
