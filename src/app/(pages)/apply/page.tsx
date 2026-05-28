'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { ApplyAnalysis } from './_components/(analysis)/ApplyAnalysis';
import { ApplyJobHeader, type ApplyJobTab } from './_components/(analysis)/ApplyJobHeader';
import { ApplyMyExperience } from './_components/(analysis)/ApplyMyExperience';
import { ApplyCoverLetterSection } from './_components/(cover-letter)/ApplyCoverLetterSection';
import { ResizableSplit } from './_components/ResizableSplit';
import { useApplyJobPostingSnapshot } from '@/hooks/apply/useApplyJobPostingSnapshot';
import { cn } from '@/lib/utils';

export default function ApplyPage() {
  const searchParams = useSearchParams();
  const jdId = searchParams.get('jdId');
  const { jobPosting } = useApplyJobPostingSnapshot(jdId);
  const [activeTab, setActiveTab] = useState<ApplyJobTab>('analysis');
  const isCoverLetterTab = activeTab === 'cover-letter';

  return (
    <section
      className={cn('flex w-full flex-col', isCoverLetterTab && 'min-h-[calc(100dvh-30px)]')}
    >
      <div
        className={cn(
          'mx-auto flex w-full min-w-0 flex-col gap-8',
          isCoverLetterTab && 'min-h-0 flex-1',
        )}
      >
        <div className="shrink-0 px-10">
          <ApplyJobHeader
            title={jobPosting?.title ?? ''}
            companyName={jobPosting?.companyName ?? ''}
            jobField={jobPosting?.jobField ?? ''}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {activeTab === 'analysis' ? (
          <div className="px-10">
            <ResizableSplit
              separatorAriaLabel="공고 분석과 내 경험 패널 너비 조절"
              left={<ApplyAnalysis jdId={jdId} />}
              right={<ApplyMyExperience jdId={jdId} />}
            />
          </div>
        ) : (
          <ApplyCoverLetterSection jdId={jdId} />
        )}
      </div>
    </section>
  );
}
