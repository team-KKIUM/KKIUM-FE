'use client';

import { useState } from 'react';

import {
  RESULT_BASIC_FIELDS,
  RESULT_COMPETENCY_TAGS,
  RESULT_CORE_FIELDS,
  RESULT_SKILL_TAGS,
} from '@/app/(pages)/experience/add/_constants/experienceResultData';
import { Tag } from '@/components/common/Tag';
import { TextField } from '@/components/common/TextField';
import { EditIcon } from '@/components/common/icons/EditIcon';
import { Input } from '@/components/ui/input';

type EditableTagGroup = 'skill' | 'competency';

export function ExperienceAddResultStep() {
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
        {RESULT_BASIC_FIELDS.map((field) => (
          <ResultField key={field.label} label={field.label} value={field.value} />
        ))}
      </ResultSection>

      <ResultSection number="02." title="태그">
        <ResultTagGroup
          label="기술"
          tags={RESULT_SKILL_TAGS}
          tone="skill"
          editing={editingTagGroup === 'skill'}
          onEdit={() => setEditingTagGroup('skill')}
        />
        <ResultTagGroup
          label="역량"
          tags={RESULT_COMPETENCY_TAGS}
          tone="competency"
          editing={editingTagGroup === 'competency'}
          onEdit={() => setEditingTagGroup('competency')}
        />
      </ResultSection>

      <ResultSection number="03." title="핵심 경험">
        {RESULT_CORE_FIELDS.map((field) => (
          <ResultField key={field.label} label={field.label} value={field.value} />
        ))}
      </ResultSection>
    </section>
  );
}

function ResultSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-3.5">
      <div className="flex items-start gap-0.5 title-2-bold">
        <span className="text-mint-300">{number}</span>
        <span className="text-strong">{title}</span>
      </div>
      <div className="flex w-full flex-col gap-2.5 px-[30px]">{children}</div>
    </div>
  );
}

function ResultField({ label, value }: { label: string; value: string }) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="body-2-regular text-strong">{label}</span>
      <TextField defaultValue={value} description={false} />
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
