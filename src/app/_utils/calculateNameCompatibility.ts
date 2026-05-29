const MIN_COMPATIBILITY_SCORE = 90;
const COMPATIBILITY_SCORE_RANGE = 11;
const MAX_ANIMATION_CHARACTER_COUNT = 8;

export type NameCompatibilityRows = {
  characters: string[];
  numberRows: number[][];
};

export type NameCompatibilityResult = {
  name: string;
  company: string;
  score: number;
};

export function calculateNameCompatibility(name: string, company: string) {
  const normalizedName = name.trim();
  const normalizedCompany = company.trim();
  const source = `${normalizedName}:${normalizedCompany}`;
  let hash = 0;

  for (const character of source) {
    const codePoint = character.codePointAt(0) ?? 0;
    hash = (hash * 31 + codePoint) >>> 0;
  }

  return MIN_COMPATIBILITY_SCORE + (hash % COMPATIBILITY_SCORE_RANGE);
}

export function buildNameCompatibilityRows(
  name: string,
  company: string,
  score: number,
): NameCompatibilityRows {
  const characters = getInterleavedCharacters(name, company);
  const firstNumberRow = characters.slice(0, -1).map((character, index) => {
    const nextCharacter = characters[index + 1];

    return (getCharacterDigit(character) + getCharacterDigit(nextCharacter)) % 10;
  });
  const numberRows = buildReducedNumberRows(firstNumberRow);

  numberRows[numberRows.length - 1] = getScoreDigits(score);

  return {
    characters,
    numberRows,
  };
}

export function buildNameCompatibilitySearchParams(name: string, company: string) {
  const params = new URLSearchParams();

  params.set('name', name.trim());
  params.set('company', company.trim());

  return params;
}

export function getNameCompatibilityResultFromSearchParams(
  searchParams: URLSearchParams,
): NameCompatibilityResult | null {
  const name = searchParams.get('name')?.trim() ?? '';
  const company = searchParams.get('company')?.trim() ?? '';

  if (!name || !company) {
    return null;
  }

  return {
    name,
    company,
    score: calculateNameCompatibility(name, company),
  };
}

function getInterleavedCharacters(name: string, company: string) {
  const nameCharacters = Array.from(name.trim());
  const companyCharacters = Array.from(company.trim());
  const maxLength = Math.max(nameCharacters.length, companyCharacters.length);
  const characters: string[] = [];

  for (let index = 0; index < maxLength; index += 1) {
    const nameCharacter = nameCharacters[index];
    const companyCharacter = companyCharacters[index];

    if (nameCharacter) {
      characters.push(nameCharacter);
    }

    if (companyCharacter) {
      characters.push(companyCharacter);
    }
  }

  const displayCharacters = characters.slice(0, MAX_ANIMATION_CHARACTER_COUNT);

  return displayCharacters.length > 1 ? displayCharacters : [...displayCharacters, 'K'];
}

function getCharacterDigit(character: string) {
  return (character.codePointAt(0) ?? 0) % 10;
}

function buildReducedNumberRows(firstNumberRow: number[]) {
  const rows = [firstNumberRow.length > 0 ? firstNumberRow : [0, 0]];

  while (rows.at(-1)!.length > 2) {
    const previousRow = rows.at(-1)!;
    const nextRow = previousRow.slice(0, -1).map((number, index) => {
      return (number + previousRow[index + 1]) % 10;
    });

    rows.push(nextRow);
  }

  return rows;
}

function getScoreDigits(score: number) {
  return String(score).split('').map(Number);
}
