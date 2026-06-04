'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { ExperienceAddMaterialModalView } from '@/app/(pages)/experience/add/_components/ExperienceAddMaterialModal';
import { ExperienceAddProgress } from '@/app/(pages)/experience/add/_components/ExperienceAddProgress';
import { ExperienceAddStepContent } from '@/app/(pages)/experience/add/_components/ExperienceAddStepContent';
import { useExperienceAddActions } from '@/app/(pages)/experience/add/_hooks/useExperienceAddActions';
import { useExperienceAddForm } from '@/app/(pages)/experience/add/_hooks/useExperienceAddForm';
import { useExperienceAddMaterials } from '@/app/(pages)/experience/add/_hooks/useExperienceAddMaterials';
import { useExperienceAddStep } from '@/app/(pages)/experience/add/_hooks/useExperienceAddStep';
import { getExperienceAddNextStepDisabled } from '@/app/(pages)/experience/add/_utils/experienceAddValidation';
import { ErrorDialog } from '@/components/common/ErrorDialog';
import { ChevronLeftIcon } from '@/components/common/icons/ChevronLeftIcon';
import { Button } from '@/components/ui/button';

export function ExperienceAddPageContent() {
  const router = useRouter();
  const {
    currentStepIndex,
    isFirstStep,
    isCompleteStep,
    isBasicInfoStep,
    isCoreInfoStep,
    isResultStep,
    goPreviousStep,
    goNextStep: goToNextStep,
  } = useExperienceAddStep();
  const { materials, setMaterials } = useExperienceAddMaterials();
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialModalInitialView, setMaterialModalInitialView] =
    useState<ExperienceAddMaterialModalView>('material');
  const {
    basicInfo,
    coreInfo,
    resultInfo,
    setBasicInfo,
    setCoreInfo,
    setResultInfo,
    applyAnalyzeResponse,
    resetForm,
  } = useExperienceAddForm();
  const { isAnalyzing, isSaving, errorMessage, setErrorMessage, handleNextStep } =
    useExperienceAddActions({
      currentStepIndex,
      isResultStep,
      materials,
      basicInfo,
      coreInfo,
      resultInfo,
      applyAnalyzeResponse,
      resetForm,
      goToNextStep,
    });
  const isNextStepDisabled = getExperienceAddNextStepDisabled({
    isAnalyzing,
    isSaving,
    isBasicInfoStep,
    isCoreInfoStep,
    isResultStep,
    basicInfo,
    coreInfo,
    resultInfo,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isNotionConnected =
      searchParams.get('notion') === 'connected' || searchParams.get('success') === 'true';

    if (!isNotionConnected) return;

    const frameId = window.requestAnimationFrame(() => {
      setMaterialModalInitialView('notion-pages');
      setIsMaterialModalOpen(true);
    });

    router.replace('/experience/add', { scroll: false });

    return () => window.cancelAnimationFrame(frameId);
  }, [router]);

  return (
    <div className="flex min-h-dvh flex-col py-5">
      <header className="flex items-center gap-2">
        <button
          type="button"
          aria-label="이전 페이지로 이동"
          className="flex size-8 cursor-pointer items-center justify-center"
          onClick={() => router.back()}
        >
          <ChevronLeftIcon className="size-6 text-strong" />
        </button>
        <h1 className="title-1-bold text-strong">경험 추가하기</h1>
      </header>

      <main className="mt-[50px] flex flex-1 flex-col gap-10">
        <ExperienceAddProgress currentStepIndex={currentStepIndex} />
        <ExperienceAddStepContent
          currentStepIndex={currentStepIndex}
          isAnalyzing={isAnalyzing}
          materials={materials}
          isMaterialModalOpen={isMaterialModalOpen}
          materialModalInitialView={materialModalInitialView}
          onMaterialModalOpenChange={setIsMaterialModalOpen}
          onMaterialModalInitialViewChange={setMaterialModalInitialView}
          onMaterialsChange={setMaterials}
          basicInfo={basicInfo}
          onBasicInfoChange={setBasicInfo}
          coreInfo={coreInfo}
          onCoreInfoChange={setCoreInfo}
          resultInfo={resultInfo}
          onResultInfoChange={setResultInfo}
        />
      </main>

      {!isCompleteStep && (
        <footer className="mt-10 flex justify-end gap-4">
          {!isAnalyzing && (
            <Button
              type="button"
              variant="secondary"
              className="w-40"
              disabled={isFirstStep}
              onClick={goPreviousStep}
            >
              이전
            </Button>
          )}
          <Button
            type="button"
            className="w-40"
            disabled={isNextStepDisabled}
            onClick={handleNextStep}
          >
            {isResultStep ? '저장하기' : '다음'}
          </Button>
        </footer>
      )}
      <ErrorDialog
        open={errorMessage.length > 0}
        message={errorMessage}
        onOpenChange={(open) => {
          if (!open) {
            setErrorMessage('');
          }
        }}
      />
    </div>
  );
}
