export interface GuessEvaluation {
  bulls: number;
  cows: number;
}

export const evaluateGuess = (secret: string, guess: string): GuessEvaluation => {
  const normalizedSecret = Array.from(secret.toLowerCase());
  const normalizedGuess = Array.from(guess.toLowerCase());

  const bulls = normalizedGuess.filter((char, index) => char === normalizedSecret[index]).length;

  const cows = normalizedGuess.filter(
    (char, index) => char !== normalizedSecret[index] && normalizedSecret.includes(char)
  ).length;

  return { bulls, cows };
};
