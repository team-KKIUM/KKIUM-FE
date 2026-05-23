'use client';

import { useState } from 'react';

import { ApplyAnalysis } from './_components/ApplyAnalysis';
import { ApplyJobHeader, type ApplyJobTab } from './_components/ApplyJobHeader';
import { ApplyMyExperience } from './_components/ApplyMyExperience';
import { ApplyResizableSplit } from './_components/ApplyResizableSplit';
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
          <ApplyResizableSplit left={<ApplyAnalysis />} right={<ApplyMyExperience />} />
        ) : (
          <div className="max-w-[1028px]">
            <p className="text-base font-bold leading-6 text-tertiary">자기소개서 작성 콘텐츠가 여기에 표시됩니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}
