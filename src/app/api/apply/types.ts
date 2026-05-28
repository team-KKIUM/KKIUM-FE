import { z } from 'zod';

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
});

export const jdResumeResponseSchema = z.object({
  id: z.number(),
  postingTitle: nullableStringSchema,
  companyName: nullableStringSchema,
  recruitmentField: nullableStringSchema,
  startDate: nullableStringSchema,
  endDate: nullableStringSchema,
  questions: z.array(jdResumeQuestionSchema),
});

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

export const UNPARSEABLE_JD_URL_MESSAGE = '공고 내용을 불러오지 못했어요. 다시 시도해주세요';

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

export const createJdAiRequestSchema = parsedJdUrlResponseSchema;

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
  jdInfo: jdInfoSchema.optional(),
  matchResult: jdMatchResultSchema.optional(),
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
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const hasExplicitTime = /t\d{2}:\d{2}/i.test(value);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateText = `${date.getFullYear()}.${month}.${day}`;

  if (!hasExplicitTime) {
    return dateText;
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${dateText} ${hours}:${minutes}`;
}
