'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import type { ExperienceAnalyzeResponse } from '@/app/api/experience/add/types';
import type {
  ExperienceAddMaterialModalView,
  ExperienceMaterial,
} from '@/app/(pages)/experience/add/_components/ExperienceAddMaterialModal';
import { ExperienceAddProgress } from '@/app/(pages)/experience/add/_components/ExperienceAddProgress';
import { ExperienceAddStepContent } from '@/app/(pages)/experience/add/_components/ExperienceAddStepContent';
import { EXPERIENCE_ADD_STEPS } from '@/app/(pages)/experience/add/_constants/experienceAddSteps';
import { CORE_EXPERIENCE_FIELDS } from '@/app/(pages)/experience/add/_constants/experienceCoreQuestions';
import { EXPERIENCE_TYPE_FIELD_GROUPS } from '@/app/(pages)/experience/add/_constants/experienceTypeOptions';
import {
  createEmptyBasicInfoForm,
  createEmptyCoreInfoForm,
  createEmptyResultInfoForm,
  type ExperienceAddBasicInfoForm,
  type ExperienceAddCoreInfoForm,
  type ExperienceAddResultInfoForm,
} from '@/app/(pages)/experience/add/_types/experienceAddForm';
import {
  mapAnalyzeResponseToBasicInfoForm,
  mapAnalyzeResponseToCoreInfoForm,
  mapAnalyzeResponseToResultInfoForm,
} from '@/app/(pages)/experience/add/_utils/mapAnalyzeResponseToBasicInfoForm';
import { mapExperienceAddFormToCreateRequest } from '@/app/(pages)/experience/add/_utils/mapExperienceAddFormToCreateRequest';
import {
  clearExperienceAddPdfDraft,
  getExperienceAddPdfDraft,
} from '@/app/(pages)/experience/add/_utils/experienceAddPdfDraftStorage';
import { ErrorDialog } from '@/components/common/ErrorDialog';
import { ChevronLeftIcon } from '@/components/common/icons/ChevronLeftIcon';
import { Button } from '@/components/ui/button';
import {
  useAnalyzeExperienceMaterials,
  useAnalyzeExperienceNotion,
  useAnalyzeExperiencePdf,
  useCreateExperience,
} from '@/hooks/experience/useExperienceAdd';
import { trackEvent } from '@/lib/analytics';

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
  const [errorMessage, setErrorMessage] = useState('');
  const isProcessingRef = useRef(false);
  const analyzePdfMutation = useAnalyzeExperiencePdf();
  const analyzeNotionMutation = useAnalyzeExperienceNotion();
  const analyzeMaterialsMutation = useAnalyzeExperienceMaterials();
  const createExperienceMutation = useCreateExperience();
  const isAnalyzing =
    analyzePdfMutation.isPending ||
    analyzeNotionMutation.isPending ||
    analyzeMaterialsMutation.isPending;
  const isSaving = createExperienceMutation.isPending;
  const isFirstStep = currentStepIndex === 0;
  const isCompleteStep = currentStepIndex === EXPERIENCE_ADD_STEPS.length;
  const isBasicInfoStep = currentStepIndex === 1;
  const isCoreInfoStep = currentStepIndex === 2;
  const isResultStep = currentStepIndex === EXPERIENCE_ADD_STEPS.length - 1;
  const isNextStepDisabled =
    isAnalyzing ||
    isSaving ||
    (isBasicInfoStep && !isBasicInfoComplete(basicInfo)) ||
    (isCoreInfoStep && !isCoreInfoComplete(coreInfo)) ||
    (isResultStep && !isResultStepComplete({ basicInfo, coreInfo, resultInfo }));

  useEffect(() => {
    if (!isNotionConnected) return;

    router.replace('/experience/add', { scroll: false });
  }, [isNotionConnected, router]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentStepIndex]);

  useEffect(() => {
    const restorePdfDraft = async () => {
      try {
        const pdfMaterial = await getExperienceAddPdfDraft();

        if (!pdfMaterial) return;

        setMaterials((currentMaterials) => {
          const hasPdf = currentMaterials.some((material) => material.type === 'pdf');

          if (hasPdf) return currentMaterials;

          return [pdfMaterial, ...currentMaterials];
        });
      } catch (error) {
        console.warn('PDF 임시 저장 데이터를 복구하지 못했습니다.', error);
      }
    };

    void restorePdfDraft();
  }, []);

  const goPreviousStep = () => {
    setCurrentStepIndex((stepIndex) => Math.max(stepIndex - 1, 0));
  };

  const applyAnalyzeResponse = (analyzeResponse: ExperienceAnalyzeResponse) => {
    setBasicInfo(mapAnalyzeResponseToBasicInfoForm(analyzeResponse));
    setCoreInfo(mapAnalyzeResponseToCoreInfoForm(analyzeResponse));
    setResultInfo(mapAnalyzeResponseToResultInfoForm(analyzeResponse));
  };

  const goNextStep = async () => {
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;

    try {
      if (currentStepIndex === 0) {
        const pdfMaterial = materials.find((material) => material.type === 'pdf');
        const notionMaterial = materials.find((material) => material.type === 'notion');

        try {
          if (pdfMaterial && notionMaterial) {
            const analyzeResponse = await analyzeMaterialsMutation.mutateAsync({
              file: pdfMaterial?.file,
              pageId: notionMaterial?.pageId,
            });

            applyAnalyzeResponse(analyzeResponse);
            void clearExperienceAddPdfDraft().catch((error: unknown) => {
              console.warn('PDF 임시 저장 데이터를 삭제하지 못했습니다.', error);
            });
          } else if (pdfMaterial) {
            const analyzeResponse = await analyzePdfMutation.mutateAsync(pdfMaterial.file);
            applyAnalyzeResponse(analyzeResponse);
            void clearExperienceAddPdfDraft().catch((error: unknown) => {
              console.warn('PDF 임시 저장 데이터를 삭제하지 못했습니다.', error);
            });
          } else if (notionMaterial) {
            const analyzeResponse = await analyzeNotionMutation.mutateAsync(notionMaterial.pageId);
            applyAnalyzeResponse(analyzeResponse);
          } else {
            setBasicInfo(createEmptyBasicInfoForm());
            setCoreInfo(createEmptyCoreInfoForm());
            setResultInfo(createEmptyResultInfoForm());
          }
        } catch (error) {
          setErrorMessage(
            error instanceof Error ? error.message : '자료 분석 중 오류가 발생했습니다.',
          );
          return;
        }
      }

      if (currentStepIndex === EXPERIENCE_ADD_STEPS.length - 1) {
        try {
          await createExperienceMutation.mutateAsync(
            mapExperienceAddFormToCreateRequest({
              basicInfo,
              coreInfo,
              resultInfo,
            }),
          );
          trackEvent('experience_create', {
            source: 'experience_add',
          });
        } catch (error) {
          setErrorMessage(
            error instanceof Error ? error.message : '경험 저장 중 오류가 발생했습니다.',
          );
          return;
        }
      }

      setCurrentStepIndex((stepIndex) => Math.min(stepIndex + 1, EXPERIENCE_ADD_STEPS.length));
    } finally {
      isProcessingRef.current = false;
    }
  };

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
            onClick={goNextStep}
          >
            {currentStepIndex === EXPERIENCE_ADD_STEPS.length - 1 ? '저장하기' : '다음'}
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

function isBasicInfoComplete(basicInfo: ExperienceAddBasicInfoForm) {
  if (!basicInfo.type) return false;

  return EXPERIENCE_TYPE_FIELD_GROUPS[basicInfo.type].every((fieldGroup) =>
    fieldGroup.fields.every((field) => hasText(basicInfo[field.name])),
  );
}

function isCoreInfoComplete(coreInfo: ExperienceAddCoreInfoForm) {
  return CORE_EXPERIENCE_FIELDS.every((field) => hasText(coreInfo[field.name]));
}

function isResultStepComplete({
  basicInfo,
  coreInfo,
  resultInfo,
}: {
  basicInfo: ExperienceAddBasicInfoForm;
  coreInfo: ExperienceAddCoreInfoForm;
  resultInfo: ExperienceAddResultInfoForm;
}) {
  return (
    isBasicInfoComplete(basicInfo) &&
    isCoreInfoComplete(coreInfo) &&
    hasTag(resultInfo.skillTags) &&
    hasTag(resultInfo.competencyTags)
  );
}

function hasText(value: string | null | undefined) {
  return (value ?? '').trim().length > 0;
}

function hasTag(tags: string[]) {
  return tags.some(hasText);
}
