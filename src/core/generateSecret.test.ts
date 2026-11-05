import { describe, it, expect } from 'vitest';
import { generateSecret } from './generateSecret';

describe('generateSecret', () => {
  it('generates a secret of the requested length', () => {
    const secret = generateSecret(4, 10, () => 0.5);
    expect(secret).toHaveLength(4);
  });

  it('contains only unique digits from the specified base', () => {
    const secret = generateSecret(6, 16);
    expect(secret).toHaveLength(6);
    const uniqueDigits = new Set(secret);
    expect(uniqueDigits.size).toBe(6);
    expect(secret).toMatch(/^[0-9a-f]{6}$/);
  });

  it('allows leading zero in generated secret', () => {
    const customRandom = () => 0;
    const secret = generateSecret(4, 10, customRandom);
    expect(secret.startsWith('0')).toBe(true);
  });

  it('is deterministic when custom random generator is provided', () => {
    const values = [0.1, 0.4, 0.8, 0.2];
    let i = 0;
    const mockRandom = () => values[i++ % values.length];

    const secret1 = generateSecret(4, 10, mockRandom);
    i = 0;
    const secret2 = generateSecret(4, 10, mockRandom);

    expect(secret1).toBe(secret2);
  });

  it('generates valid secret for binary base with length 2', () => {
    const secret = generateSecret(2, 2);
    expect(secret).toHaveLength(2);
    expect(secret).toMatch(/^[01]{2}$/);
    expect(secret[0]).not.toBe(secret[1]);
  });

  it('generates valid secret for octal base', () => {
    const secret = generateSecret(5, 8);
    expect(secret).toHaveLength(5);
    expect(secret).toMatch(/^[0-7]{5}$/);
    expect(new Set(secret).size).toBe(5);
  });

  it('throws an error if length exceeds the base alphabet size', () => {
    expect(() => generateSecret(3, 2)).toThrow();
    expect(() => generateSecret(7, 6)).toThrow();
  });

  it('throws an error if length is less than or equal to 0', () => {
    expect(() => generateSecret(0, 10)).toThrow();
    expect(() => generateSecret(-1, 10)).toThrow();
  });

  it('throws an error if base is invalid', () => {
    expect(() => generateSecret(2, 1)).toThrow();
    expect(() => generateSecret(2, 17)).toThrow();
  });

  it('safely handles boundary RNG return values (1.0 or negative)', () => {
    const secretMax = generateSecret(4, 10, () => 1.0);
    expect(secretMax).toHaveLength(4);
    expect(new Set(secretMax).size).toBe(4);

    const secretMin = generateSecret(4, 10, () => -0.5);
    expect(secretMin).toHaveLength(4);
    expect(new Set(secretMin).size).toBe(4);
  });
});
