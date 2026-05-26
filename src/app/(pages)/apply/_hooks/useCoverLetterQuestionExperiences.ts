'use client';

import * as React from 'react';

import type { ExperienceItem } from '@/app/(pages)/experience/_components/ExperienceCardGrid';

import { coverLetterQuestionExperiencesMock } from '../_constants/applyMockData';
import type { CoverLetterQuestionExperience } from '../_types/coverLetterQuestionExperience';

export type { CoverLetterQuestionExperience };

export function useCoverLetterQuestionExperiences(
  questionId: string,
  experiences: readonly ExperienceItem[],
  experiencesWithFitScore?: readonly CoverLetterQuestionExperience[],
) {
  return React.useMemo(() => {
    if (experiencesWithFitScore && experiencesWithFitScore.length > 0) {
      return experiencesWithFitScore;
    }

    if (experiences.length > 0) {
      return experiences.map((experience) => ({
        experience,
        fitScore: 0,
      }));
    }

    return coverLetterQuestionExperiencesMock;
  }, [experiences, experiencesWithFitScore]);
}
