import Image from 'next/image';
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { ErrorDialog } from '@/components/common/ErrorDialog';
import { Tag } from '@/components/common/Tag';
import { getExperienceCategoryIconSrc } from '@/app/(pages)/experience/_utils/ExperienceCategory';
import { cn } from '@/lib/utils';
import { ExperienceCardDropdownMenu } from './ExperienceCardDropdownMenu';
import type { ExperienceCategory } from './ExperienceCategoryTab';

const experienceCardVariants = cva(
  'flex w-full flex-col justify-between gap-2 overflow-hidden rounded-xl border border-border-default bg-background-w px-[18px] py-5 transition-shadow focus-visible:shadow-focus-ring focus-visible:outline-none',
  {
    variants: {
      size: {
        small: 'max-w-[336px]',
        default: 'max-w-[494px]',
        large: 'max-w-[644px]',
      },
      selected: {
        true: 'shadow-[0_0_0_3px_var(--color-mint-main)]',
        false: '',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-lg',
        false: '',
      },
    },
    defaultVariants: {
      size: 'small',
      selected: false,
      interactive: false,
    },
  },
);

export interface ExperienceCardProps
  extends
    Omit<React.ComponentProps<'article'>, 'title'>,
    Omit<VariantProps<typeof experienceCardVariants>, 'interactive'> {
  type: Exclude<ExperienceCategory, 'all'>;
  title: string;
  period: string;
  skillTags: string[];
  competencyTags: string[];
  disableActivationKeys?: boolean;
  onDelete?: () => Promise<void> | void;
  onTitleSave?: (nextTitle: string) => Promise<void> | void;
}

export const ExperienceCard = React.forwardRef<HTMLElement, ExperienceCardProps>(
  function ExperienceCard(
    {
      type,
      title,
      period,
      skillTags,
      competencyTags,
      size,
      selected,
      className,
      onClick,
      onKeyDown,
      disableActivationKeys = false,
      onDelete,
      onTitleSave,
      ...props
    },
    ref,
  ) {
    const isInteractive = Boolean(onClick);
    const [displayTitle, setDisplayTitle] = React.useState(title);
    const [titleDraft, setTitleDraft] = React.useState(title);
    const [isEditingTitle, setIsEditingTitle] = React.useState(false);
    const [isTitleSaving, setIsTitleSaving] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const titleInputRef = React.useRef<HTMLInputElement>(null);
    const isCommittingTitleRef = React.useRef(false);

    React.useEffect(() => {
      if (isEditingTitle) return;

      setDisplayTitle(title);
      setTitleDraft(title);
    }, [isEditingTitle, title]);

    React.useEffect(() => {
      if (!isEditingTitle) return;

      const titleInput = titleInputRef.current;

      titleInput?.focus();
      titleInput?.setSelectionRange(titleInput.value.length, titleInput.value.length);
    }, [isEditingTitle]);

    const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
      onKeyDown?.(event);

      if (event.defaultPrevented || event.target !== event.currentTarget || !onClick) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        if (disableActivationKeys) {
          return;
        }

        event.preventDefault();
        onClick(event as unknown as React.MouseEvent<HTMLElement>);
      }
    };

    const startTitleEdit = () => {
      setTitleDraft(displayTitle);
      setIsEditingTitle(true);
    };

    const cancelTitleEdit = () => {
      setTitleDraft(displayTitle);
      setIsEditingTitle(false);
    };

    const commitTitleEdit = async () => {
      if (isCommittingTitleRef.current) return;

      const nextTitle = titleDraft.trim();

      if (!nextTitle || nextTitle === displayTitle) {
        cancelTitleEdit();
        return;
      }

      isCommittingTitleRef.current = true;
      setIsTitleSaving(true);

      try {
        await onTitleSave?.(nextTitle);
        setDisplayTitle(nextTitle);
        setTitleDraft(nextTitle);
        setIsEditingTitle(false);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '제목 수정 중 오류가 발생했습니다.');
      } finally {
        isCommittingTitleRef.current = false;
        setIsTitleSaving(false);
      }
    };

    const handleTitleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
      event.stopPropagation();

      if (event.nativeEvent.isComposing) return;

      if (event.key === 'Enter') {
        event.preventDefault();
        void commitTitleEdit();
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        cancelTitleEdit();
      }
    };

    return (
      <>
        <article
          ref={ref}
          tabIndex={isInteractive ? 0 : undefined}
          role={isInteractive ? 'button' : undefined}
          data-slot="experience-card"
          data-type={type}
          className={cn(
            experienceCardVariants({ size, selected, interactive: isInteractive, className }),
          )}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          {...props}
        >
          <div className="flex w-full items-start justify-between">
            <Image
              src={getExperienceCategoryIconSrc(type)}
              alt=""
              width={72}
              height={72}
              className="size-[72px] shrink-0"
            />
            <ExperienceCardDropdownMenu
              triggerClassName="shrink-0"
              onEditTitle={startTitleEdit}
              onDelete={() => void onDelete?.()}
            />
          </div>

          <div className="flex w-full flex-col items-start gap-3">
            <div className="flex w-full flex-col items-start gap-1">
              {isEditingTitle ? (
                <input
                  ref={titleInputRef}
                  value={titleDraft}
                  aria-label="경험 제목"
                  disabled={isTitleSaving}
                  className="w-full truncate bg-transparent p-0 title-1-bold text-gray-main outline-none disabled:text-tertiary"
                  onBlur={() => void commitTitleEdit()}
                  onChange={(event) => setTitleDraft(event.currentTarget.value)}
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={handleTitleInputKeyDown}
                  onPointerDown={(event) => event.stopPropagation()}
                />
              ) : (
                <h2 className="w-full truncate title-1-bold text-gray-main">{displayTitle}</h2>
              )}
              <div className="flex items-center gap-[6px] label-3-regular text-gray-700">
                <span>기간</span>
                <span>{period}</span>
              </div>
            </div>

            <div className="flex flex-col items-start gap-1.5">
              <TagRow tags={skillTags} tone="skill" />
              <TagRow tags={competencyTags} tone="competency" />
            </div>
          </div>
        </article>
        <ErrorDialog
          open={errorMessage.length > 0}
          message={errorMessage}
          onOpenChange={(open) => {
            if (!open) {
              setErrorMessage('');
            }
          }}
        />
      </>
    );
  },
);

function TagRow({
  tags,
  tone,
}: {
  tags: string[];
  tone: React.ComponentProps<typeof Tag>['tone'];
}) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      {tags.map((tag, index) => (
        <Tag key={`${tag}-${index}`} tone={tone}>
          {tag}
        </Tag>
      ))}
    </div>
  );
}

export { experienceCardVariants };
