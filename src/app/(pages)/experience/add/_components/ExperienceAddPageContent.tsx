'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { ExperienceAnalyzeResponse } from '@/app/api/experience/add/types';
import type {
  ExperienceAddMaterialModalView,
  ExperienceMaterial,
} from '@/app/(pages)/experience/add/_components/ExperienceAddMaterialModal';
import { ExperienceAddProgress } from '@/app/(pages)/experience/add/_components/ExperienceAddProgress';
import { ExperienceAddStepContent } from '@/app/(pages)/experience/add/_components/ExperienceAddStepContent';
import { EXPERIENCE_ADD_STEPS } from '@/app/(pages)/experience/add/_constants/experienceAddSteps';
import {
  createEmptyBasicInfoForm,
  createEmptyCoreInfoForm,
  createEmptyResultInfoForm,
} from '@/app/(pages)/experience/add/_types/experienceAddForm';
import {
  mapAnalyzeResponseToBasicInfoForm,
  mapAnalyzeResponseToCoreInfoForm,
  mapAnalyzeResponseToResultInfoForm,
} from '@/app/(pages)/experience/add/_utils/mapAnalyzeResponseToBasicInfoForm';
import { ChevronLeftIcon } from '@/components/common/icons/ChevronLeftIcon';
import { Button } from '@/components/ui/button';
import {
  useAnalyzeExperienceNotion,
  useAnalyzeExperiencePdf,
} from '@/hooks/experience/useExperienceAdd';

export function ExperienceAddPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNotionConnected =
    searchParams.get('notion') === 'connected' || searchParams.get('success') === 'true';
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [materials, setMaterials] = useState<ExperienceMaterial[]>([]);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(isNotionConnected);
  const [materialModalInitialView, setMaterialModalInitialView] =
    useState<ExperienceAddMaterialModalView>(isNotionConnected ? 'notion-pages' : 'material');
  const [basicInfo, setBasicInfo] = useState(createEmptyBasicInfoForm);
  const [coreInfo, setCoreInfo] = useState(createEmptyCoreInfoForm);
  const [resultInfo, setResultInfo] = useState(createEmptyResultInfoForm);
  const analyzePdfMutation = useAnalyzeExperiencePdf();
  const analyzeNotionMutation = useAnalyzeExperienceNotion();
  const isAnalyzing = analyzePdfMutation.isPending || analyzeNotionMutation.isPending;
  const isFirstStep = currentStepIndex === 0;
  const isCompleteStep = currentStepIndex === EXPERIENCE_ADD_STEPS.length;

  useEffect(() => {
    if (!isNotionConnected) return;

    router.replace('/experience/add', { scroll: false });
  }, [isNotionConnected, router]);

  const goPreviousStep = () => {
    setCurrentStepIndex((stepIndex) => Math.max(stepIndex - 1, 0));
  };

  const applyAnalyzeResponse = (analyzeResponse: ExperienceAnalyzeResponse) => {
    setBasicInfo(mapAnalyzeResponseToBasicInfoForm(analyzeResponse));
    setCoreInfo(mapAnalyzeResponseToCoreInfoForm(analyzeResponse));
    setResultInfo(mapAnalyzeResponseToResultInfoForm(analyzeResponse));
  };

  const goNextStep = async () => {
    if (currentStepIndex === 0) {
      const selectedMaterial = materials[0];

      try {
        if (selectedMaterial?.type === 'pdf') {
          const analyzeResponse = await analyzePdfMutation.mutateAsync(selectedMaterial.file);
          applyAnalyzeResponse(analyzeResponse);
        } else if (selectedMaterial?.type === 'notion') {
          const analyzeResponse = await analyzeNotionMutation.mutateAsync(selectedMaterial.pageId);
          applyAnalyzeResponse(analyzeResponse);
        } else {
          setBasicInfo(createEmptyBasicInfoForm());
          setCoreInfo(createEmptyCoreInfoForm());
          setResultInfo(createEmptyResultInfoForm());
        }
      } catch (error) {
        window.alert(error instanceof Error ? error.message : '자료 분석 중 오류가 발생했습니다.');
        return;
      }
    }

    setCurrentStepIndex((stepIndex) => Math.min(stepIndex + 1, EXPERIENCE_ADD_STEPS.length));
  };

  return (
    <div className="mx-20 flex min-h-dvh flex-col py-5">
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
        />
      </main>

      {!isCompleteStep && (
        <footer className="mt-10 flex justify-end gap-4">
          {!isAnalyzing && (
            <Button type="button" className="w-40" disabled={isFirstStep} onClick={goPreviousStep}>
              이전
            </Button>
          )}
          <Button type="button" className="w-40" disabled={isAnalyzing} onClick={goNextStep}>
            다음
          </Button>
        </footer>
      )}
    </div>
  );
}
