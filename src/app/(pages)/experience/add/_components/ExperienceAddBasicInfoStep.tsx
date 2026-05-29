'use client';

import {
  type ChangeEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ExperienceTypeOptionCard } from '@/app/(pages)/experience/add/_components/ExperienceTypeOptionCard';
import {
  EXPERIENCE_TYPE_FIELD_GROUPS,
  EXPERIENCE_TYPE_OPTIONS,
} from '@/app/(pages)/experience/add/_constants/experienceTypeOptions';
import type { ExperienceAddBasicInfoForm } from '@/app/(pages)/experience/add/_types/experienceAddForm';
import {
  getExperienceFieldMaxLength,
  limitExperienceFieldText,
} from '@/app/(pages)/experience/_utils/experienceFieldLimits';
import { sanitizeNumberText } from '@/app/(pages)/experience/_utils/sanitizeNumberText';
import { type CalendarDateRange, RangeCalendar } from '@/components/common/RangeCalendar';
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
    const nextValue = getSanitizedBasicInfoValue(fieldName, fieldValue);

    onChange({
      ...value,
      [fieldName]: nextValue,
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
      className="flex w-full flex-col gap-6 overflow-visible rounded-xl border border-border-default bg-background-w px-[30px] py-5"
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
                  <ExperienceDateRangeField
                    startDate={value.startDate}
                    endDate={value.endDate}
                    onChange={(nextStartDate, nextEndDate) => {
                      onChange({
                        ...value,
                        startDate: nextStartDate,
                        endDate: nextEndDate,
                      });
                    }}
                  />
                ) : fieldGroup.fields.length > 1 ? (
                  <div className="grid w-full grid-cols-2 gap-2.5">
                    {fieldGroup.fields.map((field, index) => (
                      <div key={`${fieldGroup.number}-${index}`}>
                        <TextField
                          variant="input"
                          placeholder={field.placeholder}
                          value={value[field.name]}
                          maxLength={getExperienceFieldMaxLength(field.name)}
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
                      maxLength={getExperienceFieldMaxLength(fieldGroup.fields[0].name)}
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

function getSanitizedBasicInfoValue(
  fieldName: keyof Omit<ExperienceAddBasicInfoForm, 'type'>,
  value: string,
) {
  if (fieldName === 'teamNum' || fieldName === 'contributionRate') {
    return sanitizeNumberText(value, 100);
  }

  return limitExperienceFieldText(fieldName, value);
}

const DATE_RANGE_PLACEHOLDER = '0000년 00월 00일 ~ 0000년 00월 00일';

function formatDateRangeValue(startDate: string, endDate: string) {
  const formattedStartDate = formatKoreanDateValue(startDate);
  const formattedEndDate = formatKoreanDateValue(endDate);

  if (!formattedStartDate || !formattedEndDate) return '';

  return `${formattedStartDate} ~ ${formattedEndDate}`;
}

function parseDateValue(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }

  return date;
}

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
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

function ExperienceDateRangeField({
  startDate,
  endDate,
  onChange,
}: {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogId = useId();
  const parsedStartDate = useMemo(() => parseDateValue(startDate), [startDate]);
  const parsedEndDate = useMemo(() => parseDateValue(endDate), [endDate]);
  const selectedRange = useMemo<CalendarDateRange | null>(() => {
    if (!parsedStartDate || !parsedEndDate) return null;

    return {
      start: parsedStartDate,
      end: parsedEndDate,
    };
  }, [parsedStartDate, parsedEndDate]);
  const displayValue = formatDateRangeValue(startDate, endDate);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative w-full">
      <TextField
        variant="date"
        placeholder={DATE_RANGE_PLACEHOLDER}
        value={displayValue}
        className={cn('border-gray-300', displayValue && 'text-strong')}
        description={false}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => setOpen((prevOpen) => !prevOpen)}
      />

      {open && (
        <div
          id={dialogId}
          role="dialog"
          aria-label="날짜 선택"
          className="absolute bottom-full left-0 z-60 mb-2 max-w-[calc(100vw-2rem)]"
        >
          <RangeCalendar
            value={selectedRange}
            defaultVisibleMonth={selectedRange?.start ?? parsedStartDate ?? new Date()}
            onChange={(nextRange) => {
              if (!nextRange) return;

              onChange(formatDateValue(nextRange.start), formatDateValue(nextRange.end));
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
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
