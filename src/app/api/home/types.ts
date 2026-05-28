import { z } from 'zod';

const nullableStringSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => value ?? '');

const stringArraySchema = z
  .array(z.union([z.string(), z.null(), z.undefined()]).transform((value) => value ?? ''))
  .default([]);

const homeTargetJdSchema = z.object({
  jdId: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
  id: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
  companyName: nullableStringSchema,
  recruitmentField: nullableStringSchema,
  startDate: nullableStringSchema,
  endDate: nullableStringSchema,
  hardSkills: stringArraySchema,
  softSkills: stringArraySchema,
  applicationFitScore: z.coerce.number(),
});

const homeJobTypeSchema = z.object({
  typeName: nullableStringSchema,
});

const homeExperienceDistributionItemSchema = z.object({
  type: z.string(),
  count: z.coerce.number(),
  percentage: z.coerce.number(),
});

export const homeDashboardResponseSchema = z.object({
  targetJds: z.array(homeTargetJdSchema).default([]),
  totalExperienceCount: z.coerce.number(),
  thisMonthExperienceCount: z.coerce.number(),
  lastMonthDiff: z.coerce.number().default(0),
  jobType: homeJobTypeSchema.nullable().optional(),
  experienceDistribution: z.array(homeExperienceDistributionItemSchema).default([]),
});

export type HomeDashboardResponse = z.infer<typeof homeDashboardResponseSchema>;
export type HomeTargetJd = HomeDashboardResponse['targetJds'][number];
