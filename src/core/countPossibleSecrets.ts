export const memoize = <Args extends readonly unknown[], Return>(
  fn: (...args: Args) => Return
): ((...args: Args) => Return) => {
  const cache = new Map<string, Return>();

  return (...args: Args): Return => {
    const key = args.join(':');
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

const calculatePermutations = (length: number, base: number): number => {
  if (length < 0 || base < 0 || length > base) {
    return 0;
  }
  if (length === 0) {
    return 1;
  }
  return base * countPossibleSecrets(length - 1, base - 1);
};

export const countPossibleSecrets = memoize(calculatePermutations);
