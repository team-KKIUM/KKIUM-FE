import { ApiError, api } from '@/app/api/client';

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

export async function parseJdUrl(request: ParseJdUrlRequest) {
  const parsedRequest = parseJdUrlRequestSchema.parse(request);
  const response = await api.post<unknown>('/api/v1/jd/url', parsedRequest);

  try {
    assertParseableJdUrlResponse(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : UNPARSEABLE_JD_URL_MESSAGE;

    throw new ApiError({
      status: 0,
      code: 'JD_URL_UNPARSEABLE',
      message,
    });
  }

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
