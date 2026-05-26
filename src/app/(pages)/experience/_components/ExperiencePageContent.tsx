'use client';

import { Suspense } from 'react';
import * as React from 'react';

import { ExperienceBoard } from '@/app/(pages)/experience/_components/ExperienceBoard';
import { ExperiencePageHeader } from '@/app/(pages)/experience/_components/ExperiencePageHeader';
import { useDebouncedValue } from '@/hooks/experience/useDebouncedValue';

export function ExperiencePageContent() {
  const [keyword, setKeyword] = React.useState('');
  const debouncedKeyword = useDebouncedValue(keyword.trim(), 500);

  void debouncedKeyword;

  return (
    <div className="mx-16 flex min-h-[calc(100vh-32px)] flex-col">
      <div className="flex flex-1 flex-col gap-5">
        <ExperiencePageHeader keyword={keyword} onKeywordChange={setKeyword} />
        <Suspense>
          <ExperienceBoard />
        </Suspense>
      </div>
    </div>
  );
}
