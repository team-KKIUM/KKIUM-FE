'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ExperiencePageHeaderProps = React.ComponentProps<'header'> & {
  keyword?: string;
  onKeywordChange?: (keyword: string) => void;
};

export function ExperiencePageHeader({
  keyword,
  onKeywordChange,
  className,
  ...props
}: ExperiencePageHeaderProps) {
  const router = useRouter();

  return (
    <header
      data-slot="experience-page-header"
      className={cn('flex w-full flex-col gap-[30px]', className)}
      {...props}
    >
      <h1 className="text-2xl font-extrabold text-strong">경험 관리</h1>

      <div className="flex w-full items-center justify-between">
        <SearchBar
          value={keyword}
          className="w-full max-w-[551px]"
          placeholder="경험 제목, 기술 태그, 역량 태그를 검색해주세요"
          onChange={(event) => onKeywordChange?.(event.currentTarget.value)}
          onClear={() => onKeywordChange?.('')}
        />
        <Button onClick={() => router.push('/experience/add')} leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
      </div>
    </header>
  );
}
