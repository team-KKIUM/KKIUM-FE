'use client';

import * as React from 'react';

import type { ExperienceItem } from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import { DetailInput } from '@/components/common/DetailInput';
import { cn } from '@/lib/utils';

const detailFields = [
  ['Situation', 'situation'],
  ['Task', 'task'],
  ['Action', 'action'],
  ['Result', 'result'],
  ['Taken', 'taken'],
] as const;
const DETAIL_FIELD_MAX_LENGTH = 1000;

interface ExperienceDetailFieldsProps {
  detail: ExperienceItem['detail'];
  isEditing: boolean;
  isPage: boolean;
  onDetailChange: (
    key: keyof ExperienceItem['detail'],
  ) => React.ChangeEventHandler<HTMLTextAreaElement>;
}

export function ExperienceDetailFields({
  detail,
  isEditing,
  isPage,
  onDetailChange,
}: ExperienceDetailFieldsProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden py-6">
      {detailFields.map(([label, key]) => {
        const fieldValue = detail[key] ?? '';
        const characterCount = fieldValue.length;
        const isMaxLength = characterCount >= DETAIL_FIELD_MAX_LENGTH;

        return (
          <div key={key} className="flex w-full flex-col gap-1.5">
            <div className="flex items-end gap-3 px-2">
              <h3 className={cn('font-bold text-primary', isPage ? 'title-2-bold' : 'body-2-bold')}>
                {label}
              </h3>
              <p className={cn('caption-bold', isMaxLength ? 'text-danger' : 'text-quaternary')}>
                {characterCount}자 / {DETAIL_FIELD_MAX_LENGTH}자
              </p>
            </div>
            <DetailInput
              value={fieldValue}
              maxLength={DETAIL_FIELD_MAX_LENGTH}
              readOnly={!isEditing}
              onChange={onDetailChange(key)}
            />
          </div>
        );
      })}
    </div>
  );
}
