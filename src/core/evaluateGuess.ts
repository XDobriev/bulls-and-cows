export interface GuessEvaluation {
  bulls: number;
  cows: number;
}

export const evaluateGuess = (secret: string, guess: string): GuessEvaluation => {
  const normalizedSecret = Array.from(secret.toLowerCase());
  const normalizedGuess = Array.from(guess.toLowerCase());

  const bulls = normalizedGuess.filter((char, index) => char === normalizedSecret[index]).length;

  const unmatchedSecret = normalizedSecret.filter((char, index) => char !== normalizedGuess[index]);
  const unmatchedGuess = normalizedGuess.filter((char, index) => char !== normalizedSecret[index]);

  const cows = unmatchedGuess.reduce<{ remaining: string[]; count: number }>(
    (acc, char) => {
      const charIndex = acc.remaining.indexOf(char);
      if (charIndex !== -1) {
        return {
          remaining: acc.remaining.filter((_, i) => i !== charIndex),
          count: acc.count + 1,
        };
      }
      return acc;
    },
    { remaining: unmatchedSecret, count: 0 }
  ).count;

  return { bulls, cows };
};
