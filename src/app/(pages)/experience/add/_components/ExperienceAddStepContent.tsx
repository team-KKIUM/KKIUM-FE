'use client';

import dynamic from 'next/dynamic';

import type { ExperienceAddBasicInfoStepProps } from '@/app/(pages)/experience/add/_components/ExperienceAddBasicInfoStep';
import type { ExperienceAddCoreStepProps } from '@/app/(pages)/experience/add/_components/ExperienceAddCoreStep';
import type {
  ExperienceAddMaterialModalView,
  ExperienceMaterial,
} from '@/app/(pages)/experience/add/_components/ExperienceAddMaterialModal';
import type { ExperienceAddResultStepProps } from '@/app/(pages)/experience/add/_components/ExperienceAddResultStep';
import { ExperienceAddUploadStep } from '@/app/(pages)/experience/add/_components/ExperienceAddUploadStep';
import { EXPERIENCE_ADD_STEPS } from '@/app/(pages)/experience/add/_constants/experienceAddSteps';
import type {
  ExperienceAddBasicInfoForm,
  ExperienceAddCoreInfoForm,
  ExperienceAddResultInfoForm,
} from '@/app/(pages)/experience/add/_types/experienceAddForm';

const ExperienceAddAnalyzingStep = dynamic(
  () =>
    import('@/app/(pages)/experience/add/_components/ExperienceAddAnalyzingStep').then(
      (mod) => mod.ExperienceAddAnalyzingStep,
    ),
  {
    ssr: false,
  },
);

const ExperienceAddBasicInfoStep = dynamic<ExperienceAddBasicInfoStepProps>(
  () =>
    import('@/app/(pages)/experience/add/_components/ExperienceAddBasicInfoStep').then(
      (mod) => mod.ExperienceAddBasicInfoStep,
    ),
  {
    ssr: false,
    loading: ExperienceAddStepLoading,
  },
);

const ExperienceAddCoreStep = dynamic<ExperienceAddCoreStepProps>(
  () =>
    import('@/app/(pages)/experience/add/_components/ExperienceAddCoreStep').then(
      (mod) => mod.ExperienceAddCoreStep,
    ),
  {
    ssr: false,
    loading: ExperienceAddStepLoading,
  },
);

const ExperienceAddResultStep = dynamic<ExperienceAddResultStepProps>(
  () =>
    import('@/app/(pages)/experience/add/_components/ExperienceAddResultStep').then(
      (mod) => mod.ExperienceAddResultStep,
    ),
  {
    ssr: false,
    loading: ExperienceAddStepLoading,
  },
);

const ExperienceAddCompleteStep = dynamic(
  () =>
    import('@/app/(pages)/experience/add/_components/ExperienceAddCompleteStep').then(
      (mod) => mod.ExperienceAddCompleteStep,
    ),
  {
    ssr: false,
  },
);

interface ExperienceAddStepContentProps {
  currentStepIndex: number;
  isAnalyzing?: boolean;
  materials: ExperienceMaterial[];
  isMaterialModalOpen: boolean;
  materialModalInitialView: ExperienceAddMaterialModalView;
  onMaterialModalOpenChange: (isOpen: boolean) => void;
  onMaterialModalInitialViewChange: (view: ExperienceAddMaterialModalView) => void;
  onMaterialsChange: (materials: ExperienceMaterial[]) => void;
  basicInfo: ExperienceAddBasicInfoForm;
  onBasicInfoChange: (basicInfo: ExperienceAddBasicInfoForm) => void;
  coreInfo: ExperienceAddCoreInfoForm;
  onCoreInfoChange: (coreInfo: ExperienceAddCoreInfoForm) => void;
  resultInfo: ExperienceAddResultInfoForm;
  onResultInfoChange: (resultInfo: ExperienceAddResultInfoForm) => void;
}

export function ExperienceAddStepContent({
  currentStepIndex,
  isAnalyzing = false,
  materials,
  isMaterialModalOpen,
  materialModalInitialView,
  onMaterialModalOpenChange,
  onMaterialModalInitialViewChange,
  onMaterialsChange,
  basicInfo,
  onBasicInfoChange,
  coreInfo,
  onCoreInfoChange,
  resultInfo,
  onResultInfoChange,
}: ExperienceAddStepContentProps) {
  const currentStep = EXPERIENCE_ADD_STEPS[currentStepIndex] ?? EXPERIENCE_ADD_STEPS[0];

  if (isAnalyzing) {
    return <ExperienceAddAnalyzingStep />;
  }

  if (currentStepIndex === 0) {
    return (
      <ExperienceAddUploadStep
        materials={materials}
        isMaterialModalOpen={isMaterialModalOpen}
        materialModalInitialView={materialModalInitialView}
        onMaterialModalOpenChange={onMaterialModalOpenChange}
        onMaterialModalInitialViewChange={onMaterialModalInitialViewChange}
        onMaterialsChange={onMaterialsChange}
      />
    );
  }

  if (currentStepIndex === 1) {
    return <ExperienceAddBasicInfoStep value={basicInfo} onChange={onBasicInfoChange} />;
  }

  if (currentStepIndex === 2) {
    return <ExperienceAddCoreStep value={coreInfo} onChange={onCoreInfoChange} />;
  }

  if (currentStepIndex === 3) {
    return (
      <ExperienceAddResultStep
        basicInfo={basicInfo}
        coreInfo={coreInfo}
        resultInfo={resultInfo}
        onBasicInfoChange={onBasicInfoChange}
        onCoreInfoChange={onCoreInfoChange}
        onResultInfoChange={onResultInfoChange}
      />
    );
  }

  if (currentStepIndex === EXPERIENCE_ADD_STEPS.length) {
    return <ExperienceAddCompleteStep />;
  }

  return (
    <section
      aria-label={currentStep}
      className="rounded-xl border border-border-default bg-background-w px-[30px] py-5"
    >
      <p className="body-1-bold text-strong">{currentStep}</p>
    </section>
  );
}

function ExperienceAddStepLoading() {
  return (
    <section className="flex w-full flex-col gap-6 rounded-xl border border-border-default bg-background-w px-[30px] py-5">
      <div className="flex animate-pulse flex-col gap-1">
        <div className="h-6 w-16 rounded bg-mint-100" />
        <div className="h-7 w-40 rounded bg-gray-200" />
        <div className="h-5 w-80 max-w-full rounded bg-gray-100" />
      </div>
      <div className="grid animate-pulse grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-14 rounded-lg bg-gray-100" />
        ))}
      </div>
      <div className="flex animate-pulse flex-col gap-4">
        <div className="h-6 w-28 rounded bg-gray-200" />
        <div className="h-24 rounded-lg bg-gray-100" />
        <div className="h-24 rounded-lg bg-gray-100" />
      </div>
    </section>
  );
}
