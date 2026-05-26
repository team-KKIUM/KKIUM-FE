'use client';

import { useState } from 'react';

import { ApplyAnalysis } from './_components/(analysis)/ApplyAnalysis';
import { ApplyJobHeader, type ApplyJobTab } from './_components/(analysis)/ApplyJobHeader';
import { ApplyMyExperience } from './_components/(analysis)/ApplyMyExperience';
import { ApplyCoverLetterSection } from './_components/(cover-letter)/ApplyCoverLetterSection';
import { ResizableSplit } from './_components/ResizableSplit';
import { applyJobMockData } from './_constants/applyMockData';
import { cn } from '@/lib/utils';

export default function ApplyPage() {
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
            title={applyJobMockData.title}
            companyName={applyJobMockData.companyName}
            jobField={applyJobMockData.jobField}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {activeTab === 'analysis' ? (
          <div className="px-10">
            <ResizableSplit
              separatorAriaLabel="공고 분석과 내 경험 패널 너비 조절"
              left={<ApplyAnalysis />}
              right={<ApplyMyExperience />}
            />
          </div>
        ) : (
          <ApplyCoverLetterSection />
        )}
      </div>
    </section>
  );
}
