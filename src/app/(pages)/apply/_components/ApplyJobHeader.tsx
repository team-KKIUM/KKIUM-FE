'use client';

import Link from 'next/link';

import { GraphIcon } from '@/assets/icons/GraphIcon';
import { SaveIcon } from '@/assets/icons/SaveIcon';
import { WriteIcon } from '@/assets/icons/WriteIcon';
import { ChevronLeftIcon } from '@/components/common/icons/ChevronLeftIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ApplyJobTab = 'analysis' | 'cover-letter';

export interface ApplyJobHeaderProps {
  title: string;
  companyName: string;
  jobField: string;
  activeTab: ApplyJobTab;
  onTabChange: (tab: ApplyJobTab) => void;
  onSave?: () => void;
  backHref?: string;
}

const TABS: { id: ApplyJobTab; label: string; icon: typeof GraphIcon }[] = [
  { id: 'analysis', label: '공고 분석', icon: GraphIcon },
  { id: 'cover-letter', label: '자기소개서 작성', icon: WriteIcon },
];

export function ApplyJobHeader({
  title,
  companyName,
  jobField,
  activeTab,
  onTabChange,
  onSave,
  backHref = '/apply/list',
}: ApplyJobHeaderProps) {
  return (
    <header className="flex w-full flex-col gap-4">
      <div className="flex items-start justify-between gap-4 self-stretch">
        <div className="flex min-w-0 items-start gap-1">
          <Link
            href={backHref}
            aria-label="뒤로 가기"
            className="flex size-8 shrink-0 items-center justify-center text-gray-main hover:text-strong"
          >
            <ChevronLeftIcon className="size-6" />
          </Link>

          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="text-2xl font-extrabold leading-9 text-strong">{title}</h1>
            <div className="inline-flex items-center gap-3">
              <span className="text-base font-bold leading-6 text-tertiary">{companyName}</span>
              <span className="h-4 w-px bg-border-bold" aria-hidden="true" />
              <span className="text-base font-bold leading-6 text-tertiary">{jobField}</span>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="line"
          size="default"
          leftIcon={<SaveIcon />}
          className="shrink-0"
          onClick={onSave}
        >
          저장하기
        </Button>
      </div>

      <nav className="inline-flex items-center gap-6" aria-label="지원 공고 작업">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 border-b-2 py-0.5 pr-1.5 transition-colors',
                isActive ? 'border-strong text-strong' : 'border-transparent text-tertiary',
              )}
              onClick={() => onTabChange(id)}
            >
              <span className="flex size-8 items-center justify-center rounded">
                <Icon className={cn('size-6', isActive ? 'text-strong' : 'text-tertiary')} />
              </span>
              <span className="text-base font-bold leading-6">{label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
