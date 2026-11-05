export interface GuessEvaluation {
  bulls: number;
  cows: number;
}

export const evaluateGuess = (_secret: string, _guess: string): GuessEvaluation => {
  throw new Error('Not implemented');
};
