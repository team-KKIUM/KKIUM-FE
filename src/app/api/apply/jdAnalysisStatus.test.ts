import {
  isJdAnalysisCompleted,
  isJdAnalysisFailed,
  isJdAnalysisInProgress,
  isJdAnalysisTerminal,
  normalizeJdAnalysisStatus,
  resolveJdAnalysisStatus,
} from './jdAnalysisStatus';

describe('jdAnalysisStatus utils', () => {
  test('normalizeJdAnalysisStatus trims and uppercases', () => {
    expect(normalizeJdAnalysisStatus(' pending ')).toBe('PENDING');
    expect(normalizeJdAnalysisStatus(undefined)).toBe('');
  });

  test('resolveJdAnalysisStatus prefers analysisStatus then analysis_status', () => {
    expect(resolveJdAnalysisStatus({ analysisStatus: ' PENDING ' })).toBe('PENDING');
    expect(resolveJdAnalysisStatus({ analysis_status: ' COMPLETED ' })).toBe('COMPLETED');
    expect(resolveJdAnalysisStatus(undefined)).toBeUndefined();
  });

  test('terminal status checks', () => {
    expect(isJdAnalysisCompleted('completed')).toBe(true);
    expect(isJdAnalysisFailed('FAILED')).toBe(true);
    expect(isJdAnalysisTerminal('FAILED')).toBe(true);
    expect(isJdAnalysisTerminal('COMPLETED')).toBe(true);
    expect(isJdAnalysisTerminal('PENDING')).toBe(false);
  });

  test('in progress includes empty and pending-like statuses', () => {
    expect(isJdAnalysisInProgress(undefined)).toBe(true);
    expect(isJdAnalysisInProgress('PENDING')).toBe(true);
    expect(isJdAnalysisInProgress('RUNNING')).toBe(true);
    expect(isJdAnalysisInProgress('COMPLETED')).toBe(false);
    expect(isJdAnalysisInProgress('FAILED')).toBe(false);
  });
});
