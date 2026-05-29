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
    <section className="w-full">
      <div className="flex w-full min-w-0 max-w-[1560px] flex-col gap-5">
        <h1 className="max-w-[687px] text-2xl font-extrabold leading-9 text-gray-main">지원 관리</h1>

        <div className="flex w-full min-w-0 items-center">
          <SearchBar
            placeholder="공고명, 기업명, 모집 분야를 검색해주세요"
            className="h-11 w-[551px]"
            value={keyword}
            onChange={(event) => setKeyword(event.currentTarget.value)}
            onClear={() => setKeyword('')}
          />
          <div className="ml-auto shrink-0">
            <ApplyAddJobPostingModal />
          </div>
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
