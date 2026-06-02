'use client';

import { EditableTagGroup } from '@/app/(pages)/experience/_components/EditableTagGroup';
import type { EditableTagGroupKey } from '@/app/(pages)/experience/_hooks/useExperienceDetailForm';
import { Tag } from '@/components/common/Tag';

interface ExperienceDetailTagsProps {
  skillTags: string[];
  competencyTags: string[];
  isEditing: boolean;
  editingTagGroup: EditableTagGroupKey | null;
  onSkillTagsChange: (tags: string[]) => void;
  onCompetencyTagsChange: (tags: string[]) => void;
  onEditingTagGroupChange: (tagGroup: EditableTagGroupKey | null) => void;
}

export function ExperienceDetailTags({
  skillTags,
  competencyTags,
  isEditing,
  editingTagGroup,
  onSkillTagsChange,
  onCompetencyTagsChange,
  onEditingTagGroupChange,
}: ExperienceDetailTagsProps) {
  if (isEditing) {
    return (
      <div className="flex flex-col gap-2.5">
        <EditableTagGroup
          label="기술"
          tone="skill"
          tags={skillTags}
          editing={editingTagGroup === 'skill'}
          variant="bordered-row"
          viewTagSize="large"
          onChange={onSkillTagsChange}
          onEdit={() => onEditingTagGroupChange('skill')}
          onRequestClose={() => onEditingTagGroupChange(null)}
        />
        <EditableTagGroup
          label="역량"
          tone="competency"
          tags={competencyTags}
          editing={editingTagGroup === 'competency'}
          variant="bordered-row"
          viewTagSize="large"
          borderBottom
          onChange={onCompetencyTagsChange}
          onEdit={() => onEditingTagGroupChange('competency')}
          onRequestClose={() => onEditingTagGroupChange(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1">
        {skillTags.map((tag, index) => (
          <Tag key={`skill-${tag}-${index}`} tone="skill" size="large">
            {tag}
          </Tag>
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        {competencyTags.map((tag, index) => (
          <Tag key={`competency-${tag}-${index}`} tone="competency" size="large">
            {tag}
          </Tag>
        ))}
      </div>
    </div>
  );
}
