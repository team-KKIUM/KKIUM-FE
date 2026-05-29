export const EXPERIENCE_FIELD_MAX_LENGTHS = {
  title: 80,
  description: 100,
  oneLineIntro: 100,
  company: 50,
  employmentStatus: 50,
  organizationName: 50,
  role: 50,
  name: 80,
} as const;

type ExperienceFieldLimitKey = keyof typeof EXPERIENCE_FIELD_MAX_LENGTHS;

export function getExperienceFieldMaxLength(fieldName: string): number | undefined {
  return EXPERIENCE_FIELD_MAX_LENGTHS[fieldName as ExperienceFieldLimitKey];
}

export function limitExperienceFieldText(fieldName: string, value: string) {
  const maxLength = getExperienceFieldMaxLength(fieldName);

  if (!maxLength) {
    return value;
  }

  return value.slice(0, maxLength);
}
