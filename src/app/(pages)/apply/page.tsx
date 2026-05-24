'use client';

import { useState } from 'react';

import { ApplyAnalysis } from './_components/(analysis)/ApplyAnalysis';
import { ApplyJobHeader, type ApplyJobTab } from './_components/(analysis)/ApplyJobHeader';
import { ApplyMyExperience } from './_components/(analysis)/ApplyMyExperience';
import { ResizableSplit } from './_components/ResizableSplit';
import { applyJobMockData } from './_constants/applyJobMockData';

export default function ApplyPage() {
  const [activeTab, setActiveTab] = useState<ApplyJobTab>('analysis');

  return (
    <section className="w-full px-10">
      <div className="mx-auto flex w-full min-w-0 flex-col gap-8">
        <ApplyJobHeader
          title={applyJobMockData.title}
          companyName={applyJobMockData.companyName}
          jobField={applyJobMockData.jobField}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'analysis' ? (
          <ResizableSplit
            separatorAriaLabel="공고 분석과 내 경험 패널 너비 조절"
            left={<ApplyAnalysis />}
            right={<ApplyMyExperience />}
          />
        ) : (
          <ResizableSplit
            separatorAriaLabel="자기소개서 작성 패널 너비 조절"
            left={
              <p className="text-base font-bold leading-6 text-tertiary">
                자기소개서 작성 콘텐츠가 여기에 표시됩니다.
              </p>
            }
            right={null}
          />
        )}
      </div>
    </section>
  );
}
