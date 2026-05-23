import { ExperienceAddBasicInfoStep } from '@/app/(pages)/experience/add/_components/ExperienceAddBasicInfoStep';
import { ExperienceAddAnalyzingStep } from '@/app/(pages)/experience/add/_components/ExperienceAddAnalyzingStep';
import { ExperienceAddCompleteStep } from '@/app/(pages)/experience/add/_components/ExperienceAddCompleteStep';
import { ExperienceAddCoreStep } from '@/app/(pages)/experience/add/_components/ExperienceAddCoreStep';
import type {
  ExperienceAddMaterialModalView,
  ExperienceMaterial,
} from '@/app/(pages)/experience/add/_components/ExperienceAddMaterialModal';
import { ExperienceAddResultStep } from '@/app/(pages)/experience/add/_components/ExperienceAddResultStep';
import { ExperienceAddUploadStep } from '@/app/(pages)/experience/add/_components/ExperienceAddUploadStep';
import { EXPERIENCE_ADD_STEPS } from '@/app/(pages)/experience/add/_constants/experienceAddSteps';
import type {
  ExperienceAddBasicInfoForm,
  ExperienceAddCoreInfoForm,
  ExperienceAddResultInfoForm,
} from '@/app/(pages)/experience/add/_types/experienceAddForm';

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
