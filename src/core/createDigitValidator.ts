const ALPHABET = '0123456789abcdef';

export const createDigitValidator = (base: number): ((char: string) => boolean) => {
  if (base < 2 || base > 16) {
    throw new Error(`Invalid base ${base}. Base must be between 2 and 16.`);
  }

  const validDigits = new Set(Array.from(ALPHABET.slice(0, base)));

  return (char: string): boolean => {
    if (char.length !== 1) {
      return false;
    }
    return validDigits.has(char.toLowerCase());
  };
};
