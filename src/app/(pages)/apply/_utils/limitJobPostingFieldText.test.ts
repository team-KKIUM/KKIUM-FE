import {
  JOB_POSTING_BODY_MAX_LENGTH,
  JOB_POSTING_COVER_QUESTION_MAX_LENGTH,
} from '../_constants/applyConstants';
import {
  limitJobPostingBodyText,
  limitJobPostingCoverQuestionText,
} from './limitJobPostingFieldText';

describe('limitJobPostingFieldText', () => {
  test('limitJobPostingBodyText truncates to max body length', () => {
    const value = 'a'.repeat(JOB_POSTING_BODY_MAX_LENGTH + 10);
    expect(limitJobPostingBodyText(value)).toHaveLength(JOB_POSTING_BODY_MAX_LENGTH);
  });

  test('limitJobPostingCoverQuestionText truncates to max question length', () => {
    const value = 'b'.repeat(JOB_POSTING_COVER_QUESTION_MAX_LENGTH + 5);
    expect(limitJobPostingCoverQuestionText(value)).toHaveLength(JOB_POSTING_COVER_QUESTION_MAX_LENGTH);
  });
});
