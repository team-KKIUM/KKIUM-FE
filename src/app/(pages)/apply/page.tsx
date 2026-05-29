'use client';

import { useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  APPLY_PAGE_HORIZONTAL_PADDING,
  APPLY_TAB_STROKE_ANALYSIS,
  APPLY_TAB_STROKE_COVER_LETTER,
} from './_constants/applyConstants';
import { ApplyAnalysis } from './_components/(analysis)/ApplyAnalysis';
import { ApplyJobHeader, type ApplyJobTab } from './_components/(analysis)/ApplyJobHeader';
import { ApplyMyExperience } from './_components/(analysis)/ApplyMyExperience';
import { ApplyCoverLetterSection } from './_components/(cover-letter)/ApplyCoverLetterSection';
import { useApplyCoverLetterStore } from './_stores/useApplyCoverLetterStore';
import { ResizableSplit } from './_components/ResizableSplit';
import { ToastMessage } from '@/components/ui/ToastMessage';
import { useApplyJobPostingSnapshot } from '@/hooks/apply/useApplyJobPostingSnapshot';
import { useSaveApplyCoverLetter } from '@/hooks/apply/useApplyJobPostings';
import { cn } from '@/lib/utils';

export default function ApplyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jdId = searchParams.get('jdid') ?? searchParams.get('jdId');
  const { jobPosting } = useApplyJobPostingSnapshot(jdId);
  const [activeTab, setActiveTab] = useState<ApplyJobTab>('analysis');
  const questions = useApplyCoverLetterStore((state) => state.questions);
  const setQuestions = useApplyCoverLetterStore((state) => state.setQuestions);
  const selectedExperienceIdsByQuestion = useApplyCoverLetterStore(
    (state) => state.selectedExperienceIdsByQuestion,
  );
  const setSelectedExperienceIdsByQuestion = useApplyCoverLetterStore(
    (state) => state.setSelectedExperienceIdsByQuestion,
  );
  const saveCoverLetterMutation = useSaveApplyCoverLetter();
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

    saveCoverLetterMutation.mutate(
      { jdId, questions, selectedExperienceIdsByQuestion },
      {
        onSuccess: ({ updatedQuestions, updatedExperienceIdsByQuestion, saved }) => {
          setQuestions(updatedQuestions);
          setSelectedExperienceIdsByQuestion(updatedExperienceIdsByQuestion);

          if (!saved) {
            showSaveToast('저장할 문항이 없습니다');
            return;
          }

          showSaveToast('저장되었습니다');
          router.push('/apply/list');
        },
        onError: () => {
          showSaveToast('저장에 실패했습니다');
        },
      },
    );
  };

  return (
    <section
      className={cn('flex w-full flex-col min-h-[calc(100dvh-30px)]')}
    >
      <div
        className={cn(
          'mx-auto flex w-full min-w-0 flex-col overflow-x-visible',
          'min-h-0 flex-1',
        )}
      >
        <div className={cn('shrink-0', APPLY_PAGE_HORIZONTAL_PADDING)}>
          <ApplyJobHeader
            title={jobPosting?.title ?? ''}
            companyName={jobPosting?.companyName ?? ''}
            jobField={jobPosting?.jobField ?? ''}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSave={jdId ? handleSave : undefined}
            isSaving={saveCoverLetterMutation.isPending}
          />
        </div>

        <div
          aria-hidden
          className={cn(
            'shrink-0 border-b border-border-bold',
            activeTab === 'cover-letter' ? APPLY_TAB_STROKE_COVER_LETTER : APPLY_TAB_STROKE_ANALYSIS,
          )}
        />

        {activeTab === 'analysis' ? (
          <div className={cn('flex min-h-0 min-w-0 flex-1 flex-col', APPLY_PAGE_HORIZONTAL_PADDING)}>
            <ResizableSplit
              className="min-h-0 flex-1"
              leftClassName="pt-3"
              rightClassName="pt-3"
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
