'use client';

import * as React from 'react';

import type { JdId } from '@/app/api/apply/types';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { useApplyResumeAiDraft } from '@/hooks/apply/useApplyResumeAiDraft';

import { AiDraftButton } from './AiDraftButton';
import { ApplyCoverLetterAiDraftPanel } from './AiDraftPanel';

export interface ApplyCoverLetterQuestionEditorProps {
  order: number;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onTitleChange: (title: string) => void;
  hasSelectedExperiences?: boolean;
  jdId?: JdId | null;
  jdQuestionId?: number | null;
  selectedExperienceIds?: string[];
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
  jdId,
  jdQuestionId,
  selectedExperienceIds = [],
  className,
}: ApplyCoverLetterQuestionEditorProps) {
  const [aiDraftOpen, setAiDraftOpen] = React.useState(false);
  const [draftContent, setDraftContent] = React.useState('');
  const {
    cachedDraft,
    generateDraft,
    isGenerating: isAiDraftGenerating,
  } = useApplyResumeAiDraft(jdId, jdQuestionId, selectedExperienceIds);

  React.useEffect(() => {
    setAiDraftOpen(false);
    setDraftContent(cachedDraft);
  }, [order, cachedDraft]);

  const canUseAiDraft = hasSelectedExperiences;
  const hasDraft = draftContent.length > 0;
  const canGenerateAiDraft =
    jdId != null && jdQuestionId != null && selectedExperienceIds.length > 0;

  const handleDraftGenerated = (draft: string) => {
    setDraftContent(draft);
    setAiDraftOpen(true);
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
      <div className="flex w-full min-w-0 items-start gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-0.5">
          <span className="shrink-0 pt-px text-xl font-bold leading-7 text-mint-300">
            {formatQuestionOrder(order)}.
          </span>
          <textarea
            value={title}
            rows={2}
            onChange={(event) => onTitleChange(event.target.value)}
            aria-label={`${formatQuestionOrder(order)} 문항 제목`}
            className="min-h-14 max-h-14 min-w-0 flex-1 resize-none overflow-x-hidden overflow-y-auto border-none bg-transparent p-0 text-xl font-bold leading-7 break-words text-strong outline-none placeholder:text-tertiary focus-visible:ring-0"
          />
        </div>
        <AiDraftButton
          className="mt-px"
          hasDraft={hasDraft}
          canGenerate={canGenerateAiDraft}
          isGenerating={isAiDraftGenerating}
          disabled={!canUseAiDraft}
          onGenerate={generateDraft}
          onDraftGenerated={handleDraftGenerated}
        />
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
