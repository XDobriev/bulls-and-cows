import { createDigitValidator } from './createDigitValidator';

export const isValidGuess = (guess: string, length: number, base: number): boolean => {
  if (guess.length !== length || length <= 0) {
    return false;
  }

  const isDigitValid = createDigitValidator(base);
  const normalizedChars = Array.from(guess.toLowerCase());

  const allDigitsValid = normalizedChars.every(isDigitValid);
  if (!allDigitsValid) {
    return false;
  }

  const uniqueDigits = new Set(normalizedChars);
  return uniqueDigits.size === length;
};
