'use client';

import * as React from 'react';

import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { Tag } from '@/components/common/Tag';
import { cn } from '@/lib/utils';

const DEFAULT_MAX_TAG_COUNT = 4;

interface TagSetProps {
  label: string;
  tags: readonly string[];
  tone: React.ComponentProps<typeof Tag>['tone'];
  className?: string;
  placeholder?: string;
  maxTagCount?: number;
  onChange?: (tags: string[]) => void;
}

export function TagSet({
  label,
  tags,
  tone,
  className,
  placeholder = `적용하고 싶은 ${label}을 작성해주세요`,
  maxTagCount = DEFAULT_MAX_TAG_COUNT,
  onChange,
}: TagSetProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const trimmedInputValue = inputValue.trim();
  const canShowAddButton = trimmedInputValue.length > 0;

  const addTag = () => {
    if (!trimmedInputValue || tags.includes(trimmedInputValue)) return;

    if (tags.length >= maxTagCount) {
      setErrorMessage(`태그는 최대 ${maxTagCount}개까지입니다.`);
      return;
    }

    onChange?.([...tags, trimmedInputValue]);
    setInputValue('');
    setErrorMessage('');
  };

  const removeTag = (targetIndex: number) => {
    onChange?.(tags.filter((_, index) => index !== targetIndex));
    setErrorMessage('');
  };

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key !== 'Enter') return;

    event.preventDefault();
    addTag();
  };

  return (
    <div
      className={cn(
        'flex shrink-0 flex-col items-start overflow-hidden rounded-lg border border-border-default bg-background-w shadow-lg',
        className,
      )}
    >
      <div className="flex w-full flex-wrap items-start gap-2.5 px-5 py-4">
        {tags.map((tag, index) => (
          <Tag
            key={`${tag}-${index}`}
            tone={tone}
            size="large"
            removable
            onRemove={() => removeTag(index)}
          >
            {tag}
          </Tag>
        ))}
      </div>

      {errorMessage ? (
        <div className="w-full border-b border-danger px-5 pb-1.5">
          <p className="body-2-bold text-danger">{errorMessage}</p>
        </div>
      ) : null}

      <div className="flex h-[54px] w-full items-center border-t border-border-default bg-background-w">
        <input
          value={inputValue}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent px-5 py-4 body-2-bold text-strong outline-none placeholder:text-quaternary"
          onBlur={addTag}
          onChange={(event) => {
            setInputValue(event.target.value);
            setErrorMessage('');
          }}
          onKeyDown={handleInputKeyDown}
        />
        {canShowAddButton ? (
          <button
            type="button"
            aria-label={`${trimmedInputValue} 태그 추가`}
            className="flex size-[50px] shrink-0 cursor-pointer items-center justify-center text-strong focus-visible:shadow-focus-ring focus-visible:outline-none"
            onMouseDown={(event) => event.preventDefault()}
            onClick={addTag}
          >
            <PlusIcon className="size-6" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
