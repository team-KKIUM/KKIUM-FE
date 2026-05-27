'use client';

import { notFound, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import * as React from 'react';

import { ExperienceBoard } from '@/app/(pages)/experience/_components/ExperienceBoard';
import { ExperienceDetailPageContent } from '@/app/(pages)/experience/_components/ExperienceDetailPageContent';
import { ExperiencePageHeader } from '@/app/(pages)/experience/_components/ExperiencePageHeader';
import { useDebouncedValue } from '@/hooks/experience/useDebouncedValue';

export function ExperiencePageContent() {
  const [keyword, setKeyword] = React.useState('');
  const debouncedKeyword = useDebouncedValue(keyword.trim(), 500);

  return (
    <Suspense>
      <ExperiencePageRouteContent
        keyword={keyword}
        debouncedKeyword={debouncedKeyword}
        onKeywordChange={setKeyword}
      />
    </Suspense>
  );
}

interface ExperiencePageRouteContentProps {
  keyword: string;
  debouncedKeyword: string;
  onKeywordChange: (keyword: string) => void;
}

function ExperiencePageRouteContent({
  keyword,
  debouncedKeyword,
  onKeywordChange,
}: ExperiencePageRouteContentProps) {
  const searchParams = useSearchParams();
  const selectedExperienceId = searchParams.get('selected');
  const isDetailView = searchParams.get('view') === 'detail';

  if (isDetailView) {
    const numericExperienceId = selectedExperienceId ? Number(selectedExperienceId) : null;

    if (
      numericExperienceId === null ||
      !Number.isInteger(numericExperienceId) ||
      numericExperienceId <= 0
    ) {
      notFound();
    }

    return <ExperienceDetailPageContent experienceId={numericExperienceId} />;
  }

  return (
    <div className="mx-16 flex min-h-[calc(100vh-32px)] flex-col">
      <div className="flex flex-1 flex-col gap-5">
        <ExperiencePageHeader keyword={keyword} onKeywordChange={onKeywordChange} />
        <ExperienceBoard keyword={debouncedKeyword || undefined} />
      </div>
    </div>
  );
}
