import { z } from 'zod';

export const userProfileResponseSchema = z.object({
  name: z.string(),
  email: z.email().nullable(),
  illustrateId: z.number().int().min(0).max(4).nullable(),
});

export const updateProfileColorRequestSchema = z.object({
  illustrateId: z.number().int().min(0).max(4),
});

export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>;
export type UpdateProfileColorRequest = z.infer<typeof updateProfileColorRequestSchema>;
