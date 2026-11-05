import { describe, it, expect } from 'vitest';
import { evaluateGuess } from './evaluateGuess';

describe('evaluateGuess', () => {
  it('returns all bulls and zero cows when guess exactly matches secret', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  it('returns all cows and zero bulls when all digits are present but in wrong positions', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  it('correctly calculates mixed bulls and cows', () => {
    // 1 is bull, 2 and 3 are cows, 5 is neither
    expect(evaluateGuess('1234', '1325')).toEqual({ bulls: 1, cows: 2 });
  });

  it('returns zero bulls and zero cows when no characters match', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  it('treats hexadecimal characters as case-insensitive', () => {
    expect(evaluateGuess('1a2f', '1A2F')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('1a2b', 'B2A1')).toEqual({ bulls: 0, cows: 4 });
    expect(evaluateGuess('1A2B', '1a2b')).toEqual({ bulls: 4, cows: 0 });
  });

  it('handles secrets with leading zeros correctly', () => {
    expect(evaluateGuess('0123', '0213')).toEqual({ bulls: 2, cows: 2 });
  });

  it('evaluates binary secrets correctly', () => {
    expect(evaluateGuess('01', '10')).toEqual({ bulls: 0, cows: 2 });
    expect(evaluateGuess('10', '10')).toEqual({ bulls: 2, cows: 0 });
  });

  it('evaluates octal secrets correctly', () => {
    expect(evaluateGuess('0765', '7065')).toEqual({ bulls: 2, cows: 2 });
  });
});
