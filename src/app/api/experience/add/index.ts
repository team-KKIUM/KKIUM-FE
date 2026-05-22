import { api } from '@/app/api/client';

import type {
  ExperienceAnalyzeMaterialsRequest,
  ExperienceAnalyzeResponse,
  ExperienceCreateRequest,
  NotionPageListResponse,
} from './types';

export function analyzeExperiencePdf(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return api.post<ExperienceAnalyzeResponse>('/api/v1/experiences/analyze/pdf', formData);
}

export function analyzeExperienceMaterials({ file, pageId }: ExperienceAnalyzeMaterialsRequest) {
  if (!file && !pageId) {
    throw new Error('분석할 PDF 파일 또는 노션 페이지가 필요합니다.');
  }

  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  if (pageId) {
    formData.append('pageId', pageId);
  }

  return api.post<ExperienceAnalyzeResponse>('/api/v1/experiences/analyze', formData);
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

export function createExperience(request: ExperienceCreateRequest) {
  return api.post<null>('/api/v1/experiences', request);
}
