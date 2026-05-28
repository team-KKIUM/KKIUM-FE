import { api } from '@/app/api/client';

import {
  homeDashboardResponseSchema,
  type HomeDashboardResponse,
} from './types';

export async function getHomeDashboard() {
  const data = await api.get<HomeDashboardResponse>('/api/v1/home');
  return homeDashboardResponseSchema.parse(data);
}
