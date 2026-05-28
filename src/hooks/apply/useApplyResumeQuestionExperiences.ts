'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { enrichResumeQuestionExperiences } from '@/app/(pages)/apply/_utils/enrichResumeQuestionExperiences';
import { mapResumeQuestionExperiencesToCoverLetter } from '@/app/(pages)/apply/_utils/mapResumeQuestionExperience';
import { getJdResumeQuestionExperiences } from '@/app/api/apply';
import type { ExperiencePieceType } from '@/app/api/experience/types';
import { getExperiences } from '@/app/api/experience';
import type { JdId } from '@/app/api/apply/types';
import { experienceQueryKeys } from '@/hooks/experience/useExperiences';

import { applyJobPostingQueryKeys } from './useApplyJobPostings';
import { useHasApplyApiAccess } from './useApplyAccessToken';

async function getExperienceTypeLookup(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  const cachedList = queryClient.getQueryData<Awaited<ReturnType<typeof getExperiences>>>(
    experienceQueryKeys.list(),
  );

  if (cachedList) {
    return new Map<number, ExperiencePieceType>(
      cachedList.experiences.map((experience) => [experience.experienceId, experience.type]),
    );
  }

  try {
    const list = await queryClient.fetchQuery({
      queryKey: experienceQueryKeys.list(),
      queryFn: () => getExperiences(),
      staleTime: 1000 * 60,
    });

    return new Map<number, ExperiencePieceType>(
      list.experiences.map((experience) => [experience.experienceId, experience.type]),
    );
  } catch {
    return new Map<number, ExperiencePieceType>();
  }
}

export function useApplyResumeQuestionExperiences(
  jdId: JdId | null | undefined,
  questionId: number | null | undefined,
  enabled = true,
) {
  const queryClient = useQueryClient();
  const hasApiAccess = useHasApplyApiAccess();
  const shouldQuery = enabled && hasApiAccess && jdId != null && questionId != null;

  return useQuery({
    queryKey: [
      ...applyJobPostingQueryKeys.detail(jdId),
      'question-experiences',
      questionId,
    ],
    queryFn: async () => {
      const [data, typeByExperienceId] = await Promise.all([
        getJdResumeQuestionExperiences(jdId!, questionId!),
        getExperienceTypeLookup(queryClient),
      ]);

      const enrichedExperiences = enrichResumeQuestionExperiences(
        data.experiences,
        typeByExperienceId,
      );

      return mapResumeQuestionExperiencesToCoverLetter(enrichedExperiences);
    },
    enabled: shouldQuery,
  });
}
