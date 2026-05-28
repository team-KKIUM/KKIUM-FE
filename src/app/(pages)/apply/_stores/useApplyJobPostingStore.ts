'use client';

import { create } from 'zustand';

export type ApplyJobPostingSnapshot = {
  jdId: string;
  title: string;
  companyName: string;
  jobField: string;
  period: string;
};

type ApplyJobPostingState = {
  jobPosting: ApplyJobPostingSnapshot | null;
  setJobPosting: (jobPosting: ApplyJobPostingSnapshot) => void;
  clearJobPosting: () => void;
};

export const useApplyJobPostingStore = create<ApplyJobPostingState>((set) => ({
  jobPosting: null,
  setJobPosting: (jobPosting) => set({ jobPosting }),
  clearJobPosting: () => set({ jobPosting: null }),
}));
