'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

import type {
  ExperienceAddBasicInfoForm,
  ExperienceAddCoreInfoForm,
  ExperienceAddResultInfoForm,
} from '@/app/(pages)/experience/add/_types/experienceAddForm';
import { Tag } from '@/components/common/Tag';
import { TextField } from '@/components/common/TextField';
import { EditIcon } from '@/components/common/icons/EditIcon';
import { Input } from '@/components/ui/input';

type EditableTagGroup = 'skill' | 'competency';

interface ExperienceAddResultStepProps {
  basicInfo: ExperienceAddBasicInfoForm;
  coreInfo: ExperienceAddCoreInfoForm;
  resultInfo: ExperienceAddResultInfoForm;
  onBasicInfoChange: (value: ExperienceAddBasicInfoForm) => void;
  onCoreInfoChange: (value: ExperienceAddCoreInfoForm) => void;
}

const BASIC_RESULT_FIELDS = [
  { name: 'title', label: '제목' },
  { name: 'oneLineIntro', label: '한 줄 소개' },
] as const;

const CORE_RESULT_FIELDS = [
  { name: 'situation', label: 'Situation (상황 및 목표)' },
  { name: 'task', label: 'Task (해결 과제)' },
  { name: 'act', label: 'Act (실제 행동)' },
  { name: 'result', label: 'Result (결과 및 성과)' },
  { name: 'taken', label: 'Taken (배운점)' },
] as const;

export function ExperienceAddResultStep({
  basicInfo,
  coreInfo,
  resultInfo,
  onBasicInfoChange,
  onCoreInfoChange,
}: ExperienceAddResultStepProps) {
  const [editingTagGroup, setEditingTagGroup] = useState<EditableTagGroup | null>(null);

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
            label={field.label}
            value={basicInfo[field.name]}
            onChange={(fieldValue) =>
              onBasicInfoChange({
                ...basicInfo,
                [field.name]: fieldValue,
              })
            }
          />
        ))}
      </ResultSection>

      <ResultSection number="02." title="태그">
        <ResultTagGroup
          label="기술"
          tags={resultInfo.skillTags}
          tone="skill"
          editing={editingTagGroup === 'skill'}
          onEdit={() => setEditingTagGroup('skill')}
        />
        <ResultTagGroup
          label="역량"
          tags={resultInfo.competencyTags}
          tone="competency"
          editing={editingTagGroup === 'competency'}
          onEdit={() => setEditingTagGroup('competency')}
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
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="body-2-regular text-strong">{label}</span>
      <TextField
        value={value}
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
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex w-full flex-col gap-4">
      <span className="title-2-bold text-strong">{label}</span>
      <TextField
        variant="textarea"
        value={value}
        description={false}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </label>
  );
}

function ResultTagGroup({
  label,
  tags,
  tone,
  editing,
  onEdit,
}: {
  label: string;
  tags: readonly string[];
  tone: React.ComponentProps<typeof Tag>['tone'];
  editing?: boolean;
  onEdit: () => void;
}) {
  if (editing) {
    return (
      <div className="flex w-full flex-col gap-2.5">
        <p className="body-2-regular text-strong">{label}</p>
        <div className="flex w-full flex-col overflow-hidden rounded-lg border border-border-default bg-background-w">
          <div className="flex min-h-[66px] flex-wrap items-center gap-2.5 px-5 py-4">
            {tags.map((tag) => (
              <Tag key={tag} tone={tone} size="large" removable>
                {tag}
              </Tag>
            ))}
          </div>
          <Input
            placeholder={`적용하고 싶은 ${label}을 작성해주세요`}
            className="rounded-none border-x-0 border-b-0"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-between gap-2.5">
      <div className="flex min-w-0 flex-col gap-2.5">
        <p className="body-2-regular text-strong">{label}</p>
        <div className="flex flex-wrap gap-2.5">
          {tags.map((tag) => (
            <Tag key={tag} tone={tone} size="large">
              {tag}
            </Tag>
          ))}
        </div>
      </div>
      <button
        type="button"
        aria-label={`${label} 태그 수정`}
        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded focus-visible:shadow-focus-ring focus-visible:outline-none"
        onClick={onEdit}
      >
        <EditIcon className="size-6 text-tertiary" />
      </button>
    </div>
  );
}
