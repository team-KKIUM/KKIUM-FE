'use client';

import * as React from 'react';

import { TagSet } from '@/app/(pages)/experience/_components/TagSet';
import { EditIcon } from '@/components/common/icons/EditIcon';
import { Tag } from '@/components/common/Tag';
import { cn } from '@/lib/utils';

interface EditableTagGroupProps {
  label: string;
  tags: readonly string[];
  tone: React.ComponentProps<typeof Tag>['tone'];
  editing?: boolean;
  borderBottom?: boolean;
  variant?: 'default' | 'bordered-row';
  viewTagSize?: React.ComponentProps<typeof Tag>['size'];
  onChange?: (tags: string[]) => void;
  onEdit?: () => void;
  onRequestClose?: () => void;
}

export function EditableTagGroup({
  label,
  tags,
  tone,
  editing = false,
  borderBottom = false,
  variant = 'default',
  viewTagSize = 'large',
  onChange,
  onEdit,
  onRequestClose,
}: EditableTagGroupProps) {
  if (editing) {
    return (
      <div className="flex w-full flex-col gap-2.5">
        <p className="body-2-regular text-strong">{label}</p>
        <TagSet
          label={label}
          tags={tags}
          tone={tone}
          onChange={onChange}
          onRequestClose={onRequestClose}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-2.5',
        variant === 'bordered-row' && 'min-h-[65px] border-t-[1.5px] border-border-bold pt-1.5',
        variant === 'bordered-row' && borderBottom && 'min-h-[75px] border-b-[1.5px] pb-2.5',
      )}
    >
      <div className="flex min-w-0 flex-col gap-2.5">
        <p className="body-2-regular text-strong">{label}</p>
        <div className="flex flex-wrap gap-2.5">
          {tags.map((tag, index) => (
            <Tag key={`${tag}-${index}`} tone={tone} size={viewTagSize}>
              {tag}
            </Tag>
          ))}
        </div>
      </div>
      {onEdit ? (
        <button
          type="button"
          aria-label={`${label} 태그 수정`}
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded text-tertiary focus-visible:shadow-focus-ring focus-visible:outline-none"
          onClick={onEdit}
        >
          <EditIcon className="size-6" />
        </button>
      ) : null}
    </div>
  );
}
