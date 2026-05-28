'use client';

import { useQuery } from '@tanstack/react-query';

import { getHomeDashboard } from '@/app/api/home';

export const homeQueryKeys = {
  all: ['home'] as const,
  dashboard: () => [...homeQueryKeys.all, 'dashboard'] as const,
};

export function useHomeDashboard() {
  return useQuery({
    queryKey: homeQueryKeys.dashboard(),
    queryFn: async () => {
      console.log('[HomeDashboard] API request start', {
        endpoint: 'GET /api/v1/home',
      });

      try {
        const data = await getHomeDashboard();

        console.log('[HomeDashboard] API success', {
          endpoint: 'GET /api/v1/home',
          response: data,
        });

        return data;
      } catch (error) {
        console.error('[HomeDashboard] API error', {
          endpoint: 'GET /api/v1/home',
          error,
        });
        throw error;
      }
    },
  });
}
