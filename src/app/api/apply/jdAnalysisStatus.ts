export function normalizeJdAnalysisStatus(status: string | undefined) {
  return status?.trim().toUpperCase() ?? '';
}

export function resolveJdAnalysisStatus(data: {
  analysisStatus?: string;
  analysis_status?: string;
} | null | undefined) {
  const raw = data?.analysisStatus ?? data?.analysis_status;
  return raw?.trim() || undefined;
}

export function isJdAnalysisCompleted(status: string | undefined) {
  return normalizeJdAnalysisStatus(status) === 'COMPLETED';
}

export function isJdAnalysisFailed(status: string | undefined) {
  return normalizeJdAnalysisStatus(status) === 'FAILED';
}

export function isJdAnalysisTerminal(status: string | undefined) {
  const normalized = normalizeJdAnalysisStatus(status);
  return normalized === 'COMPLETED' || normalized === 'FAILED';
}

// COMPLETED 또는 FAILED 제외한 모든 상태 
export function isJdAnalysisInProgress(status: string | undefined) {
  if (!status) {
    return true;
  }

  return !isJdAnalysisTerminal(status);
}

export function hasRenderableJdAnalysisContent(
  data:
    | {
        jdInfo?: {
          mainResponsibilities?: string | null;
          requiredQualifications?: string | null;
          preferredQualifications?: string | null;
        } | null;
      }
    | null
    | undefined,
) {
  const jdInfo = data?.jdInfo;
  if (!jdInfo) {
    return false;
  }

  return [
    jdInfo.mainResponsibilities,
    jdInfo.requiredQualifications,
    jdInfo.preferredQualifications,
  ].some((value) => typeof value === 'string' && value.trim().length > 0);
}
