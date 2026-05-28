export function sanitizeNumberText(value: string, maxValue: number) {
  const numberText = value.replace(/\D/g, '');

  if (!numberText) {
    return '';
  }

  return String(Math.min(Number(numberText), maxValue));
}
