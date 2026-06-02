'use client';

import { ExperienceDetailInlineTextArea } from '@/app/(pages)/experience/_components/ExperienceDetailInlineTextArea';
import { EXPERIENCE_FIELD_MAX_LENGTHS } from '@/app/(pages)/experience/_utils/experienceFieldLimits';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExperienceDetailHeaderProps {
  title: string;
  description: string;
  isEditing: boolean;
  isSaving: boolean;
  isPage: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onEditClick: () => void;
  onSaveClick: () => void;
}

export function ExperienceDetailHeader({
  title,
  description,
  isEditing,
  isSaving,
  isPage,
  onTitleChange,
  onDescriptionChange,
  onEditClick,
  onSaveClick,
}: ExperienceDetailHeaderProps) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {isEditing ? (
          <ExperienceDetailInlineTextArea
            value={title}
            ariaLabel="제목"
            maxLength={EXPERIENCE_FIELD_MAX_LENGTHS.title}
            className={cn('text-strong', isPage ? 'heading-2-bold' : 'title-1-bold')}
            onChange={onTitleChange}
          />
        ) : (
          <h3
            className={cn(
              'w-full min-w-0 leading-[1.48] wrap-break-word text-strong',
              isPage ? 'heading-2-bold' : 'title-1-bold',
            )}
          >
            {title}
          </h3>
        )}

        {isEditing ? (
          <ExperienceDetailInlineTextArea
            value={description}
            ariaLabel="한 줄 설명"
            maxLength={EXPERIENCE_FIELD_MAX_LENGTHS.description}
            className={cn('text-quaternary', isPage ? 'body-1-bold' : 'body-3-regular')}
            onChange={onDescriptionChange}
          />
        ) : (
          <p
            className={cn(
              'w-full min-w-0 leading-[1.48] wrap-break-word text-quaternary',
              isPage ? 'body-1-bold' : 'body-3-regular',
            )}
          >
            {description}
          </p>
        )}
      </div>

      {isEditing ? (
        <Button type="button" disabled={isSaving} onClick={onSaveClick}>
          {isSaving ? '저장 중...' : '저장하기'}
        </Button>
      ) : (
        <Button type="button" variant="secondary" onClick={onEditClick}>
          수정하기
        </Button>
      )}
    </div>
  );
}
