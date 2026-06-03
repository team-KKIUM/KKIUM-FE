import {
  buildNameCompatibilityRows,
  buildNameCompatibilitySearchParams,
  calculateNameCompatibility,
  getNameCompatibilityResultFromSearchParams,
} from './calculateNameCompatibility';

describe('calculateNameCompatibility', () => {
  test('returns deterministic score between 90 and 100', () => {
    const first = calculateNameCompatibility('홍길동', 'KKIUM');
    const second = calculateNameCompatibility('홍길동', 'KKIUM');

    expect(first).toBe(second);
    expect(first).toBeGreaterThanOrEqual(90);
    expect(first).toBeLessThanOrEqual(100);
  });

  test('changes score when input changes', () => {
    const scoreA = calculateNameCompatibility('홍길동', 'KKIUM');
    const scoreB = calculateNameCompatibility('김철수', 'KKIUM');

    expect(scoreA).not.toBe(scoreB);
  });
});

describe('buildNameCompatibilityRows', () => {
  test('sets last number row to score digits', () => {
    const score = 93;
    const rows = buildNameCompatibilityRows('홍길동', 'KKIUM', score);

    expect(rows.characters.length).toBeGreaterThan(1);
    expect(rows.numberRows.at(-1)).toEqual([9, 3]);
  });
});

describe('buildNameCompatibilitySearchParams', () => {
  test('builds trimmed search params', () => {
    const params = buildNameCompatibilitySearchParams(' 홍길동 ', ' KKIUM ');

    expect(params.get('name')).toBe('홍길동');
    expect(params.get('company')).toBe('KKIUM');
  });
});

describe('getNameCompatibilityResultFromSearchParams', () => {
  test('returns null when required params are missing', () => {
    expect(getNameCompatibilityResultFromSearchParams(new URLSearchParams())).toBeNull();
  });

  test('returns parsed result with score', () => {
    const params = new URLSearchParams({ name: '홍길동', company: 'KKIUM' });
    const result = getNameCompatibilityResultFromSearchParams(params);

    expect(result).toEqual({
      name: '홍길동',
      company: 'KKIUM',
      score: calculateNameCompatibility('홍길동', 'KKIUM'),
    });
  });
});
