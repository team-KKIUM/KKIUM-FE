'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

import type {
  ExperienceAddBasicInfoForm,
  ExperienceAddCoreInfoForm,
  ExperienceAddResultInfoForm,
} from '@/app/(pages)/experience/add/_types/experienceAddForm';
import { EditableTagGroup } from '@/app/(pages)/experience/_components/EditableTagGroup';
import {
  getExperienceFieldMaxLength,
  limitExperienceFieldText,
} from '@/app/(pages)/experience/_utils/experienceFieldLimits';
import { TextField } from '@/components/common/TextField';
import { cn } from '@/lib/utils';

type EditableTagGroupKey = 'skill' | 'competency';

export interface ExperienceAddResultStepProps {
  basicInfo: ExperienceAddBasicInfoForm;
  coreInfo: ExperienceAddCoreInfoForm;
  resultInfo: ExperienceAddResultInfoForm;
  onBasicInfoChange: (value: ExperienceAddBasicInfoForm) => void;
  onCoreInfoChange: (value: ExperienceAddCoreInfoForm) => void;
  onResultInfoChange: (value: ExperienceAddResultInfoForm) => void;
}

const BASIC_RESULT_FIELDS = [
  { name: 'title', label: '제목' },
  { name: 'oneLineIntro', label: '한 줄 설명' },
] as const;

const CORE_RESULT_FIELDS = [
  { name: 'situation', label: 'Situation (상황 및 목표)' },
  { name: 'task', label: 'Task (해결 과제)' },
  { name: 'act', label: 'Act (실제 행동)' },
  { name: 'result', label: 'Result (결과 및 성과)' },
  { name: 'taken', label: 'Taken (배운 점)' },
] as const;
const CORE_RESULT_FIELD_MAX_LENGTH = 1000;

export function ExperienceAddResultStep({
  basicInfo,
  coreInfo,
  resultInfo,
  onBasicInfoChange,
  onCoreInfoChange,
  onResultInfoChange,
}: ExperienceAddResultStepProps) {
  const [editingTagGroup, setEditingTagGroup] = useState<EditableTagGroupKey | null>(null);

  return (
    <section
      aria-labelledby="experience-add-result-title"
      className="flex w-full flex-col gap-6 rounded-xl border border-border-default bg-background-w px-[30px] py-5"
    >
      <div className="flex flex-col gap-1">
        <p className="title-2-bold text-mint-300">Step 4</p>
        <div className="flex flex-col gap-0.5">
          <h2 id="experience-add-result-title" className="heading-3-bold text-[#050505]">
            결과 확인
          </h2>
          <p className="body-2-regular text-gray-700">
            입력해주신 내용을 바탕으로 자동으로 정리된 결과입니다. 내용을 자유롭게 수정하신 후
            저장해주세요.
          </p>
        </div>
      </div>

      <ResultSection number="01." title="기본 정보">
        {BASIC_RESULT_FIELDS.map((field) => (
          <ResultField
            key={field.name}
            fieldName={field.name}
            label={field.label}
            value={basicInfo[field.name]}
            onChange={(fieldValue) =>
              onBasicInfoChange({
                ...basicInfo,
                [field.name]: limitExperienceFieldText(field.name, fieldValue),
              })
            }
          />
        ))}
      </ResultSection>

      <ResultSection number="02." title="태그">
        <EditableTagGroup
          label="기술"
          tags={resultInfo.skillTags}
          tone="skill"
          editing={editingTagGroup === 'skill'}
          variant='bordered-row'
          onChange={(tags) =>
            onResultInfoChange({
              ...resultInfo,
              skillTags: tags,
            })
          }
          onEdit={() => setEditingTagGroup('skill')}
          onRequestClose={() => setEditingTagGroup(null)}
        />
        <EditableTagGroup
          label="역량"
          tags={resultInfo.competencyTags}
          tone="competency"
          editing={editingTagGroup === 'competency'}
          variant='bordered-row'
          borderBottom
          onChange={(tags) =>
            onResultInfoChange({
              ...resultInfo,
              competencyTags: tags,
            })
          }
          onEdit={() => setEditingTagGroup('competency')}
          onRequestClose={() => setEditingTagGroup(null)}
        />
      </ResultSection>

      <ResultSection number="03." title="핵심 경험" contentClassName="gap-7">
        {CORE_RESULT_FIELDS.map((field) => (
          <ResultTextareaField
            key={field.name}
            label={field.label}
            value={coreInfo[field.name]}
            onChange={(fieldValue) =>
              onCoreInfoChange({
                ...coreInfo,
                [field.name]: fieldValue,
              })
            }
          />
        ))}
      </ResultSection>
    </section>
  );
}

function ResultSection({
  number,
  title,
  children,
  contentClassName,
}: {
  number: string;
  title: string;
  children: ReactNode;
  contentClassName?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-3.5">
      <div className="flex items-start gap-0.5 title-2-bold">
        <span className="text-mint-300">{number}</span>
        <span className="text-strong">{title}</span>
      </div>
      <div className={`flex w-full flex-col px-[30px] ${contentClassName ?? 'gap-2.5'}`}>
        {children}
      </div>
    </div>
  );
}

function ResultField({
  fieldName,
  label,
  value,
  onChange,
}: {
  fieldName: (typeof BASIC_RESULT_FIELDS)[number]['name'];
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="body-2-regular text-strong">{label}</span>
      <TextField
        value={value}
        maxLength={getExperienceFieldMaxLength(fieldName)}
        description={false}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </label>
  );
}

function ResultTextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
}) {
  const fieldValue = value ?? '';
  const characterCount = fieldValue.length;
  const isMaxLength = characterCount >= CORE_RESULT_FIELD_MAX_LENGTH;

  return (
    <label className="flex w-full flex-col gap-4">
      <span className="flex items-end gap-3">
        <span className="title-2-bold text-strong">{label}</span>
        <span className={cn('caption-bold', isMaxLength ? 'text-danger' : 'text-quaternary')}>
          {characterCount}자 / {CORE_RESULT_FIELD_MAX_LENGTH}자
        </span>
      </span>
      <TextField
        variant="textarea"
        value={fieldValue}
        maxLength={CORE_RESULT_FIELD_MAX_LENGTH}
        description={false}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </label>
  );
}
