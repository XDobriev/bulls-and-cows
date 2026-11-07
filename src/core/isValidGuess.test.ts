import { describe, it, expect } from 'vitest';
import { isValidGuess } from './isValidGuess';

describe('isValidGuess', () => {
  it('returns true for a valid decimal guess with unique digits', () => {
    expect(isValidGuess('1234', 4, 10)).toBe(true);
    expect(isValidGuess('0123', 4, 10)).toBe(true);
  });

  it('returns true for a valid binary guess', () => {
    expect(isValidGuess('01', 2, 2)).toBe(true);
    expect(isValidGuess('10', 2, 2)).toBe(true);
  });

  it('returns true for a valid hexadecimal guess with mixed casing', () => {
    expect(isValidGuess('1aB3', 4, 16)).toBe(true);
    expect(isValidGuess('0fEd', 4, 16)).toBe(true);
  });

  it('returns false when guess length does not match requested length', () => {
    expect(isValidGuess('123', 4, 10)).toBe(false);
    expect(isValidGuess('12345', 4, 10)).toBe(false);
    expect(isValidGuess('', 4, 10)).toBe(false);
  });

  it('returns false when guess contains duplicate digits', () => {
    expect(isValidGuess('1123', 4, 10)).toBe(false);
    expect(isValidGuess('00', 2, 2)).toBe(false);
    expect(isValidGuess('11', 2, 2)).toBe(false);
  });

  it('returns false when hex guess contains duplicate digits in different case', () => {
    expect(isValidGuess('1aA2', 4, 16)).toBe(false);
    expect(isValidGuess('Ff12', 4, 16)).toBe(false);
  });

  it('returns false when guess contains invalid characters for the base', () => {
    expect(isValidGuess('1284', 4, 8)).toBe(false); // 8 is invalid in octal
    expect(isValidGuess('012', 3, 2)).toBe(false); // 2 is invalid in binary
    expect(isValidGuess('123g', 4, 16)).toBe(false); // g is invalid in hex
    expect(isValidGuess('12-4', 4, 10)).toBe(false);
  });
});
