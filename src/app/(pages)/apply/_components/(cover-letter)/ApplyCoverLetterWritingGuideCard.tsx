'use client';

import type { ResumeWritingGuideResponse } from '@/app/api/apply/types';
import { cn } from '@/lib/utils';

export interface ApplyCoverLetterWritingGuideCardProps {
  className?: string;
  guide?: ResumeWritingGuideResponse | null;
  isLoading?: boolean;
  isError?: boolean;
}

function buildGuideSections(guide: ResumeWritingGuideResponse) {
  const coreKeywords = guide.coreKeywords.filter((keyword) => keyword.trim().length > 0);

  return [
    {
      title: '핵심 키워드',
      content: coreKeywords.join(', '),
    },
    {
      title: '공고와의 연결점',
      content: guide.connectionToJd.trim(),
    },
    {
      title: '작성 가이드',
      content: guide.writingGuide.trim(),
    },
  ].filter((section) => section.content.length > 0);
}

export function ApplyCoverLetterWritingGuideCard({
  className,
  guide,
  isLoading = false,
  isError = false,
}: ApplyCoverLetterWritingGuideCardProps) {
  const sections = guide ? buildGuideSections(guide) : [];

  return (
    <article
      data-slot="cover-letter-writing-guide-card"
      className={cn(
        'flex w-full flex-col gap-5 overflow-hidden rounded-xl border border-brand bg-background-w px-6 py-5',
        className,
      )}
    >
      <div className="flex w-full flex-col gap-4">
        <header className="flex w-full flex-col gap-0.5">
          <h3 className="text-lg font-bold leading-7 text-strong">이렇게 작성해보세요</h3>
          <p className="body-3-regular text-gray-700">
            AI가 공고와 자기소개서 문항, 선택한 경험을 함께 분석해 어떤 방향으로 작성하면
            좋을지 가이드를 제시해줘요.
          </p>
        </header>

        <hr className="w-full border-0 border-t border-border-bold" />

        <div className="flex w-full flex-col gap-3">
          {isLoading ? (
            <p className="body-1-regular text-secondary">작성 가이드를 생성하고 있어요…</p>
          ) : isError ? (
            <p className="body-1-regular text-secondary">작성 가이드를 불러오지 못했습니다.</p>
          ) : sections.length > 0 ? (
            sections.map((section) => (
              <section key={section.title} className="flex w-full flex-col gap-1 rounded-lg">
                <h4 className="body-1-bold text-strong">{section.title}</h4>
                <p className="body-1-regular text-secondary">{section.content}</p>
              </section>
            ))
          ) : (
            <p className="body-1-regular text-secondary">표시할 작성 가이드가 없습니다.</p>
          )}
        </div>
      </div>
    </article>
  );
}
