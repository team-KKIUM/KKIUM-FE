/**
 * @jest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react';

import type { ExperienceAnalyzeResponse } from '@/app/api/experience/add/types';
import {
  createEmptyBasicInfoForm,
  createEmptyCoreInfoForm,
  createEmptyResultInfoForm,
} from '@/app/(pages)/experience/add/_types/experienceAddForm';

import { useExperienceAddForm } from './useExperienceAddForm';

function createAnalyzeResponse(
  override: Partial<ExperienceAnalyzeResponse> = {},
): ExperienceAnalyzeResponse {
  return {
    title: '분석된 경험',
    oneLineIntro: '분석된 한 줄 소개',
    activityInfo: {
      name: '프로젝트',
      teamNum: 4,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      contributionRate: 70,
      role: '프론트엔드',
    },
    careerInfo: null,
    educationInfo: null,
    situation: '상황',
    task: '과제',
    act: '행동',
    result: '결과',
    taken: '배운 점',
    tags: [
      { category: 'TECH', field: 'React' },
      { category: 'COMPETENCY', field: '협업' },
    ],
    ...override,
  };
}

describe('useExperienceAddForm', () => {
  test('starts with empty form state', () => {
    const { result } = renderHook(() => useExperienceAddForm());

    expect(result.current.basicInfo).toEqual(createEmptyBasicInfoForm());
    expect(result.current.coreInfo).toEqual(createEmptyCoreInfoForm());
    expect(result.current.resultInfo).toEqual(createEmptyResultInfoForm());
  });

  test('updates individual form states through setters', () => {
    const { result } = renderHook(() => useExperienceAddForm());

    act(() => {
      result.current.setBasicInfo({
        ...createEmptyBasicInfoForm(),
        type: 'career',
        title: '인턴 경험',
      });
      result.current.setCoreInfo({
        ...createEmptyCoreInfoForm(),
        situation: '매출 지표 개선 필요',
      });
      result.current.setResultInfo({
        skillTags: ['Spring'],
        competencyTags: ['문제 해결'],
      });
    });

    expect(result.current.basicInfo).toMatchObject({
      type: 'career',
      title: '인턴 경험',
    });
    expect(result.current.coreInfo.situation).toBe('매출 지표 개선 필요');
    expect(result.current.resultInfo).toEqual({
      skillTags: ['Spring'],
      competencyTags: ['문제 해결'],
    });
  });

  test('applies analyze response to all form sections', () => {
    const { result } = renderHook(() => useExperienceAddForm());

    act(() => {
      result.current.applyAnalyzeResponse(createAnalyzeResponse());
    });

    expect(result.current.basicInfo).toMatchObject({
      type: 'activity',
      title: '분석된 경험',
      oneLineIntro: '분석된 한 줄 소개',
      teamNum: '4',
      role: '프론트엔드',
      contributionRate: '70',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
    expect(result.current.coreInfo).toEqual({
      situation: '상황',
      task: '과제',
      act: '행동',
      result: '결과',
      taken: '배운 점',
    });
    expect(result.current.resultInfo).toEqual({
      skillTags: ['React'],
      competencyTags: ['협업'],
    });
  });

  test('resets all form sections to empty state', () => {
    const { result } = renderHook(() => useExperienceAddForm());

    act(() => {
      result.current.applyAnalyzeResponse(createAnalyzeResponse());
      result.current.resetForm();
    });

    expect(result.current.basicInfo).toEqual(createEmptyBasicInfoForm());
    expect(result.current.coreInfo).toEqual(createEmptyCoreInfoForm());
    expect(result.current.resultInfo).toEqual(createEmptyResultInfoForm());
  });
});
