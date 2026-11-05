const ALPHABET = '0123456789abcdef';

const pickDigits = (
  needed: number,
  available: readonly string[],
  rng: () => number
): readonly string[] => {
  if (needed === 0 || available.length === 0) {
    return [];
  }
  const rand = Math.max(0, Math.min(0.999999999999999, rng()));
  const index = Math.floor(rand * available.length);
  const chosen = available[index];
  const nextAvailable = available.filter((_, i) => i !== index);
  return [chosen, ...pickDigits(needed - 1, nextAvailable, rng)];
};

export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random
): string => {
  if (base < 2 || base > 16) {
    throw new Error(`Invalid base ${base}. Base must be between 2 and 16.`);
  }
  if (length <= 0 || length > base) {
    throw new Error(`Invalid length ${length}. Length must be between 1 and ${base}.`);
  }

  const availableDigits = Array.from(ALPHABET.slice(0, base));
  return pickDigits(length, availableDigits, random).join('');
};
