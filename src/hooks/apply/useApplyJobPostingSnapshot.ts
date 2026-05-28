'use client';

import { useEffect } from 'react';

import { mapJdResumeToJobPostingSnapshot } from '@/app/(pages)/apply/_utils/mapJdResumeToJobPostingSnapshot';
import {
  useApplyJobPostingStore,
  type ApplyJobPostingSnapshot,
} from '@/app/(pages)/apply/_stores/useApplyJobPostingStore';

import { useApplyJobPostingResume } from './useApplyJobPostings';

export function useApplyJobPostingSnapshot(jdId: string | null | undefined) {
  const jobPosting = useApplyJobPostingStore((state) => state.jobPosting);
  const setJobPosting = useApplyJobPostingStore((state) => state.setJobPosting);

  const hasMatchingStore = jdId != null && jobPosting?.jdId === jdId;
  const shouldFetchResume = jdId != null && !hasMatchingStore;

  const resumeQuery = useApplyJobPostingResume(jdId, shouldFetchResume);

  useEffect(() => {
    if (!jdId || !resumeQuery.data || hasMatchingStore) {
      return;
    }

    setJobPosting(mapJdResumeToJobPostingSnapshot(jdId, resumeQuery.data));
  }, [hasMatchingStore, jdId, resumeQuery.data, setJobPosting]);

  if (jdId == null) {
    return {
      jobPosting: null as ApplyJobPostingSnapshot | null,
      isPending: false,
      isError: false,
    };
  }

  if (hasMatchingStore) {
    return {
      jobPosting,
      isPending: false,
      isError: false,
    };
  }

  if (resumeQuery.data) {
    return {
      jobPosting: mapJdResumeToJobPostingSnapshot(jdId, resumeQuery.data),
      isPending: resumeQuery.isPending,
      isError: resumeQuery.isError,
    };
  }

  return {
    jobPosting: null,
    isPending: resumeQuery.isPending,
    isError: resumeQuery.isError,
  };
}
