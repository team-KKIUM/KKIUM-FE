'use client';

import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import * as React from 'react';

import { ExperienceBoard } from '@/app/(pages)/experience/_components/ExperienceBoard';
import type { ExperienceDetailPageContentProps } from '@/app/(pages)/experience/_components/ExperienceDetailPageContent';
import { ExperiencePageHeader } from '@/app/(pages)/experience/_components/ExperiencePageHeader';
import { useDebouncedValue } from '@/hooks/experience/useDebouncedValue';

const ExperienceDetailPageContent = dynamic<ExperienceDetailPageContentProps>(
  () =>
    import('@/app/(pages)/experience/_components/ExperienceDetailPageContent').then(
      (mod) => mod.ExperienceDetailPageContent,
    ),
  {
    ssr: false,
    loading: ExperienceDetailPageLoading,
  },
);

export function ExperiencePageContent() {
  const [keyword, setKeyword] = React.useState('');
  const debouncedKeyword = useDebouncedValue(keyword.trim(), 500);

  return (
    <ExperiencePageRouteContent
      keyword={keyword}
      debouncedKeyword={debouncedKeyword}
      onKeywordChange={setKeyword}
    />
  );
}

function ExperienceDetailPageLoading() {
  return (
    <div className="flex min-h-[calc(100vh-32px)] flex-col gap-[22px]">
      <header className="grid h-8 grid-cols-[32px_1fr_32px] items-center">
        <div className="size-8 animate-pulse rounded bg-gray-200" />
        <div className="mx-auto h-6 w-24 animate-pulse rounded bg-gray-200" />
        <div className="size-8 animate-pulse rounded bg-gray-200" />
      </header>
      <div className="flex animate-pulse flex-col gap-7">
        <div className="flex flex-col gap-3 rounded-xl border border-border-default bg-background-w px-[30px] py-5">
          <div className="h-8 w-2/3 rounded bg-gray-200" />
          <div className="h-5 w-full rounded bg-gray-100" />
          <div className="h-5 w-3/4 rounded bg-gray-100" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 rounded-xl bg-gray-100" />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-6 w-32 rounded bg-gray-200" />
          <div className="h-36 rounded-xl bg-gray-100" />
          <div className="h-36 rounded-xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

interface ExperiencePageRouteContentProps {
  keyword: string;
  debouncedKeyword: string;
  onKeywordChange: (keyword: string) => void;
}

function getDetailExperienceIdFromSearch() {
  const searchParams = new URLSearchParams(window.location.search);
  const selectedExperienceId = searchParams.get('selected');

  if (searchParams.get('view') !== 'detail') {
    return { experienceId: null, invalid: false };
  }

  const numericExperienceId = selectedExperienceId ? Number(selectedExperienceId) : null;

  if (
    numericExperienceId === null ||
    !Number.isInteger(numericExperienceId) ||
    numericExperienceId <= 0
  ) {
    return { experienceId: null, invalid: true };
  }

  return { experienceId: numericExperienceId, invalid: false };
}

function ExperiencePageRouteContent({
  keyword,
  debouncedKeyword,
  onKeywordChange,
}: ExperiencePageRouteContentProps) {
  const [detailExperienceId, setDetailExperienceId] = React.useState<number | null>(null);
  const [hasInvalidDetailParam, setHasInvalidDetailParam] = React.useState(false);

  const syncDetailRoute = React.useCallback(() => {
    const { experienceId, invalid } = getDetailExperienceIdFromSearch();

    setDetailExperienceId(experienceId);
    setHasInvalidDetailParam(invalid);
  }, []);

  React.useEffect(() => {
    syncDetailRoute();
    window.addEventListener('popstate', syncDetailRoute);

    return () => window.removeEventListener('popstate', syncDetailRoute);
  }, [syncDetailRoute]);

  const handleDetailViewRequest = React.useCallback((experienceId: string) => {
    const numericExperienceId = Number(experienceId);

    if (!Number.isInteger(numericExperienceId) || numericExperienceId <= 0) {
      setDetailExperienceId(null);
      setHasInvalidDetailParam(true);
      return;
    }

    setDetailExperienceId(numericExperienceId);
    setHasInvalidDetailParam(false);
  }, []);

  const handleDetailRouteExit = React.useCallback(() => {
    setDetailExperienceId(null);
    setHasInvalidDetailParam(false);
  }, []);

  if (hasInvalidDetailParam) {
    notFound();
  }

  if (detailExperienceId) {
    return (
      <ExperienceDetailPageContent
        experienceId={detailExperienceId}
        onRouteExit={handleDetailRouteExit}
      />
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-32px)] flex-col">
      <div className="flex flex-1 flex-col gap-5">
        <ExperiencePageHeader keyword={keyword} onKeywordChange={onKeywordChange} />
        <ExperienceBoard
          keyword={debouncedKeyword || undefined}
          onDetailViewRequest={handleDetailViewRequest}
        />
      </div>
    </div>
  );
}
