'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ExperienceAddProgress } from '@/app/experience/add/_components/ExperienceAddProgress';
import { ExperienceAddStepContent } from '@/app/experience/add/_components/ExperienceAddStepContent';
import { EXPERIENCE_ADD_STEPS } from '@/app/experience/add/_constants/experienceAddSteps';
import { ChevronLeftIcon } from '@/components/common/icons/ChevronLeftIcon';
import { Button } from '@/components/ui/button';

export function ExperienceAddPageContent() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const isFirstStep = currentStepIndex === 0;
  const isCompleteStep = currentStepIndex === EXPERIENCE_ADD_STEPS.length;

  const goPreviousStep = () => {
    setCurrentStepIndex((stepIndex) => Math.max(stepIndex - 1, 0));
  };

  const goNextStep = () => {
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
        <ExperienceAddStepContent currentStepIndex={currentStepIndex} />
      </main>

      {!isCompleteStep && (
        <footer className="mt-10 flex justify-end gap-4">
          <Button type="button" className="w-40" disabled={isFirstStep} onClick={goPreviousStep}>
            이전
          </Button>
          <Button type="button" className="w-40" onClick={goNextStep}>
            다음
          </Button>
        </footer>
      )}
    </div>
  );
}
