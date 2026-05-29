import {
  JOB_POSTING_BODY_MAX_LENGTH,
  JOB_POSTING_COVER_QUESTION_MAX_LENGTH,
} from '@/app/(pages)/apply/_constants/applyConstants';

export function limitJobPostingBodyText(value: string) {
  return value.slice(0, JOB_POSTING_BODY_MAX_LENGTH);
}

export function limitJobPostingCoverQuestionText(value: string) {
  return value.slice(0, JOB_POSTING_COVER_QUESTION_MAX_LENGTH);
}
