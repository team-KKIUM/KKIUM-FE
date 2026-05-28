'use client';

import { useEffect } from 'react';

import { EmptyState } from '@/components/common/EmptyState';
import { LoadingLottie } from '@/components/common/LoadingLottie';
import { useApplyJobAnalysis } from '@/hooks/apply/useApplyJobAnalysis';
import { useApplyJobPostingSnapshot } from '@/hooks/apply/useApplyJobPostingSnapshot';

import { isJdAnalysisFailed } from '@/app/api/apply/jdAnalysisStatus';
import { useApplyHighlightKeywordStore } from '@/app/(pages)/apply/_stores/useApplyHighlightKeywordStore';
import { mapJdAnalysisToView } from '../../_utils/mapJdAnalysisToView';
import { ApplyFitScore } from './ApplyFitScore';
import { ApplyJobInfo } from './ApplyJobInfo';
import { ApplyJobTags } from './ApplyJobTags';
import { ApplySectionHeader } from './ApplySectionHeader';
import { ApplyText } from './ApplyText';

export interface ApplyAnalysisProps {
  jdId: string | null;
}

const HARD_SKILL_SOURCES = new Set(['hardSkill', 'hardSkills']);
const SOFT_SKILL_SOURCES = new Set(['softSkill', 'softSkills']);

function normalizeKeyword(value: string) {
  return value.trim().toLowerCase();
}

function normalizeComparableKeyword(value: string) {
  return normalizeKeyword(value).replace(/\s+/g, '');
}

export function ApplyAnalysis({ jdId }: ApplyAnalysisProps) {
  const {
    data: result,
    error,
    isError,
    analysisStatus,
    isAnalysisLoading,
  } = useApplyJobAnalysis(jdId);
  const { jobPosting } = useApplyJobPostingSnapshot(jdId);
  const highlightKeywords = useApplyHighlightKeywordStore((state) => state.keywords);
  const highlightExperienceId = useApplyHighlightKeywordStore((state) => state.experienceId);

  useEffect(() => {
    console.log('[ApplyAnalysis] highlight keywords updated', {
      jdId,
      experienceId: highlightExperienceId,
      keywordCount: highlightKeywords.length,
      highlightKeywords,
    });
  }, [highlightExperienceId, highlightKeywords, jdId]);

  if (!jdId) {
    return (
      <EmptyState
        className="min-h-96 w-full py-16"
        illustrationLabel="공고 미선택"
        title="분석할 공고를 선택해주세요"
        description="지원 관리 목록에서 자기소개서 작성하기를 눌러주세요."
      />
    );
  }

  if (isError) {
    return (
      <EmptyState
        className="min-h-96 w-full py-16"
        illustrationLabel="공고 분석 조회 실패"
        title="공고 분석을 불러오지 못했어요"
        description={
          error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.'
        }
      />
    );
  }

  if (isAnalysisLoading) {
    if (result && isJdAnalysisFailed(analysisStatus)) {
      return (
        <EmptyState
          className="min-h-96 w-full py-16"
          illustrationLabel="공고 분석 실패"
          title="공고 분석에 실패했어요"
          description="잠시 후 다시 시도해주세요."
        />
      );
    }

    return (
      <div
        className="flex min-h-96 w-full flex-1 flex-col items-center justify-center gap-3"
        aria-live="polite"
        aria-busy="true"
        aria-label="공고 분석 중"
      >
        <LoadingLottie />
        <p className="body-1-bold text-strong">AI가 공고를 분석하는 중...</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const analysis = mapJdAnalysisToView(result);
  const matchedExperienceCount = result.matchResult?.experiences.length ?? 0;

  const jobInfoFromStore = jobPosting
    ? {
        postingTitle: jobPosting.title,
        companyName: jobPosting.companyName,
        jobField: jobPosting.jobField,
        period: jobPosting.period,
      }
    : null;

  const jobInfoFromAnalysis =
    analysis.jobInfo.postingTitle ||
      analysis.jobInfo.companyName ||
      analysis.jobInfo.jobField
      ? analysis.jobInfo
      : null;

  const jobInfo = jobInfoFromStore ?? jobInfoFromAnalysis;
  const fitScore = matchedExperienceCount === 0 ? 0 : (analysis.fitScore ?? 0);
  const sectionKeywordMap = {
    mainResponsibilities: [] as string[],
    requiredQualifications: [] as string[],
    preferredQualifications: [] as string[],
  };
  const matchedHardSkillKeywords = new Set<string>();
  const matchedSoftSkillKeywords = new Set<string>();

  highlightKeywords.forEach((item) => {
    const normalizedSources = item.sources.map((source) => source.trim());
    const comparableKeyword = normalizeComparableKeyword(item.keyword);

    if (normalizedSources.some((source) => HARD_SKILL_SOURCES.has(source))) {
      matchedHardSkillKeywords.add(comparableKeyword);
    }

    if (normalizedSources.some((source) => SOFT_SKILL_SOURCES.has(source))) {
      matchedSoftSkillKeywords.add(comparableKeyword);
    }

    if (normalizedSources.includes('mainResponsibilities')) {
      sectionKeywordMap.mainResponsibilities.push(item.keyword);
    }

    if (normalizedSources.includes('requiredQualifications')) {
      sectionKeywordMap.requiredQualifications.push(item.keyword);
    }

    if (normalizedSources.includes('preferredQualifications')) {
      sectionKeywordMap.preferredQualifications.push(item.keyword);
    }
  });

  const grayHardSkillKeywords = analysis.tags.skills
    .map((item) => item.label)
    .filter((label) => !matchedHardSkillKeywords.has(normalizeComparableKeyword(label)));
  const graySoftSkillKeywords = analysis.tags.competencies
    .map((item) => item.label)
    .filter((label) => !matchedSoftSkillKeywords.has(normalizeComparableKeyword(label)));
  const grayHardSkillKeywordSet = new Set(grayHardSkillKeywords.map(normalizeComparableKeyword));
  const graySoftSkillKeywordSet = new Set(graySoftSkillKeywords.map(normalizeComparableKeyword));
  const skills = analysis.tags.skills.map((item) => ({
    ...item,
    on: !grayHardSkillKeywordSet.has(normalizeComparableKeyword(item.label)),
  }));
  const competencies = analysis.tags.competencies.map((item) => ({
    ...item,
    on: !graySoftSkillKeywordSet.has(normalizeComparableKeyword(item.label)),
  }));

  return (
    <section className="flex w-full flex-col gap-8">
      <ApplySectionHeader title="공고 분석" infoVariant="job-analysis" />

      <ApplyFitScore value={fitScore} />

      {jobInfo ? <ApplyJobInfo {...jobInfo} /> : null}

      {analysis.tags.skills.length > 0 || analysis.tags.competencies.length > 0 ? (
        <ApplyJobTags skills={skills} competencies={competencies} />
      ) : null}

      <div className="mb-9 flex w-full flex-col gap-6">
        {analysis.sections.map((section) => {
          const highlightSectionKeywords =
            section.title === '주요 업무'
              ? sectionKeywordMap.mainResponsibilities
              : section.title === '자격 요건'
                ? sectionKeywordMap.requiredQualifications
                : section.title === '우대 사항'
                  ? sectionKeywordMap.preferredQualifications
                  : [];

          return (
            <ApplyText
              key={section.title}
              title={section.title}
              items={section.items}
              highlightKeywords={highlightSectionKeywords}
            />
          );
        })}
      </div>
    </section>
  );
}
