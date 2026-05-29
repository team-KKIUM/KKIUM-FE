'use client';

import { useQuery } from '@tanstack/react-query';

import { getHomeDashboard } from '@/app/api/home';

export const homeQueryKeys = {
  all: ['home'] as const,
  dashboard: () => [...homeQueryKeys.all, 'dashboard'] as const,
};

export function useHomeDashboard(enabled = true) {
  return useQuery({
    queryKey: homeQueryKeys.dashboard(),
    queryFn: () => getHomeDashboard(),
    enabled,
  });
}
