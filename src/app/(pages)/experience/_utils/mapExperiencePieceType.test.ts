import {
  mapExperiencePieceTypeToCategory,
  normalizeExperiencePieceType,
} from './mapExperiencePieceType';

describe('normalizeExperiencePieceType', () => {
  test('normalizes known piece types', () => {
    expect(normalizeExperiencePieceType('ACTIVITY')).toBe('ACTIVITY');
    expect(normalizeExperiencePieceType('CAREER')).toBe('CAREER');
    expect(normalizeExperiencePieceType('EDUCATION')).toBe('EDUCATION');
    expect(normalizeExperiencePieceType('ETC')).toBe('ETC');
  });

  test('trims and uppercases string values', () => {
    expect(normalizeExperiencePieceType(' activity ')).toBe('ACTIVITY');
    expect(normalizeExperiencePieceType('career')).toBe('CAREER');
  });

  test('returns undefined for unsupported values', () => {
    expect(normalizeExperiencePieceType('ALL')).toBeUndefined();
    expect(normalizeExperiencePieceType('UNKNOWN')).toBeUndefined();
    expect(normalizeExperiencePieceType('')).toBeUndefined();
    expect(normalizeExperiencePieceType(null)).toBeUndefined();
    expect(normalizeExperiencePieceType(1)).toBeUndefined();
  });
});

describe('mapExperiencePieceTypeToCategory', () => {
  test('maps backend piece types to UI categories', () => {
    expect(mapExperiencePieceTypeToCategory('ACTIVITY')).toBe('activity');
    expect(mapExperiencePieceTypeToCategory('CAREER')).toBe('career');
    expect(mapExperiencePieceTypeToCategory('EDUCATION')).toBe('education');
    expect(mapExperiencePieceTypeToCategory('ETC')).toBe('etc');
  });

  test('uses fallback for unsupported values', () => {
    expect(mapExperiencePieceTypeToCategory('ALL')).toBe('etc');
    expect(mapExperiencePieceTypeToCategory('UNKNOWN', 'career')).toBe('career');
    expect(mapExperiencePieceTypeToCategory(undefined, 'activity')).toBe('activity');
  });
});
