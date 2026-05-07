import * as React from 'react';

import { SearchBar } from '@/components/common/SearchBar';
import { cn } from '@/lib/utils';

export type ExperienceTopBarProps = React.ComponentProps<'div'> & {
  onProfileOpen?: () => void;
};

export function ExperienceTopBar({ className, onProfileOpen, ...props }: ExperienceTopBarProps) {
  return (
    <div
      data-slot="experience-top-bar"
      className={cn('flex w-full items-center justify-between', className)}
      {...props}
    >
      <SearchBar
        className="w-full max-w-[551px]"
        placeholder="경험 제목, 기술 태그, 역량 태그를 검색해주세요"
      />
      <button
        type="button"
        aria-label="프로필 열기"
        disabled={!onProfileOpen}
        className={cn(
          'size-[44.5px] overflow-hidden rounded-md border border-border-default bg-background-w',
          onProfileOpen ? 'cursor-pointer' : 'cursor-default',
        )}
        onClick={onProfileOpen}
      />
    </div>
  );
}
