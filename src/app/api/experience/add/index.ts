import { api } from '@/app/api/client';

import type { ExperienceAnalyzeResponse, NotionPageListResponse } from './types';

export function analyzeExperiencePdf(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return api.post<ExperienceAnalyzeResponse>('/api/v1/experiences/analyze/pdf', formData);
}

export function getNotionAuthUrl() {
  return api.get<string>('/api/v1/experiences/notion/auth');
}

export function getNotionPages() {
  return api.get<NotionPageListResponse>('/api/v1/experiences/notion/pages');
}

export function analyzeExperienceNotion(pageId: string) {
  return api.post<ExperienceAnalyzeResponse>('/api/v1/experiences/analyze/notion', undefined, {
    params: { pageId },
  });
}
