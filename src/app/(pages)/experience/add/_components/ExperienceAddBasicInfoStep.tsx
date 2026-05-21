'use client';

import type { ChangeEvent, ReactNode } from 'react';

import { ExperienceTypeOptionCard } from '@/app/(pages)/experience/add/_components/ExperienceTypeOptionCard';
import {
  EXPERIENCE_TYPE_FIELD_GROUPS,
  EXPERIENCE_TYPE_OPTIONS,
} from '@/app/(pages)/experience/add/_constants/experienceTypeOptions';
import type { ExperienceAddBasicInfoForm } from '@/app/(pages)/experience/add/_types/experienceAddForm';
import { TextField } from '@/components/common/TextField';
import { cn } from '@/lib/utils';

interface ExperienceAddBasicInfoStepProps {
  value: ExperienceAddBasicInfoForm;
  onChange: (value: ExperienceAddBasicInfoForm) => void;
}

export function ExperienceAddBasicInfoStep({ value, onChange }: ExperienceAddBasicInfoStepProps) {
  const selectedType = value.type;
  const selectedFieldGroups = selectedType ? EXPERIENCE_TYPE_FIELD_GROUPS[selectedType] : [];

  const updateField = (
    fieldName: keyof Omit<ExperienceAddBasicInfoForm, 'type'>,
    fieldValue: string,
  ) => {
    onChange({
      ...value,
      [fieldName]: fieldValue,
    });
  };
  const handleInputChange =
    (fieldName: keyof Omit<ExperienceAddBasicInfoForm, 'type'>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      updateField(fieldName, event.currentTarget.value);
    };

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
              onClick={() => onChange({ ...value, type: option.value })}
            />
          ))}
        </div>
      </div>

      {selectedFieldGroups.length > 0 && (
        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-7">
          {selectedFieldGroups.map((fieldGroup) => {
            const isDateRangeGroup = fieldGroup.fields.every((field) => field.variant === 'date');

            return (
              <QuestionFieldGroup
                key={fieldGroup.number}
                number={fieldGroup.number}
                label={fieldGroup.label}
                className={
                  ['02.', '03.'].includes(fieldGroup.number) || isDateRangeGroup
                    ? 'col-span-2'
                    : undefined
                }
              >
                {isDateRangeGroup ? (
                  <TextField
                    variant="date"
                    placeholder={DATE_RANGE_PLACEHOLDER}
                    value={formatDateRangeValue(value.startDate, value.endDate)}
                    className="border-gray-300"
                    description={false}
                  />
                ) : fieldGroup.fields.length > 1 ? (
                  <div className="grid w-full grid-cols-2 gap-2.5">
                    {fieldGroup.fields.map((field, index) => (
                      <div key={`${fieldGroup.number}-${index}`}>
                        <TextField
                          variant="input"
                          placeholder={field.placeholder}
                          value={value[field.name]}
                          description={false}
                          onChange={handleInputChange(field.name)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  fieldGroup.fields[0] && (
                    <TextField
                      variant="input"
                      placeholder={fieldGroup.fields[0].placeholder}
                      value={value[fieldGroup.fields[0].name]}
                      description={false}
                      onChange={handleInputChange(fieldGroup.fields[0].name)}
                    />
                  )
                )}
              </QuestionFieldGroup>
            );
          })}
        </div>
      )}
    </section>
  );
}

const DATE_RANGE_PLACEHOLDER = '0000년 00월 00일 ~ 0000년 00월 00일';

function formatDateRangeValue(startDate: string, endDate: string) {
  const formattedStartDate = formatKoreanDateValue(startDate);
  const formattedEndDate = formatKoreanDateValue(endDate);

  if (!formattedStartDate || !formattedEndDate) return '';

  return `${formattedStartDate} ~ ${formattedEndDate}`;
}

function formatKoreanDateValue(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return '';

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return '';
  }

  return `${year}년 ${month}월 ${day}일`;
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
