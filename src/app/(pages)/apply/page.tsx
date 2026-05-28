'use client';

import { useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';

import { ApplyAnalysis } from './_components/(analysis)/ApplyAnalysis';
import { ApplyJobHeader, type ApplyJobTab } from './_components/(analysis)/ApplyJobHeader';
import { ApplyMyExperience } from './_components/(analysis)/ApplyMyExperience';
import { ApplyCoverLetterSection } from './_components/(cover-letter)/ApplyCoverLetterSection';
import { useApplyCoverLetterStore } from './_stores/useApplyCoverLetterStore';
import { buildSaveResumeRequest } from './_utils/buildSaveResumeRequest';
import { ResizableSplit } from './_components/ResizableSplit';
import { ToastMessage } from '@/components/ui/ToastMessage';
import { useApplyJobPostingSnapshot } from '@/hooks/apply/useApplyJobPostingSnapshot';
import { useSaveApplyResume } from '@/hooks/apply/useApplyJobPostings';
import { cn } from '@/lib/utils';

export default function ApplyPage() {
  const searchParams = useSearchParams();
  const jdId = searchParams.get('jdid') ?? searchParams.get('jdId');
  const { jobPosting } = useApplyJobPostingSnapshot(jdId);
  const [activeTab, setActiveTab] = useState<ApplyJobTab>('analysis');
  const isCoverLetterTab = activeTab === 'cover-letter';
  const questions = useApplyCoverLetterStore((state) => state.questions);
  const selectedExperienceIdsByQuestion = useApplyCoverLetterStore(
    (state) => state.selectedExperienceIdsByQuestion,
  );
  const saveResumeMutation = useSaveApplyResume();
  const [saveToastOpen, setSaveToastOpen] = useState(false);
  const [saveToastMessage, setSaveToastMessage] = useState('저장되었습니다');
  const saveToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSaveToast = (message: string) => {
    setSaveToastMessage(message);
    setSaveToastOpen(true);

    if (saveToastTimerRef.current) {
      clearTimeout(saveToastTimerRef.current);
    }

    saveToastTimerRef.current = setTimeout(() => {
      setSaveToastOpen(false);
      saveToastTimerRef.current = null;
    }, 2000);
  };

  const handleSave = () => {
    if (!jdId || activeTab !== 'cover-letter') {
      return;
    }

    const request = buildSaveResumeRequest(questions, selectedExperienceIdsByQuestion);

    if (request.answers.length === 0) {
      showSaveToast('저장할 문항이 없습니다');
      return;
    }

    saveResumeMutation.mutate(
      { jdId, request },
      {
        onSuccess: () => {
          showSaveToast('저장되었습니다');
        },
        onError: () => {
          showSaveToast('저장에 실패했습니다');
        },
      },
    );
  };

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
            onSave={jdId ? handleSave : undefined}
            isSaving={saveResumeMutation.isPending}
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

      <ToastMessage open={saveToastOpen} message={saveToastMessage} />
    </section>
  );
}
