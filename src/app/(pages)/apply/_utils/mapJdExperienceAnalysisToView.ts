import type { JdExperienceAnalysisResponse } from '@/app/api/apply/types';
import type { ExperienceAnalysisData } from '../_constants/applyMockData';

export function mapJdExperienceAnalysisToView(
  response: JdExperienceAnalysisResponse,
): ExperienceAnalysisData {
  return {
    goodPoints: response.analysis.strengths,
    badPoints: response.analysis.weaknesses,
    usageGuide: response.analysis.usageGuide,
    highlightKeywords: response.analysis.highlightKeywords.map((item) => ({
      keyword: item.keyword,
      sources: item.sources,
    })),
  };
}
