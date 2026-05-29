'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteUserAccount,
  getUserProfile,
  updateUserProfileColor,
} from '@/app/api/user';
import type {
  UpdateProfileColorRequest,
  UserProfileResponse,
} from '@/app/api/user/types';

export const userProfileQueryKeys = {
  all: ['user-profile'] as const,
  me: () => [...userProfileQueryKeys.all, 'me'] as const,
};

export function useUserProfile(enabled = true) {
  return useQuery({
    queryKey: userProfileQueryKeys.me(),
    queryFn: getUserProfile,
    enabled,
  });
}

export function useUpdateUserProfileColor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateProfileColorRequest) => updateUserProfileColor(request),
    onSuccess: (_, request) => {
      queryClient.setQueryData<UserProfileResponse>(
        userProfileQueryKeys.me(),
        (profile) => (profile ? { ...profile, illustrateId: request.illustrateId } : profile),
      );
      void queryClient.invalidateQueries({
        queryKey: userProfileQueryKeys.me(),
        refetchType: 'active',
      });
    },
  });
}

export function useDeleteUserAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
