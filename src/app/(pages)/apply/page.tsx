'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorDialog } from '@/components/common/ErrorDialog';

import {
  APPLY_PAGE_HORIZONTAL_PADDING,
  APPLY_TAB_STROKE,
} from './_constants/applyConstants';
import { ApplyJobHeader, type ApplyJobTab } from './_components/(analysis)/ApplyJobHeader';

const ApplyAnalysis = dynamic(
  () =>
    import('./_components/(analysis)/ApplyAnalysis').then((mod) => ({
      default: mod.ApplyAnalysis,
    })),
  { loading: () => <div className="min-h-[320px] flex-1 animate-pulse rounded-lg bg-gray-100" /> },
);

const ApplyMyExperience = dynamic(
  () =>
    import('./_components/(analysis)/ApplyMyExperience').then((mod) => ({
      default: mod.ApplyMyExperience,
    })),
  { loading: () => <div className="min-h-[320px] flex-1 animate-pulse rounded-lg bg-gray-100" /> },
);

const ApplyCoverLetterSection = dynamic(
  () =>
    import('./_components/(cover-letter)/ApplyCoverLetterSection').then((mod) => ({
      default: mod.ApplyCoverLetterSection,
    })),
  { loading: () => <div className="min-h-[400px] w-full animate-pulse bg-gray-50" /> },
);
import { useApplyCoverLetterStore } from './_stores/useApplyCoverLetterStore';
import { ResizableSplit } from './_components/ResizableSplit';
import { ToastMessage } from '@/components/ui/ToastMessage';
import { isJdAnalysisInProgress } from '@/app/api/apply/jdAnalysisStatus';
import { useApplyJobAnalysis } from '@/hooks/apply/useApplyJobAnalysis';
import { useApplyJobPostingSnapshot } from '@/hooks/apply/useApplyJobPostingSnapshot';
import { useSaveApplyCoverLetter } from '@/hooks/apply/useApplyJobPostings';
import { cn } from '@/lib/utils';

export default function ApplyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jdId = searchParams.get('jdid') ?? searchParams.get('jdId');
  const { analysisStatus, isAnalysisLoading } = useApplyJobAnalysis(jdId);
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
  const pendingAnalysisTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAnalysisTimeoutFiredRef = useRef(false);
  const [pendingAnalysisDialogOpen, setPendingAnalysisDialogOpen] = useState(false);

  const clearPendingAnalysisTimer = () => {
    if (!pendingAnalysisTimerRef.current) {
      return;
    }

    clearTimeout(pendingAnalysisTimerRef.current);
    pendingAnalysisTimerRef.current = null;
  };

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

  const handlePendingAnalysisDialogOpenChange = (open: boolean) => {
    setPendingAnalysisDialogOpen(open);
    if (!open) {
      router.push('/apply/list');
    }
  };

  useEffect(() => {
    return () => {
      clearPendingAnalysisTimer();
    };
  }, []);

  useEffect(() => {
    pendingAnalysisTimeoutFiredRef.current = false;
    clearPendingAnalysisTimer();
  }, [jdId]);

  useEffect(() => {
    const shouldWatchPending =
      jdId != null &&
      activeTab === 'analysis' &&
      isAnalysisLoading &&
      isJdAnalysisInProgress(analysisStatus) &&
      !pendingAnalysisTimeoutFiredRef.current;

    if (!shouldWatchPending) {
      clearPendingAnalysisTimer();
      return;
    }

    if (pendingAnalysisTimerRef.current) {
      return;
    }

    pendingAnalysisTimerRef.current = setTimeout(() => {
      pendingAnalysisTimeoutFiredRef.current = true;
      pendingAnalysisTimerRef.current = null;
      setPendingAnalysisDialogOpen(true);
    }, 30_000);
  }, [activeTab, analysisStatus, isAnalysisLoading, jdId]);

  return (
    <section
      className={cn('flex w-full min-h-[calc(100dvh-30px)] flex-col [scrollbar-gutter:stable]')}
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
          className={cn('shrink-0 border-b border-border-bold', APPLY_TAB_STROKE)}
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
      <ErrorDialog
        open={pendingAnalysisDialogOpen}
        title="분석 지연"
        message={
          <>
            <span className="whitespace-nowrap">공고 분석 중 문제가 발생했어요.</span>
            <br />
            <span className="whitespace-nowrap">잠시 후 다시 시도해주세요.</span>
          </>
        }
        confirmLabel="확인"
        onOpenChange={handlePendingAnalysisDialogOpenChange}
      />
    </section>
  );
}
