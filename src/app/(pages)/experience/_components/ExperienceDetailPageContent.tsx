'use client';

import * as React from 'react';

import {
  ExperienceDetailContent,
  type ExperienceDetailSaveValue,
} from '@/app/(pages)/experience/_components/ExperienceDetailContent';
import { mapExperienceDetailToItem } from '@/app/(pages)/experience/_utils/mapExperienceResponse';
import { mapExperienceItemToUpdateRequest } from '@/app/(pages)/experience/_utils/mapExperienceItemToUpdateRequest';
import { EmptyState } from '@/components/common/EmptyState';
import { ExpandIcon } from '@/components/common/icons/ExpandIcon';
import { XIcon } from '@/components/common/icons/XIcon';
import { useClientSearchParams } from '@/hooks/useClientSearchParams';
import { useExperienceDetail, useUpdateExperience } from '@/hooks/experience/useExperiences';

export interface ExperienceDetailPageContentProps {
  experienceId: number;
  onRouteExit?: () => void;
}

export function ExperienceDetailPageContent({
  experienceId,
  onRouteExit,
}: ExperienceDetailPageContentProps) {
  const searchParams = useClientSearchParams();
  const category = searchParams.get('category');
  const { data, isError, isPending } = useExperienceDetail(experienceId);
  const updateExperienceMutation = useUpdateExperience();
  const experience = React.useMemo(() => (data ? mapExperienceDetailToItem(data) : null), [data]);

  const handleCollapseToPanel = () => {
    const params = new URLSearchParams({ selected: String(experienceId) });

    if (category) {
      params.set('category', category);
    }

    window.history.pushState(null, '', `/experience?${params.toString()}`);
    onRouteExit?.();
  };

  const handleBackToExperience = () => {
    window.history.pushState(null, '', '/experience');
    onRouteExit?.();
  };

  const handleExperienceSave = async (nextExperience: ExperienceDetailSaveValue) => {
    if (!experience) {
      throw new Error('수정할 경험 정보를 확인하지 못했습니다.');
    }

    await updateExperienceMutation.mutateAsync({
      experienceId,
      request: mapExperienceItemToUpdateRequest({
        ...experience,
        ...nextExperience,
      }),
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-32px)] flex-col">
      <div className="flex w-full flex-1 flex-col gap-[22px]">
        <header className="grid h-8 grid-cols-[32px_1fr_32px] items-center">
          <button
            type="button"
            aria-label="경험 상세 패널로 돌아가기"
            className="flex size-8 cursor-pointer items-center justify-center text-primary"
            onClick={handleCollapseToPanel}
          >
            <ExpandIcon className="size-6" />
          </button>

          <h1 className="text-center heading-3-extra-bold text-strong">상세 경험</h1>

          <button
            type="button"
            aria-label="경험 상세 페이지 닫기"
            className="flex size-8 cursor-pointer items-center justify-center text-primary"
            onClick={handleBackToExperience}
          >
            <XIcon className="size-6" />
          </button>
        </header>

        {/* TODO: 상세 페이지 로딩/에러 UI가 확정되면 임시 EmptyState를 교체한다. */}
        {isPending ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState title="경험을 불러오는 중이에요" illustrationLabel="경험 상세 로딩 중" />
          </div>
        ) : isError || !experience ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              title="경험을 불러오지 못했어요"
              description="잠시 후 다시 시도해주세요"
              illustrationLabel="경험 상세 오류"
            />
          </div>
        ) : (
          <ExperienceDetailContent
            experience={experience}
            variant="page"
            onSave={handleExperienceSave}
          />
        )}
      </div>
    </div>
  );
}
