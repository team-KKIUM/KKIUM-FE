'use client';

import * as React from 'react';

import { coverLetterAiDraftMock } from '../../_constants/applyMockData';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { AiDraftButton } from './AiDraftButton';
import { ApplyCoverLetterAiDraftPanel } from './AiDraftPanel';

export interface ApplyCoverLetterQuestionEditorProps {
  order: number;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onTitleChange: (title: string) => void;
  hasSelectedExperiences?: boolean;
  aiDraft?: string;
  className?: string;
}

function formatQuestionOrder(order: number) {
  return String(order).padStart(2, '0');
}

export function ApplyCoverLetterQuestionEditor({
  order,
  title,
  value,
  onChange,
  onTitleChange,
  hasSelectedExperiences = false,
  aiDraft = coverLetterAiDraftMock,
  className,
}: ApplyCoverLetterQuestionEditorProps) {
  const [aiDraftOpen, setAiDraftOpen] = React.useState(false);
  const [draftContent, setDraftContent] = React.useState('');

  React.useEffect(() => {
    setAiDraftOpen(false);
    setDraftContent('');
  }, [order]);

  const canUseAiDraft = hasSelectedExperiences;
  const hasDraft = draftContent.length > 0;

  const openAiDraft = () => {
    setDraftContent(aiDraft);
    setAiDraftOpen(true);
  };

  const handleAiDraftClick = () => {
    if (!canUseAiDraft || hasDraft) {
      return;
    }

    openAiDraft();
  };

  const handleExpandedChange = (expanded: boolean) => {
    setAiDraftOpen(expanded);
  };

  return (
    <article
      data-slot="cover-letter-question-editor"
      className={cn(
        'flex min-h-0 w-full flex-1 flex-col gap-3 overflow-visible pr-10',
        className,
      )}
    >
      <div className="flex w-full min-w-0 items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-0.5">
          <span className="shrink-0 text-xl font-bold leading-7 text-mint-300">
            {formatQuestionOrder(order)}.
          </span>
          <input
            type="text"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            aria-label={`${formatQuestionOrder(order)} 문항 제목`}
            className="h-7 min-w-0 flex-1 border-none bg-transparent p-0 text-xl font-bold leading-7 text-strong outline-none placeholder:text-tertiary focus-visible:ring-0"
          />
        </div>
        <AiDraftButton disabled={!canUseAiDraft || hasDraft} onClick={handleAiDraftClick} />
      </div>

      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-visible">
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="여기에 자기소개서를 작성해보세요."
          aria-label={`${formatQuestionOrder(order)} ${title} 답변`}
          className={cn(
            'h-full min-h-0 flex-1 resize-none border-none bg-transparent p-0 body-1-regular leading-6 text-strong shadow-none placeholder:text-tertiary focus-visible:border-none focus-visible:bg-transparent focus-visible:ring-0',
            canUseAiDraft && hasDraft && 'pb-11',
            canUseAiDraft && aiDraftOpen && hasDraft && 'pb-56',
          )}
        />

        {canUseAiDraft && hasDraft && (
          <ApplyCoverLetterAiDraftPanel
            expanded={aiDraftOpen}
            onExpandedChange={handleExpandedChange}
            draft={draftContent}
            hasDraft={hasDraft}
            className="-left-9 -right-10"
          />
        )}
      </div>
    </article>
  );
}
