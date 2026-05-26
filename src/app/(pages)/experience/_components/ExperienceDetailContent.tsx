'use client';

import Image from 'next/image';
import * as React from 'react';

import type { ExperienceItem } from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import { getExperienceCategoryMeta } from '@/app/(pages)/experience/_utils/ExperienceCategory';
import { CalendarIcon } from '@/components/common/icons/CalendarIcon';
import { EditIcon } from '@/components/common/icons/EditIcon';
import { Tag } from '@/components/common/Tag';
import { DetailInput } from '@/components/common/DetailInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const detailFields = [
  ['Situation', 'situation'],
  ['Task', 'task'],
  ['Action', 'action'],
  ['Result', 'result'],
  ['Taken', 'taken'],
] as const;

type EditableTagGroupKey = 'skill' | 'competency';

export interface ExperienceDetailContentProps extends React.ComponentProps<'div'> {
  experience: ExperienceItem;
  variant?: 'panel' | 'page';
  defaultEditing?: boolean;
  scrollable?: boolean;
  onEdit?: () => void;
  onSave?: (experience: Pick<ExperienceItem, 'detail' | 'skillTags' | 'competencyTags'>) => void;
}

export function ExperienceDetailContent({
  experience,
  variant = 'panel',
  defaultEditing = false,
  scrollable = true,
  onEdit,
  onSave,
  className,
  ...props
}: ExperienceDetailContentProps) {
  const category = getExperienceCategoryMeta(experience.type);
  const isPage = variant === 'page';
  const [detail, setDetail] = React.useState(experience.detail);
  const [skillTags, setSkillTags] = React.useState(experience.skillTags);
  const [competencyTags, setCompetencyTags] = React.useState(experience.competencyTags);
  const [isEditing, setIsEditing] = React.useState(defaultEditing);
  const [editingTagGroup, setEditingTagGroup] = React.useState<EditableTagGroupKey | null>(null);
  const previousExperienceIdRef = React.useRef(experience.id);

  React.useEffect(() => {
    if (previousExperienceIdRef.current === experience.id) {
      return;
    }

    previousExperienceIdRef.current = experience.id;
    setDetail(experience.detail);
    setSkillTags(experience.skillTags);
    setCompetencyTags(experience.competencyTags);
    setIsEditing(defaultEditing);
    setEditingTagGroup(null);
  }, [
    defaultEditing,
    experience.competencyTags,
    experience.detail,
    experience.id,
    experience.skillTags,
  ]);

  const handleDetailChange =
    (key: keyof ExperienceItem['detail']): React.ChangeEventHandler<HTMLTextAreaElement> =>
    (event) => {
      setDetail((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    };

  const handleEditClick = () => {
    onEdit?.();
    setIsEditing(true);
    setEditingTagGroup(null);
  };

  const handleSaveEdit = () => {
    onSave?.({
      detail,
      skillTags,
      competencyTags,
    });
    setIsEditing(false);
    setEditingTagGroup(null);
  };

  return (
    <div
      data-slot="experience-detail-content"
      className={cn('flex min-h-0 flex-1 flex-col', className)}
      {...props}
    >
      <div className={cn('flex flex-col', isPage ? 'gap-7' : 'gap-6')}>
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className={cn('text-strong', isPage ? 'heading-2-bold' : 'title-1-bold')}>
              {experience.title}
            </h3>
            <p className={cn('text-quaternary', isPage ? 'body-1-bold' : 'body-3-regular')}>
              {experience.description}
            </p>
          </div>

          {isEditing ? (
            <Button type="button" onClick={handleSaveEdit}>
              저장하기
            </Button>
          ) : (
            <Button type="button" variant="secondary" onClick={handleEditClick}>
              수정하기
            </Button>
          )}
        </div>

        <div className={cn('flex items-start gap-5', isPage && 'items-center')}>
          <div
            className={cn(
              'flex shrink-0 flex-col items-center gap-0.5',
              isPage ? 'w-[109px]' : 'w-[83px]',
            )}
          >
            <Image
              src={category.selectedIconSrc}
              alt=""
              width={isPage ? 109 : 72}
              height={isPage ? 109 : 72}
              className={cn(isPage ? 'size-[109px]' : 'size-[72px]')}
            />
            <span className={cn('font-bold text-strong', isPage ? 'body-2-bold' : 'body-3-bold')}>
              {category.label}
            </span>
          </div>

          <dl className={cn('flex flex-col gap-1.5', isPage ? 'pt-0' : 'pt-2.5')}>
            {experience.detailInfo.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <dt className={cn('font-bold text-strong', isPage ? 'body-1-bold' : 'body-3-bold')}>
                  {item.label}
                </dt>
                <dd
                  className={cn(
                    'flex items-center gap-1 text-secondary',
                    isPage ? 'body-1-regular' : 'body-3-regular',
                  )}
                >
                  {isEditing && item.label === '기간' && (
                    <CalendarIcon className="size-[21px] shrink-0 text-tertiary" />
                  )}
                  <span>{item.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2.5">
            <EditableTagGroup
              label="기술"
              tone="skill"
              tags={skillTags}
              editing={editingTagGroup === 'skill'}
              variant="bordered-row"
              viewTagSize="default"
              onChange={setSkillTags}
              onEdit={() => setEditingTagGroup('skill')}
            />
            <EditableTagGroup
              label="역량"
              tone="competency"
              tags={competencyTags}
              editing={editingTagGroup === 'competency'}
              variant="bordered-row"
              viewTagSize="default"
              borderBottom
              onChange={setCompetencyTags}
              onEdit={() => setEditingTagGroup('competency')}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1">
              {skillTags.map((tag, index) => (
                <Tag key={`skill-${tag}-${index}`} tone="skill" size={isPage ? 'large' : 'default'}>
                  {tag}
                </Tag>
              ))}
            </div>

            <div className="flex flex-wrap gap-1">
              {competencyTags.map((tag, index) => (
                <Tag
                  key={`competency-${tag}-${index}`}
                  tone="competency"
                  size={isPage ? 'large' : 'default'}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </div>

      {!isEditing ? <div className="mt-4 h-px w-full shrink-0 bg-gray-300" /> : null}

      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden py-6',
          scrollable && 'overflow-y-auto',
        )}
      >
        {detailFields.map(([label, key]) => (
          <div key={key} className="flex w-full flex-col gap-1.5">
            <div className="flex items-center justify-between px-2">
              <h3 className={cn('font-bold text-primary', isPage ? 'title-2-bold' : 'body-2-bold')}>
                {label}
              </h3>
            </div>
            <DetailInput
              value={detail[key]}
              maxLength={1000}
              readOnly={!isEditing}
              onChange={handleDetailChange(key)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

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
}

function EditableTagGroup({
  label,
  tags,
  tone,
  editing = false,
  borderBottom = false,
  variant = 'default',
  viewTagSize = 'large',
  onChange,
  onEdit,
}: EditableTagGroupProps) {
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    if (!editing) {
      setInputValue('');
    }
  }, [editing]);

  const handleAddTag = () => {
    const nextTag = inputValue.trim();

    if (!nextTag || tags.includes(nextTag)) {
      return;
    }

    onChange?.([...tags, nextTag]);
    setInputValue('');
  };

  const handleRemoveTag = (targetIndex: number) => {
    onChange?.(tags.filter((_, index) => index !== targetIndex));
  };

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    handleAddTag();
  };

  if (editing) {
    return (
      <div className="flex w-full flex-col gap-2.5">
        <p className="body-2-regular text-strong">{label}</p>
        <div className="flex w-full flex-col overflow-hidden rounded-lg border border-border-default bg-background-w shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)]">
          <div className="flex min-h-[66px] flex-wrap items-center gap-2.5 px-5 py-4">
            {tags.map((tag, index) => (
              <Tag
                key={`${tag}-${index}`}
                tone={tone}
                size="large"
                removable
                onRemove={() => handleRemoveTag(index)}
              >
                {tag}
              </Tag>
            ))}
          </div>
          <Input
            value={inputValue}
            placeholder={`적용하고 싶은 ${label}을 작성해주세요`}
            className="rounded-none border-x-0 border-b-0"
            onBlur={handleAddTag}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleInputKeyDown}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-2.5',
        variant === 'bordered-row' && 'min-h-[65px] border-t border-border-default pt-1',
        variant === 'bordered-row' && borderBottom && 'min-h-[75px] border-b pb-2.5',
      )}
    >
      <div className="flex min-w-0 flex-col gap-2.5">
        <p className="body-2-regular text-strong">{label}</p>
        <div className="flex flex-wrap gap-2.5">
          {tags.map((tag) => (
            <Tag key={tag} tone={tone} size={viewTagSize}>
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
