'use client';

import { useCallback, useRef, useState } from 'react';

import type { ExperienceAnalyzeResponse } from '@/app/api/experience/add/types';
import type {
  ExperienceMaterial,
  NotionMaterial,
  PdfMaterial,
} from '@/app/(pages)/experience/add/_components/ExperienceAddMaterialModal';
import type {
  ExperienceAddBasicInfoForm,
  ExperienceAddCoreInfoForm,
  ExperienceAddResultInfoForm,
} from '@/app/(pages)/experience/add/_types/experienceAddForm';
import { clearExperienceAddPdfDraft } from '@/app/(pages)/experience/add/_utils/experienceAddPdfDraftStorage';
import { mapExperienceAddFormToCreateRequest } from '@/app/(pages)/experience/add/_utils/mapExperienceAddFormToCreateRequest';
import {
  useAnalyzeExperienceMaterials,
  useAnalyzeExperienceNotion,
  useAnalyzeExperiencePdf,
  useCreateExperience,
} from '@/hooks/experience/useExperienceAdd';
import { trackEvent } from '@/lib/analytics';

interface UseExperienceAddActionsParams {
  currentStepIndex: number;
  isResultStep: boolean;
  materials: ExperienceMaterial[];
  basicInfo: ExperienceAddBasicInfoForm;
  coreInfo: ExperienceAddCoreInfoForm;
  resultInfo: ExperienceAddResultInfoForm;
  applyAnalyzeResponse: (analyzeResponse: ExperienceAnalyzeResponse) => void;
  resetForm: () => void;
  goToNextStep: () => void;
}

export function useExperienceAddActions({
  currentStepIndex,
  isResultStep,
  materials,
  basicInfo,
  coreInfo,
  resultInfo,
  applyAnalyzeResponse,
  resetForm,
  goToNextStep,
}: UseExperienceAddActionsParams) {
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

  const handleNextStep = useCallback(async () => {
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;

    try {
      if (currentStepIndex === 0) {
        const pdfMaterial = materials.find(
          (material): material is PdfMaterial => material.type === 'pdf',
        );
        const notionMaterial = materials.find(
          (material): material is NotionMaterial => material.type === 'notion',
        );

        try {
          if (pdfMaterial && notionMaterial) {
            const analyzeResponse = await analyzeMaterialsMutation.mutateAsync({
              file: pdfMaterial.file,
              pageId: notionMaterial.pageId,
            });

            applyAnalyzeResponse(analyzeResponse);
            clearPdfDraft();
          } else if (pdfMaterial) {
            const analyzeResponse = await analyzePdfMutation.mutateAsync(pdfMaterial.file);
            applyAnalyzeResponse(analyzeResponse);
            clearPdfDraft();
          } else if (notionMaterial) {
            const analyzeResponse = await analyzeNotionMutation.mutateAsync(notionMaterial.pageId);
            applyAnalyzeResponse(analyzeResponse);
          } else {
            resetForm();
          }
        } catch (error) {
          setErrorMessage(
            error instanceof Error ? error.message : '자료 분석 중 오류가 발생했습니다.',
          );
          return;
        }
      }

      if (isResultStep) {
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

      goToNextStep();
    } finally {
      isProcessingRef.current = false;
    }
  }, [
    analyzeMaterialsMutation,
    analyzeNotionMutation,
    analyzePdfMutation,
    applyAnalyzeResponse,
    basicInfo,
    coreInfo,
    createExperienceMutation,
    currentStepIndex,
    goToNextStep,
    isResultStep,
    materials,
    resetForm,
    resultInfo,
  ]);

  return {
    isAnalyzing,
    isSaving,
    errorMessage,
    setErrorMessage,
    handleNextStep,
  };
}

function clearPdfDraft() {
  void clearExperienceAddPdfDraft().catch((error: unknown) => {
    console.warn('PDF 임시 저장 데이터를 삭제하지 못했습니다.', error);
  });
}
