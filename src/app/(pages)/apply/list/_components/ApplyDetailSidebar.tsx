'use client';

import Image from 'next/image';
import * as React from 'react';

import { CalendarIcon } from '@/components/common/icons/CalendarIcon';
import { XIcon } from '@/components/common/icons/XIcon';
import { cn } from '@/lib/utils';

import type { ApplyListItem } from '../_constants/applyListMockData';

export interface ApplyDetailSidebarProps {
  open: boolean;
  item: ApplyListItem | null;
  onClose: () => void;
}

export function ApplyDetailSidebar({ open, item, onClose }: ApplyDetailSidebarProps) {
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    if (!item) {
      setEntered(false);
      return;
    }

    if (open) {
      setEntered(false);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true));
      });
      return () => cancelAnimationFrame(id);
    }

    setEntered(false);
  }, [open, item]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!item) {
    return null;
  }

  const panelOpen = open && entered;

  return (
    <>
      <button
        type="button"
        aria-label="사이드바 닫기"
        className={cn(
          'fixed inset-0 z-40 bg-transparent',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-detail-title"
        className={cn(
          'fixed top-0 right-0 z-50 flex h-screen w-[500px] flex-col overflow-hidden bg-background-w shadow-xl',
          'shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.10)]',
          'transition-transform duration-300 ease-out will-change-transform',
          panelOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-6 px-6 pt-8">
          <div className="flex shrink-0 flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-5">
                <h2
                  id="apply-detail-title"
                  className="text-2xl leading-9 font-bold text-strong"
                >
                  {item.title}
                </h2>

                <div className="flex items-center gap-5">
                  <div className="flex w-20 shrink-0 flex-col items-center gap-0.5">
                    <Image
                      src="/career-selected.svg"
                      alt=""
                      width={64}
                      height={64}
                      className="size-16 shrink-0"
                    />
                  </div>

                  <div className="flex min-w-0 flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="size-5 text-strong" />
                        <span className="body-3-bold text-strong">모집 기간</span>
                      </div>
                      <span className="body-3-bold text-secondary">{item.period}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="body-3-bold text-strong">기업명</span>
                      <span className="body-3-bold text-secondary">{item.companyName}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="body-3-bold text-strong">모집 분야</span>
                      <span className="body-3-bold text-secondary">{item.jobField}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                aria-label="닫기"
                className="flex size-8 shrink-0 items-center justify-center rounded bg-background-w text-gray-main"
                onClick={onClose}
              >
                <XIcon className="size-6" />
              </button>
            </div>

            <div className="h-px w-full max-w-[452px] bg-gray-300" />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pb-6">
            <div className="flex max-w-[452px] flex-col gap-3">
              <QuestionBlock
                index={1}
                label="지원동기"
                answer={item.coverLetter.motivation}
              />
              <QuestionBlock
                index={2}
                label="핵심 경험"
                answer={item.coverLetter.experience}
              />
              <QuestionBlock
                index={3}
                label="입사 후 포부"
                answer={item.coverLetter.aspiration}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function QuestionBlock({
  index,
  label,
  answer,
}: {
  index: number;
  label: string;
  answer: string;
}) {
  return (
    <div className="flex w-full max-w-[452px] flex-col gap-1.5">
      <div className="flex items-center gap-1 px-2">
        <span className="body-1-bold text-mint-300">Q{index}.</span>
        <span className="body-1-bold text-gray-800">{label}</span>
      </div>
      <div className="flex min-h-36 flex-col gap-2 rounded-2xl bg-background-default px-3 py-4">
        <p className="body-3-bold text-gray-700">{answer}</p>
      </div>
    </div>
  );
}
