import { describe, it, expect } from 'vitest';
import { countPossibleSecrets } from './countPossibleSecrets';

describe('countPossibleSecrets', () => {
  it('calculates permutations for base 2 and length 2', () => {
    // 2 * 1 = 2 (01, 10)
    expect(countPossibleSecrets(2, 2)).toBe(2);
  });

  it('calculates permutations for decimal base and length 4', () => {
    // 10 * 9 * 8 * 7 = 5040
    expect(countPossibleSecrets(4, 10)).toBe(5040);
  });

  it('calculates permutations for octal base and length 3', () => {
    // 8 * 7 * 6 = 336
    expect(countPossibleSecrets(3, 8)).toBe(336);
  });

  it('calculates permutations for hexadecimal base and length 4', () => {
    // 16 * 15 * 14 * 13 = 43680
    expect(countPossibleSecrets(4, 16)).toBe(43680);
  });

  it('returns 1 when length is 0 (empty permutation)', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
    expect(countPossibleSecrets(0, 2)).toBe(1);
  });

  it('returns 0 when length exceeds base', () => {
    expect(countPossibleSecrets(3, 2)).toBe(0);
    expect(countPossibleSecrets(11, 10)).toBe(0);
  });

  it('returns 0 for negative values', () => {
    expect(countPossibleSecrets(-1, 10)).toBe(0);
    expect(countPossibleSecrets(4, -1)).toBe(0);
  });

  it('returns consistent memoized results on repeated calls', () => {
    const firstCall = countPossibleSecrets(5, 16);
    const secondCall = countPossibleSecrets(5, 16);
    expect(firstCall).toBe(524160);
    expect(firstCall).toBe(secondCall);
  });
});
