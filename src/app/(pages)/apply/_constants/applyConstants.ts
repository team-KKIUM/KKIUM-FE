// --- 페이지 레이아웃 ---

export const APPLY_PAGE_HORIZONTAL_PADDING = 'px-20';

// --- 자기소개서 제한 ---

export const APPLY_COVER_LETTER_MAX_QUESTIONS = 5;
export const APPLY_COVER_LETTER_MAX_SELECTED_EXPERIENCES = 3;

// --- 공고 등록 모달 ---

export const JOB_POSTING_MODAL_CONTENT_CLASS =
  'flex h-[857px] max-h-[calc(100dvh-40px)] w-full max-w-[864px] flex-col gap-6 overflow-hidden px-[30px] py-5';

export const JOB_POSTING_PRIMARY_BUTTON_CLASS = 'h-12 w-full shrink-0';

export const JOB_EDIT_STEP_HEADER: Record<'result' | 'manual', { title: string; description: string }> =
  {
    result: {
      title: '분석 결과 확인하기',
      description: '등록한 공고 결과를 확인해주세요.',
    },
    manual: {
      title: '공고 등록',
      description: '새로운 공고를 등록해주세요.',
    },
  };

export const RESULT_RECRUITMENT_FIELD_OPTIONS = [
  'Server Developer',
  'Frontend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'Data Engineer',
] as const;
