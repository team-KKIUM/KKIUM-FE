import { z } from 'zod';

import { formatDateTimeDisplay } from '@/app/_utils/formatDateTimeDisplay';

export const jdIdSchema = z.coerce.number().int().positive();

const nullableStringSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => value ?? '');

const optionalStringSchema = nullableStringSchema;

export const jdListParamsSchema = z.object({
  page: z.number().int().min(0).optional(),
  size: z.number().int().positive().optional(),
  keyword: z.string().trim().optional(),
});

const jdListItemSchema = z
  .object({
    jdId: z.coerce.number().optional(),
    id: z.coerce.number().optional(),
    postingTitle: optionalStringSchema,
    title: optionalStringSchema,
    companyName: optionalStringSchema,
    recruitmentField: optionalStringSchema,
    field: optionalStringSchema,
    jobField: optionalStringSchema,
    startDate: optionalStringSchema,
    endDate: optionalStringSchema,
    isTarget: z.boolean().nullable().optional(),
    target: z.boolean().nullable().optional(),
    questions: z.array(z.string()).optional().default([]),
  })
  .passthrough();

export const jdListResponseSchema = z
  .union([
    z.object({
      content: z.array(jdListItemSchema),
      number: z.number().optional(),
      page: z.number().optional(),
      totalPages: z.number().optional(),
      last: z.boolean().optional(),
    }),
    z.object({
      jds: z.array(jdListItemSchema),
      page: z.number().optional(),
      totalPages: z.number().optional(),
      hasNext: z.boolean().optional(),
    }),
    z.array(jdListItemSchema),
  ])
  .transform((response) => {
    if (Array.isArray(response)) {
      return {
        page: 0,
        hasNext: false,
        items: response.map(mapJdListItem).filter((item): item is ApplyListItem => item != null),
      };
    }

    if ('content' in response) {
      const page = response.page ?? response.number ?? 0;

      return {
        page,
        hasNext:
          response.totalPages != null
            ? page + 1 < response.totalPages
            : response.last != null
              ? !response.last
              : false,
        items: response.content
          .map(mapJdListItem)
          .filter((item): item is ApplyListItem => item != null),
      };
    }

    return {
      page: response.page ?? 0,
      hasNext:
        response.hasNext ??
        (response.totalPages != null ? (response.page ?? 0) + 1 < response.totalPages : false),
      items: response.jds.map(mapJdListItem).filter((item): item is ApplyListItem => item != null),
    };
  });

export const updateJdTitleRequestSchema = z.object({
  title: z.string().trim().min(1, '공고 제목을 입력해주세요.'),
});

export const updateJdOrderRequestSchema = z.object({
  jdIds: z.array(z.coerce.number().int().positive()),
});

export const parseJdUrlRequestSchema = z.object({
  linkUrl: z.string().trim().url('공고 링크 형식이 올바르지 않습니다.'),
});

export const parseJdOcrResponseSchema = z.object({
  text: z.string(),
});

const jdResumeQuestionSchema = z.object({
  questionId: z.number(),
  orderNum: z.number(),
  content: nullableStringSchema,
  answer: nullableStringSchema,
  aiDraft: nullableStringSchema,
  hasAiDraft: z
    .union([z.boolean(), z.null(), z.undefined()])
    .transform((value) => value === true),
});

export const jdResumeResponseSchema = z.object({
  id: z.coerce.number().optional(),
  postingTitle: nullableStringSchema,
  companyName: nullableStringSchema,
  recruitmentField: nullableStringSchema,
  startDate: nullableStringSchema,
  endDate: nullableStringSchema,
  questions: z.array(jdResumeQuestionSchema).default([]),
});

export type JdResumeQuestion = z.infer<typeof jdResumeQuestionSchema>;

export const updateJdResumeRequestSchema = z.object({
  postingTitle: z.string().trim().min(1),
  companyName: z.string().trim().min(1),
  recruitmentField: z.string().trim().min(1),
  startDate: z.string(),
  endDate: z.string(),
  questions: z.array(
    z.object({
      questionId: z.number().int().positive(),
      content: z.string(),
      answer: z.string(),
    }),
  ),
});

export const saveResumeAnswerSchema = z.object({
  jdQuestionId: z.coerce.number().int().positive(),
  answerText: z.string(),
  experienceIds: z.array(z.coerce.number().int().positive()).default([]),
});

export const saveResumeRequestSchema = z.object({
  answers: z.array(saveResumeAnswerSchema),
});

export const createJdResumeQuestionRequestSchema = z.object({
  content: z.string().trim().min(1),
});

export const updateJdResumeQuestionRequestSchema = createJdResumeQuestionRequestSchema;

export const createResumeAiDraftRequestSchema = z.object({
  experienceIds: z.array(z.coerce.number().int().positive()).min(1).max(3),
});

export const createResumeAiDraftResponseSchema = z.object({
  draft: z.string(),
});

export const resumeWritingGuideParamsSchema = z.object({
  experienceIds: z.array(z.coerce.number().int().positive()).min(1).max(3),
});

export const resumeWritingGuideResponseSchema = z.object({
  coreKeywords: z
    .array(z.union([z.string(), z.null(), z.undefined()]).transform((value) => value ?? ''))
    .default([]),
  connectionToJd: nullableStringSchema,
  writingGuide: nullableStringSchema,
});

const resumeQuestionExperienceTypeSchema = z.enum(['ACTIVITY', 'CAREER', 'EDUCATION', 'ETC']);

const resumeQuestionExperienceTypeInputSchema = z
  .union([resumeQuestionExperienceTypeSchema, z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (value == null) {
      return undefined;
    }

    const normalized = String(value).trim().toUpperCase();

    if (
      normalized === 'ACTIVITY' ||
      normalized === 'CAREER' ||
      normalized === 'EDUCATION' ||
      normalized === 'ETC'
    ) {
      return normalized;
    }

    return undefined;
  });

export const resumeQuestionExperienceSchema = z
  .object({
    experienceId: z.coerce.number().int().positive(),
    title: nullableStringSchema,
    oneLineIntro: nullableStringSchema,
    startDate: nullableStringSchema,
    endDate: nullableStringSchema,
    usageFitScore: z.coerce.number(),
    type: resumeQuestionExperienceTypeInputSchema,
    pieceType: resumeQuestionExperienceTypeInputSchema,
    experienceType: resumeQuestionExperienceTypeInputSchema,
  })
  .transform(({ pieceType, experienceType, type, ...rest }) => ({
    ...rest,
    type: type ?? pieceType ?? experienceType,
    pieceType: undefined,
    experienceType: undefined,
  }));

export const resumeQuestionExperiencesResponseSchema = z.object({
  experiences: z.array(resumeQuestionExperienceSchema).default([]),
});

export const UNPARSEABLE_JD_URL_MESSAGE = '공고 내용을 불러오지 못했어요. 다시 시도해주세요';

function isJdUrlContentNullErrorMessage(message: string) {
  if (message.includes('expected string, received null') && message.includes('content')) {
    return true;
  }

  if (!message.trim().startsWith('[')) {
    return false;
  }

  try {
    const parsed = JSON.parse(message) as unknown;

    if (!Array.isArray(parsed)) {
      return false;
    }

    return parsed.some(
      (issue) =>
        typeof issue === 'object' &&
        issue != null &&
        'code' in issue &&
        issue.code === 'invalid_type' &&
        Array.isArray(issue.path) &&
        issue.path[0] === 'content',
    );
  } catch {
    return false;
  }
}

export function normalizeJobPostingAnalyzeErrorMessage(error: unknown): string | null {
  if (error == null) {
    return null;
  }

  if (error instanceof Error) {
    if (error.message === UNPARSEABLE_JD_URL_MESSAGE || isJdUrlContentNullErrorMessage(error.message)) {
      return UNPARSEABLE_JD_URL_MESSAGE;
    }

    return error.message;
  }

  return '공고 분석 중 문제가 발생했어요.';
}

const parsedJdUrlCriticalFieldKeys = [
  'postingTitle',
  'companyName',
  'recruitmentField',
  'content',
] as const;

function hasNonEmptyJdUrlField(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

// URL 파싱 결과에 등록 가능한 값이 하나도 없을 때 (주요 필드가 모두 null/빈 값)
export function assertParseableJdUrlResponse(data: unknown): void {
  if (typeof data !== 'object' || data == null) {
    throw new Error(UNPARSEABLE_JD_URL_MESSAGE);
  }

  const record = data as Record<string, unknown>;
  const hasParseableField = parsedJdUrlCriticalFieldKeys.some((key) =>
    hasNonEmptyJdUrlField(record[key]),
  );

  if (!hasParseableField) {
    throw new Error(UNPARSEABLE_JD_URL_MESSAGE);
  }
}

export const parsedJdUrlResponseSchema = z.object({
  url: nullableStringSchema,
  postingTitle: nullableStringSchema,
  companyName: nullableStringSchema,
  recruitmentField: nullableStringSchema,
  startDate: nullableStringSchema,
  endDate: nullableStringSchema,
  questions: z
    .array(z.union([z.string(), z.null(), z.undefined()]).transform((value) => value ?? ''))
    .nullable()
    .optional()
    .default([]),
  content: nullableStringSchema,
});

const createJdAiUrlSchema = z.preprocess(
  (value) => {
    if (value == null) return undefined;
    const trimmed = String(value).trim();
    return trimmed.length > 0 ? trimmed : undefined;
  },
  z.string().url('공고 링크 형식이 올바르지 않습니다.').optional(),
);

// 공고 등록 — url은 선택(OCR 링크 없음)
export const createJdAiRequestSchema = parsedJdUrlResponseSchema
  .omit({ url: true, questions: true, content: true })
  .extend({
    url: createJdAiUrlSchema,
    questions: z
      .array(z.string().max(300, '자기소개서 문항은 300자까지 입력할 수 있어요.'))
      .max(5, '자기소개서 문항은 최대 5개까지 등록할 수 있어요.'),
    content: z
      .string()
      .max(10_000, '공고 본문은 10,000자까지 입력할 수 있어요.'),
  });

export const createJdAiResponseSchema = z.object({
  jdId: z.number(),
});

export const jdMutationResponseSchema = z.unknown();

const jdAnalysisTagSchema = z.object({
  category: z.enum(['TECH', 'COMPETENCY']),
  field: z.string(),
});

const jdAnalysisExperienceSchema = z.object({
  experienceId: z.coerce.number(),
  type: z.enum(['ACTIVITY', 'CAREER', 'EDUCATION', 'ETC']),
  title: z.string(),
  oneLineIntro: z.string(),
  tags: z.array(jdAnalysisTagSchema).default([]),
  usageFitScore: z.coerce.number(),
});

const jdExperienceAnalysisKeywordSchema = z.object({
  keyword: nullableStringSchema,
  sources: z.array(nullableStringSchema).default([]),
});

const jdExperienceAnalysisDetailSchema = z.object({
  strengths: nullableStringSchema,
  weaknesses: nullableStringSchema,
  usageGuide: nullableStringSchema,
  highlightKeywords: z.array(jdExperienceAnalysisKeywordSchema).default([]),
});

export const jdExperienceAnalysisResponseSchema = z.object({
  experienceId: z.coerce.number(),
  analysis: jdExperienceAnalysisDetailSchema,
});

const jdInfoSchema = z.object({
  postingTitle: optionalStringSchema,
  companyName: optionalStringSchema,
  recruitmentField: optionalStringSchema,
  startDate: optionalStringSchema,
  endDate: optionalStringSchema,
  hardSkills: z.array(z.string()).default([]),
  softSkills: z.array(z.string()).default([]),
  mainResponsibilities: optionalStringSchema,
  requiredQualifications: optionalStringSchema,
  preferredQualifications: optionalStringSchema,
});

const jdMatchResultSchema = z.object({
  applicationFitScore: z.coerce.number(),
  experiences: z.array(jdAnalysisExperienceSchema).default([]),
});

function withNormalizedAnalysisStatus<T extends z.ZodRawShape>(shape: T) {
  return z
    .object({
      ...shape,
      analysisStatus: z.string().optional(),
      analysis_status: z.string().optional(),
    })
    .passthrough()
    .transform((data) => ({
      ...data,
      analysisStatus: data.analysisStatus ?? data.analysis_status ?? 'PENDING',
    }));
}

export const jdAnalysisResponseSchema = withNormalizedAnalysisStatus({
  // Pending일때 null 허용 
  jdInfo: jdInfoSchema.nullish(),
  matchResult: jdMatchResultSchema.nullish(),
});

export type JdAnalysisResponse = z.infer<typeof jdAnalysisResponseSchema>;
export type JdAnalysisExperience = z.infer<typeof jdAnalysisExperienceSchema>;
export type JdExperienceAnalysisResponse = z.infer<typeof jdExperienceAnalysisResponseSchema>;

export type JdId = string | number;
export type JdListParams = z.infer<typeof jdListParamsSchema>;
export type JdListResponse = z.infer<typeof jdListResponseSchema>;
export type CreateJdAiRequest = z.infer<typeof createJdAiRequestSchema>;
export type CreateJdAiResponse = z.infer<typeof createJdAiResponseSchema>;
export type ParseJdUrlRequest = z.infer<typeof parseJdUrlRequestSchema>;
export type ParseJdOcrResponse = z.infer<typeof parseJdOcrResponseSchema>;
export type JdResumeResponse = z.infer<typeof jdResumeResponseSchema>;
export type ParsedJdUrlResponse = z.infer<typeof parsedJdUrlResponseSchema>;
export type UpdateJdResumeRequest = z.infer<typeof updateJdResumeRequestSchema>;
export type SaveResumeRequest = z.infer<typeof saveResumeRequestSchema>;
export type CreateJdResumeQuestionRequest = z.infer<typeof createJdResumeQuestionRequestSchema>;
export type UpdateJdResumeQuestionRequest = z.infer<typeof updateJdResumeQuestionRequestSchema>;
export type CreateResumeAiDraftRequest = z.infer<typeof createResumeAiDraftRequestSchema>;
export type CreateResumeAiDraftResponse = z.infer<typeof createResumeAiDraftResponseSchema>;
export type ResumeWritingGuideResponse = z.infer<typeof resumeWritingGuideResponseSchema>;
export type ResumeQuestionExperience = z.infer<typeof resumeQuestionExperienceSchema>;
export type ResumeQuestionExperiencesResponse = z.infer<
  typeof resumeQuestionExperiencesResponseSchema
>;
export type UpdateJdOrderRequest = z.infer<typeof updateJdOrderRequestSchema>;
export type UpdateJdTitleRequest = z.infer<typeof updateJdTitleRequestSchema>;
export type JdMutationResponse = z.infer<typeof jdMutationResponseSchema>;

type JdListItem = z.infer<typeof jdListItemSchema>;
type ApplyListItem = {
  id: string;
  title: string;
  companyName: string;
  jobField: string;
  period: string;
  isTarget: boolean;
  coverLetter: {
    label: string;
    answer: string;
  }[];
};

function mapJdListItem(item: JdListItem) {
  const id = item.jdId ?? item.id;

  if (id == null) {
    return null;
  }

  return {
    id: String(id),
    title: item.postingTitle || item.title,
    companyName: item.companyName,
    jobField: item.recruitmentField || item.field || item.jobField,
    period: formatJdPeriod(item.startDate, item.endDate),
    isTarget: item.isTarget ?? item.target ?? false,
    coverLetter: item.questions.map((question) => ({
      label: question,
      answer: '',
    })),
  };
}

function formatJdPeriod(startDate: string, endDate: string) {
  if (!startDate && !endDate) {
    return '상시 채용';
  }

  return `${formatJdDate(startDate)}~${formatJdDate(endDate)}`.replace(/^~|~$/g, '');
}

function formatJdDate(value: string) {
  return formatDateTimeDisplay(value);
}
