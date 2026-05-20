export const JOB_POSTING_ANALYSIS_MOCK = {
  companyName: '토스플레이스',
  field: 'Server Developer',
} as const;

export const RESULT_RECRUITMENT_FIELD_OPTIONS = [
  JOB_POSTING_ANALYSIS_MOCK.field,
  'Frontend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'Data Engineer',
] as const;

export const JOB_EDIT_STEP_HEADER: Record<'result' | 'manual', { title: string; description: string }> = {
  result: {
    title: '분석 결과 확인하기',
    description: '등록한 공고 결과를 확인해주세요.',
  },
  manual: {
    title: '공고 등록',
    description: '새로운 공고를 등록해주세요.',
  },
};
