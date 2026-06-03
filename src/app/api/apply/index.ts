import { ApiError, api } from '@/app/api/client';
import { ZodError } from 'zod';

import {
  createJdAiRequestSchema,
  createJdAiResponseSchema,
  jdIdSchema,
  jdListParamsSchema,
  jdAnalysisResponseSchema,
  jdExperienceAnalysisResponseSchema,
  jdListResponseSchema,
  jdMutationResponseSchema,
  jdResumeResponseSchema,
  parseJdOcrResponseSchema,
  parseJdUrlRequestSchema,
  assertParseableJdUrlResponse,
  parsedJdUrlResponseSchema,
  UNPARSEABLE_JD_URL_MESSAGE,
  updateJdResumeRequestSchema,
  saveResumeRequestSchema,
  createJdResumeQuestionRequestSchema,
  updateJdResumeQuestionRequestSchema,
  createResumeAiDraftRequestSchema,
  createResumeAiDraftResponseSchema,
  resumeWritingGuideParamsSchema,
  resumeWritingGuideResponseSchema,
  resumeQuestionExperiencesResponseSchema,
  updateJdOrderRequestSchema,
  updateJdTitleRequestSchema,
  type CreateJdAiRequest,
  type CreateResumeAiDraftRequest,
  type JdListParams,
  type JdId,
  type ParseJdUrlRequest,
  type JdExperienceAnalysisResponse,
  type SaveResumeRequest,
  type CreateJdResumeQuestionRequest,
  type UpdateJdResumeQuestionRequest,
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

// 공고 분석 + 경험 매칭
export async function getJdAnalysisWithMatch(jdId: JdId) {
  const parsedJdId = parseJdId(jdId);
  const response = await api.get<unknown>(`/api/v1/jd/${parsedJdId}/analysis`);

  return jdAnalysisResponseSchema.parse(response);
}

export async function getJdExperienceAnalysis(
  jdId: JdId,
  experienceId: number,
): Promise<JdExperienceAnalysisResponse> {
  const parsedJdId = parseJdId(jdId);
  const parsedExperienceId = jdIdSchema.parse(experienceId);
  const response = await api.get<unknown>(
    `/api/v1/jd/${parsedJdId}/analysis/experiences/${parsedExperienceId}`,
  );

  return jdExperienceAnalysisResponseSchema.parse(response);
}

export async function updateJdResume(jdId: JdId, request: UpdateJdResumeRequest) {
  const parsedJdId = parseJdId(jdId);
  const parsedRequest = updateJdResumeRequestSchema.parse(request);
  const response = await api.patch<unknown>(`/api/v1/jd/${parsedJdId}/resume`, parsedRequest);

  return jdMutationResponseSchema.parse(response);
}

export async function saveJdResume(jdId: JdId, request: SaveResumeRequest) {
  const parsedJdId = parseJdId(jdId);
  const parsedRequest = saveResumeRequestSchema.parse(request);
  const response = await api.post<unknown>(`/api/v1/resume/${parsedJdId}`, parsedRequest);

  return jdMutationResponseSchema.parse(response);
}

export async function createJdResumeQuestion(jdId: JdId, request: CreateJdResumeQuestionRequest) {
  const parsedJdId = parseJdId(jdId);
  const parsedRequest = createJdResumeQuestionRequestSchema.parse(request);

  await api.post<unknown>(`/api/v1/jd/${parsedJdId}/resume/questions`, parsedRequest);
}

export async function updateJdResumeQuestion(
  jdId: JdId,
  questionId: number,
  request: UpdateJdResumeQuestionRequest,
) {
  const parsedJdId = parseJdId(jdId);
  const parsedQuestionId = jdIdSchema.parse(questionId);
  const parsedRequest = updateJdResumeQuestionRequestSchema.parse(request);

  await api.patch<unknown>(
    `/api/v1/resume/jd/${parsedJdId}/questions/${parsedQuestionId}`,
    parsedRequest,
  );
}

export async function deleteJdResumeQuestion(jdId: JdId, questionId: number) {
  const parsedJdId = parseJdId(jdId);
  const parsedQuestionId = jdIdSchema.parse(questionId);

  await api.delete<unknown>(
    `/api/v1/resume/jd/${parsedJdId}/questions/${parsedQuestionId}`,
  );
}

export async function createJdResumeAiDraft(
  jdId: JdId,
  questionId: number,
  request: CreateResumeAiDraftRequest,
) {
  const parsedJdId = parseJdId(jdId);
  const parsedQuestionId = jdIdSchema.parse(questionId);
  const parsedRequest = createResumeAiDraftRequestSchema.parse(request);
  const response = await api.post<unknown>(
    `/api/v1/resume/jd/${parsedJdId}/questions/${parsedQuestionId}/ai-draft`,
    parsedRequest,
  );

  return createResumeAiDraftResponseSchema.parse(response);
}

export async function getJdResumeWritingGuide(
  jdId: JdId,
  questionId: number,
  params: { experienceIds: number[] },
) {
  const parsedJdId = parseJdId(jdId);
  const parsedQuestionId = jdIdSchema.parse(questionId);
  const parsedParams = resumeWritingGuideParamsSchema.parse(params);
  const response = await api.get<unknown>(
    `/api/v1/resume/jd/${parsedJdId}/questions/${parsedQuestionId}/writing-guide`,
    { params: { experienceIds: parsedParams.experienceIds } },
  );

  return resumeWritingGuideResponseSchema.parse(response);
}

export async function getJdResumeQuestionExperiences(jdId: JdId, questionId: number) {
  const parsedJdId = parseJdId(jdId);
  const parsedQuestionId = jdIdSchema.parse(questionId);
  const response = await api.get<unknown>(
    `/api/v1/resume/jd/${parsedJdId}/questions/${parsedQuestionId}/experiences`,
  );

  return resumeQuestionExperiencesResponseSchema.parse(response);
}

function throwParseJdUrlAnalyzeError(error: unknown): never {
  if (error instanceof ApiError && error.code === 'JD_URL_UNPARSEABLE') {
    throw error;
  }

  if (error instanceof ZodError) {
    throw new ApiError({
      status: 0,
      code: 'JD_URL_UNPARSEABLE',
      message: UNPARSEABLE_JD_URL_MESSAGE,
    });
  }

  if (error instanceof Error && error.message === UNPARSEABLE_JD_URL_MESSAGE) {
    throw new ApiError({
      status: 0,
      code: 'JD_URL_UNPARSEABLE',
      message: UNPARSEABLE_JD_URL_MESSAGE,
    });
  }

  throw error;
}

export async function parseJdUrl(request: ParseJdUrlRequest) {
  const parsedRequest = parseJdUrlRequestSchema.parse(request);
  const response = await api.post<unknown>('/api/v1/jd/url', parsedRequest);

  try {
    assertParseableJdUrlResponse(response);
  } catch (error) {
    throwParseJdUrlAnalyzeError(error);
  }

  try {
    return parsedJdUrlResponseSchema.parse(response);
  } catch (error) {
    throwParseJdUrlAnalyzeError(error);
  }
}

export async function parseJdOcr(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post<unknown>('/api/v1/jd/ocr', formData);

  return parseJdOcrResponseSchema.parse(response);
}

export async function createJdAi(request: CreateJdAiRequest) {
  const parsedRequest = createJdAiRequestSchema.parse(request);
  const { url, ...rest } = parsedRequest;
  const body = url ? { ...rest, url } : rest;

  const response = await api.post<unknown>('/api/v1/jd/ai', body);

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
