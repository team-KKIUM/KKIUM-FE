import type { ExperiencePieceType } from '@/app/api/experience/types';
import { normalizeExperiencePieceType } from '@/app/(pages)/experience/_utils/mapExperiencePieceType';
import type { ResumeQuestionExperience } from '@/app/api/apply/types';

export function enrichResumeQuestionExperiences(
  experiences: ResumeQuestionExperience[],
  typeByExperienceId: Map<number, ExperiencePieceType>,
): ResumeQuestionExperience[] {
  return experiences.map((experience) => {
    const resolvedType =
      normalizeExperiencePieceType(experience.type) ??
      typeByExperienceId.get(experience.experienceId);

    if (!resolvedType) {
      return experience;
    }

    return {
      ...experience,
      type: resolvedType,
    };
  });
}
