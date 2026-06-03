import {
  DEFAULT_HOME_JOB_TYPE_PROFILE,
  mapJobTypeNameToProfile,
} from './jobTypeCardMappingData';

describe('mapJobTypeNameToProfile', () => {
  test('returns default profile when type name is empty', () => {
    expect(mapJobTypeNameToProfile(undefined)).toBe(DEFAULT_HOME_JOB_TYPE_PROFILE);
    expect(mapJobTypeNameToProfile('')).toBe(DEFAULT_HOME_JOB_TYPE_PROFILE);
  });

  test('returns mapped profile for known type name', () => {
    expect(mapJobTypeNameToProfile('정밀 분석가').roleTypeName).toBe('정밀 분석가');
  });

  test('falls back to default profile for unknown type name', () => {
    expect(mapJobTypeNameToProfile('알 수 없는 유형')).toBe(DEFAULT_HOME_JOB_TYPE_PROFILE);
  });
});
