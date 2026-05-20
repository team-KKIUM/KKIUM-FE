'use client';

import { type ReactNode, useState } from 'react';

import { ExperienceTypeOptionCard } from '@/app/(pages)/experience/add/_components/ExperienceTypeOptionCard';
import {
  EXPERIENCE_TYPE_FIELD_GROUPS,
  EXPERIENCE_TYPE_OPTIONS,
  type ExperienceType,
} from '@/app/(pages)/experience/add/_constants/experienceTypeOptions';
import { TextField } from '@/components/common/TextField';
import { cn } from '@/lib/utils';

export function ExperienceAddBasicInfoStep() {
  const [selectedType, setSelectedType] = useState<ExperienceType | null>(null);
  const selectedFieldGroups = selectedType ? EXPERIENCE_TYPE_FIELD_GROUPS[selectedType] : [];

  return (
    <section
      aria-labelledby="experience-add-basic-info-title"
      className="flex w-full flex-col gap-6 overflow-hidden rounded-xl border border-border-default bg-background-w px-[30px] py-5"
    >
      <div className="flex flex-col gap-1">
        <p className="title-2-bold text-mint-300">Step 2</p>
        <div className="flex flex-col gap-0.5">
          <h2 id="experience-add-basic-info-title" className="heading-3-bold text-[#050505]">
            기본 정보 입력
          </h2>
          <p className="body-2-regular text-gray-700">경험의 기본 정보를 입력해주세요.</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="flex items-start gap-0.5 title-2-bold">
          <span className="text-mint-300">01.</span>
          <span className="text-strong">경험 유형</span>
          <span className="text-mint-300">*</span>
        </div>

        <div className="grid w-full grid-cols-4 gap-2">
          {EXPERIENCE_TYPE_OPTIONS.map((option) => (
            <ExperienceTypeOptionCard
              key={option.value}
              label={option.label}
              defaultIconSrc={option.defaultIconSrc}
              selectedIconSrc={option.selectedIconSrc}
              selected={selectedType === option.value}
              onClick={() => setSelectedType(option.value)}
            />
          ))}
        </div>
      </div>

      {selectedFieldGroups.length > 0 && (
        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-7">
          {selectedFieldGroups.map((fieldGroup) => (
            <QuestionFieldGroup
              key={fieldGroup.number}
              number={fieldGroup.number}
              label={fieldGroup.label}
              className={['02.', '03.'].includes(fieldGroup.number) ? 'col-span-2' : undefined}
            >
              {fieldGroup.fields.length > 1 ? (
                <div className="grid w-full grid-cols-2 gap-2.5">
                  {fieldGroup.fields.map((field, index) => (
                    <TextField
                      key={`${fieldGroup.number}-${index}`}
                      variant={field.variant}
                      placeholder={field.placeholder}
                      description={false}
                    />
                  ))}
                </div>
              ) : (
                <TextField
                  variant={fieldGroup.fields[0]?.variant}
                  placeholder={fieldGroup.fields[0]?.placeholder}
                  description={false}
                />
              )}
            </QuestionFieldGroup>
          ))}
        </div>
      )}
    </section>
  );
}

function QuestionFieldGroup({
  number,
  label,
  className,
  children,
}: {
  number: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('flex w-full flex-col gap-4', className)}>
      <div className="flex items-start gap-0.5 title-2-bold">
        <span className="text-mint-300">{number}</span>
        <span className="text-strong">{label}</span>
        <span className="text-mint-300">*</span>
      </div>
      {children}
    </div>
  );
}
