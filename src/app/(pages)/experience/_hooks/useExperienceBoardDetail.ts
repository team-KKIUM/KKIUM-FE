'use client';

import * as React from 'react';

import type { ExperienceItem } from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import { mapExperienceDetailToItem } from '@/app/(pages)/experience/_utils/mapExperienceResponse';
import { useExperienceDetail } from '@/hooks/experience/useExperiences';

interface UseExperienceBoardDetailParams {
  selectedExperienceId?: string;
  selectedExperience?: ExperienceItem;
  panelOpen: boolean;
}

export function useExperienceBoardDetail({
  selectedExperienceId,
  selectedExperience,
  panelOpen,
}: UseExperienceBoardDetailParams) {
  const selectedExperienceNumericId = selectedExperienceId ? Number(selectedExperienceId) : null;
  const selectedExperienceDetailId = isValidExperienceId(selectedExperienceNumericId)
    ? selectedExperienceNumericId
    : null;
  const {
    data: selectedExperienceDetail,
    isError: isDetailError,
    isFetching: isDetailFetching,
    isPending: isDetailPending,
  } = useExperienceDetail(selectedExperienceDetailId);
  const selectedExperienceDetailMatches =
    selectedExperienceDetail?.experienceId === selectedExperienceDetailId;
  const selectedExperienceDetailItem = React.useMemo(
    () =>
      selectedExperienceDetail && selectedExperienceDetailMatches
        ? mapExperienceDetailToItem(selectedExperienceDetail)
        : null,
    [selectedExperienceDetail, selectedExperienceDetailMatches],
  );

  const panelExperience = selectedExperienceDetailItem ?? selectedExperience;
  const showDetailLoading =
    panelOpen &&
    selectedExperienceDetailId !== null &&
    (isDetailPending || (isDetailFetching && !selectedExperienceDetailMatches));

  return {
    panelExperience,
    isDetailError,
    showDetailLoading,
  };
}

function isValidExperienceId(experienceId: number | null) {
  return experienceId !== null && Number.isInteger(experienceId) && experienceId > 0;
}
