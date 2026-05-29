import { api } from '@/app/api/client';

import {
  updateProfileColorRequestSchema,
  userProfileResponseSchema,
  type UpdateProfileColorRequest,
} from './types';

export async function getUserProfile() {
  const response = await api.get<unknown>('/api/v1/users/me/profile');

  return userProfileResponseSchema.parse(response);
}

export async function updateUserProfileColor(request: UpdateProfileColorRequest) {
  const parsedRequest = updateProfileColorRequestSchema.parse(request);

  await api.patch<unknown>('/api/v1/users/me/profile-color', parsedRequest);
}

export async function deleteUserAccount() {
  await api.delete<unknown>('/api/v1/users/me/delete');
}
