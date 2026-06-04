'use client';

import { notFound, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import * as React from 'react';

import { ApplyAddJobPostingModal } from '@/app/(pages)/apply/list/_components/ApplyAddJobPostingModal';
import { ApplyDetailPageContent } from '@/app/(pages)/apply/list/_components/ApplyDetailPageContent';
import { ApplyListSection } from '@/app/(pages)/apply/list/_components/ApplyListSection';
import { SearchBar } from '@/components/common/SearchBar';
import { useDebouncedValue } from '@/hooks/experience/useDebouncedValue';

function ApplyListPageRouteContent() {
  const searchParams = useSearchParams();
  const selectedJdId = searchParams.get('selected');
  const isDetailView = searchParams.get('view') === 'detail';
  const [keyword, setKeyword] = React.useState('');
  const debouncedKeyword = useDebouncedValue(keyword.trim(), 300);

  if (isDetailView) {
    if (!selectedJdId) {
      notFound();
    }

    return <ApplyDetailPageContent jdId={selectedJdId} />;
  }

  return (
    <section className="flex min-h-[calc(100vh-32px)] w-full flex-col">
      <link rel="preload" as="image" href="/logo-light.svg" />
      <link rel="preload" as="image" href="/career-selected.svg" />
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-[30px]">
        <h1 className="text-2xl font-extrabold text-strong">지원 관리</h1>

        <div className="flex w-full items-center justify-between gap-5">
          <SearchBar
            placeholder="공고명, 기업명, 모집 분야를 검색해주세요"
            className="w-full max-w-[551px]"
            value={keyword}
            onChange={(event) => setKeyword(event.currentTarget.value)}
            onClear={() => setKeyword('')}
          />
          <ApplyAddJobPostingModal />
        </div>

        <ApplyListSection keyword={debouncedKeyword} initialSelectedJdId={selectedJdId} />
      </div>
    </section>
  );
}

export function ApplyListPageContent() {
  return (
    <Suspense>
      <ApplyListPageRouteContent />
    </Suspense>
  );
}
