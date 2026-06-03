/**
 * @jest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react';

import { EXPERIENCE_ADD_STEPS } from '@/app/(pages)/experience/add/_constants/experienceAddSteps';

import { useExperienceAddStep } from './useExperienceAddStep';

describe('useExperienceAddStep', () => {
  beforeEach(() => {
    jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('starts at upload step with initial flags', () => {
    const { result } = renderHook(() => useExperienceAddStep());

    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isBasicInfoStep).toBe(false);
    expect(result.current.isCoreInfoStep).toBe(false);
    expect(result.current.isResultStep).toBe(false);
    expect(result.current.isCompleteStep).toBe(false);
  });

  test('moves to next steps and updates derived flags', () => {
    const { result } = renderHook(() => useExperienceAddStep());

    act(() => {
      result.current.goNextStep();
    });

    expect(result.current.currentStepIndex).toBe(1);
    expect(result.current.isBasicInfoStep).toBe(true);

    act(() => {
      result.current.goNextStep();
    });

    expect(result.current.currentStepIndex).toBe(2);
    expect(result.current.isCoreInfoStep).toBe(true);

    act(() => {
      result.current.goNextStep();
    });

    expect(result.current.currentStepIndex).toBe(EXPERIENCE_ADD_STEPS.length - 1);
    expect(result.current.isResultStep).toBe(true);

    act(() => {
      result.current.goNextStep();
    });

    expect(result.current.currentStepIndex).toBe(EXPERIENCE_ADD_STEPS.length);
    expect(result.current.isCompleteStep).toBe(true);
  });

  test('does not move past first or complete step', () => {
    const { result } = renderHook(() => useExperienceAddStep());

    act(() => {
      result.current.goPreviousStep();
    });

    expect(result.current.currentStepIndex).toBe(0);

    act(() => {
      for (let index = 0; index < EXPERIENCE_ADD_STEPS.length + 3; index += 1) {
        result.current.goNextStep();
      }
    });

    expect(result.current.currentStepIndex).toBe(EXPERIENCE_ADD_STEPS.length);

    act(() => {
      result.current.goPreviousStep();
    });

    expect(result.current.currentStepIndex).toBe(EXPERIENCE_ADD_STEPS.length - 1);
  });

  test('scrolls to top when step changes', () => {
    const { result } = renderHook(() => useExperienceAddStep());

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });

    act(() => {
      result.current.goNextStep();
    });

    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'auto' });
  });
});
