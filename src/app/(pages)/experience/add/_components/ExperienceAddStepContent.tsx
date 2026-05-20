import { ExperienceAddBasicInfoStep } from '@/app/(pages)/experience/add/_components/ExperienceAddBasicInfoStep';
import { ExperienceAddCompleteStep } from '@/app/(pages)/experience/add/_components/ExperienceAddCompleteStep';
import { ExperienceAddCoreStep } from '@/app/(pages)/experience/add/_components/ExperienceAddCoreStep';
import { ExperienceAddResultStep } from '@/app/(pages)/experience/add/_components/ExperienceAddResultStep';
import { ExperienceAddUploadStep } from '@/app/(pages)/experience/add/_components/ExperienceAddUploadStep';
import { EXPERIENCE_ADD_STEPS } from '@/app/(pages)/experience/add/_constants/experienceAddSteps';

interface ExperienceAddStepContentProps {
  currentStepIndex: number;
}

export function ExperienceAddStepContent({ currentStepIndex }: ExperienceAddStepContentProps) {
  const currentStep = EXPERIENCE_ADD_STEPS[currentStepIndex] ?? EXPERIENCE_ADD_STEPS[0];

  if (currentStepIndex === 0) {
    return <ExperienceAddUploadStep />;
  }

  if (currentStepIndex === 1) {
    return <ExperienceAddBasicInfoStep />;
  }

  if (currentStepIndex === 2) {
    return <ExperienceAddCoreStep />;
  }

  if (currentStepIndex === 3) {
    return <ExperienceAddResultStep />;
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
