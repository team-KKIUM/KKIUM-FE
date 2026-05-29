'use client';

import * as React from 'react';

import type { JdId } from '@/app/api/apply/types';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { APPLY_COVER_LETTER_AI_DRAFT_PANEL_BLEED } from '../../_constants/applyConstants';
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
  hasAiDraft?: boolean;
  aiDraft?: string;
  onAiDraftChange?: (aiDraft: string) => void;
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
  hasAiDraft = false,
  aiDraft = '',
  onAiDraftChange,
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

  const storedDraftText = aiDraft.trim();
  const hasStoredAiDraft = hasAiDraft && storedDraftText.length > 0;

  React.useEffect(() => {
    if (!hasSelectedExperiences && !hasStoredAiDraft) {
      setAiDraftOpen(false);
      setDraftContent('');
      return;
    }

    if (hasStoredAiDraft) {
      setDraftContent(storedDraftText);
      setAiDraftOpen(true);
      return;
    }

    setAiDraftOpen(false);

    const resolvedDraft = cachedDraft.trim();
    setDraftContent(resolvedDraft);

    if (resolvedDraft.length > 0) {
      setAiDraftOpen(true);
    }
  }, [
    order,
    storedDraftText,
    hasStoredAiDraft,
    cachedDraft,
    hasSelectedExperiences,
  ]);

  const canUseAiDraft = hasSelectedExperiences || hasStoredAiDraft;
  const hasDraft = draftContent.trim().length > 0;
  const showAiDraftPanel = hasDraft && canUseAiDraft;
  const canGenerateAiDraft =
    hasSelectedExperiences &&
    !hasStoredAiDraft &&
    jdId != null &&
    jdQuestionId != null &&
    selectedExperienceIds.length > 0;

  const handleDraftGenerated = (draft: string) => {
    setDraftContent(draft);
    setAiDraftOpen(true);
    onAiDraftChange?.(draft);
  };

  const handleExpandedChange = (expanded: boolean) => {
    setAiDraftOpen(expanded);
  };

  return (
    <article
      data-slot="cover-letter-question-editor"
      className={cn(
        'flex min-h-0 w-full flex-1 flex-col gap-3 overflow-visible',
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
          className="mt-px shrink-0"
          hasDraft={hasDraft || hasStoredAiDraft}
          canGenerate={canGenerateAiDraft}
          isGenerating={isAiDraftGenerating}
          disabled={!canUseAiDraft || hasStoredAiDraft}
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
            showAiDraftPanel && !aiDraftOpen && 'pb-[47px]',
            showAiDraftPanel && aiDraftOpen && hasDraft && 'pb-56',
          )}
        />

        {showAiDraftPanel && (
          <ApplyCoverLetterAiDraftPanel
            expanded={aiDraftOpen}
            onExpandedChange={handleExpandedChange}
            draft={draftContent}
            hasDraft={hasDraft}
            className={APPLY_COVER_LETTER_AI_DRAFT_PANEL_BLEED}
          />
        )}
      </div>
    </article>
  );
}
