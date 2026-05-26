import { api } from '@/app/api/client';

import {
  createJdAiRequestSchema,
  createJdAiResponseSchema,
  jdIdSchema,
  jdListParamsSchema,
  jdListResponseSchema,
  jdMutationResponseSchema,
  jdResumeResponseSchema,
  parseJdOcrResponseSchema,
  parseJdUrlRequestSchema,
  parsedJdUrlResponseSchema,
  updateJdResumeRequestSchema,
  updateJdOrderRequestSchema,
  updateJdTitleRequestSchema,
  type CreateJdAiRequest,
  type JdListParams,
  type JdId,
  type ParseJdUrlRequest,
  type UpdateJdResumeRequest,
  type UpdateJdOrderRequest,
  type UpdateJdTitleRequest,
} from './types';

function parseJdId(jdId: JdId) {
  return jdIdSchema.parse(jdId);
}

export async function getJdList(params: JdListParams = {}) {
  const parsedParams = jdListParamsSchema.parse(params);
  const response = await api.get<unknown>('/api/v1/jd', {
    params: parsedParams,
  });

  return jdListResponseSchema.parse(response);
}

export async function updateJdTitle(jdId: JdId, request: UpdateJdTitleRequest) {
  const parsedJdId = parseJdId(jdId);
  const parsedRequest = updateJdTitleRequestSchema.parse(request);
  const response = await api.patch<unknown>(`/api/v1/jd/${parsedJdId}/title`, parsedRequest);

  return jdMutationResponseSchema.parse(response);
}

export async function updateJdOrder(request: UpdateJdOrderRequest) {
  const parsedRequest = updateJdOrderRequestSchema.parse(request);
  const response = await api.patch<unknown>('/api/v1/jd/order', parsedRequest);

  return jdMutationResponseSchema.parse(response);
}

export async function getJdResume(jdId: JdId) {
  const parsedJdId = parseJdId(jdId);
  const response = await api.get<unknown>(`/api/v1/jd/${parsedJdId}/resume`);

  return jdResumeResponseSchema.parse(response);
}

export async function updateJdResume(jdId: JdId, request: UpdateJdResumeRequest) {
  const parsedJdId = parseJdId(jdId);
  const parsedRequest = updateJdResumeRequestSchema.parse(request);
  const response = await api.patch<unknown>(`/api/v1/jd/${parsedJdId}/resume`, parsedRequest);

  return jdMutationResponseSchema.parse(response);
}

export async function parseJdUrl(request: ParseJdUrlRequest) {
  const parsedRequest = parseJdUrlRequestSchema.parse(request);
  const response = await api.post<unknown>('/api/v1/jd/url', parsedRequest);

  return parsedJdUrlResponseSchema.parse(response);
}

export async function parseJdOcr(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post<unknown>('/api/v1/jd/ocr', formData);

  return parseJdOcrResponseSchema.parse(response);
}

export async function createJdAi(request: CreateJdAiRequest) {
  const parsedRequest = createJdAiRequestSchema.parse(request);
  const response = await api.post<unknown>('/api/v1/jd/ai', parsedRequest);

  return createJdAiResponseSchema.parse(response);
}

export async function toggleJdTarget(jdId: JdId) {
  const parsedJdId = parseJdId(jdId);
  const response = await api.patch<unknown>(`/api/v1/jd/${parsedJdId}/target`);

  return jdMutationResponseSchema.parse(response);
}

export async function deleteJd(jdId: JdId) {
  const parsedJdId = parseJdId(jdId);
  const response = await api.delete<unknown>(`/api/v1/jd/${parsedJdId}`);

  return jdMutationResponseSchema.parse(response);
}
