import { generateSecret } from './generateSecret';
import { evaluateGuess } from './evaluateGuess';
import { isValidGuess } from './isValidGuess';

export type BaseOption = 2 | 8 | 10 | 16;
export type GameStatus = 'idle' | 'playing' | 'won';

export interface TurnRecord {
  readonly attemptNumber: number;
  readonly guess: string;
  readonly bulls: number;
  readonly cows: number;
  readonly timestamp: number;
}

export interface GameSettings {
  readonly length: number;
  readonly base: BaseOption;
}

export interface GameState {
  readonly settings: GameSettings;
  readonly secret: string;
  readonly status: GameStatus;
  readonly history: readonly TurnRecord[];
  readonly startTime: number | null;
  readonly endTime: number | null;
}

export interface GuessResult {
  readonly state: GameState;
  readonly error?: 'DUPLICATE' | 'INVALID_INPUT' | 'GAME_NOT_IN_PROGRESS';
  readonly isDuplicate?: boolean;
  readonly isWin?: boolean;
}

export const DEFAULT_SETTINGS: GameSettings = {
  length: 4,
  base: 10,
};

export const createInitialState = (settings: Partial<GameSettings> = {}): GameState => {
  const mergedSettings: GameSettings = {
    ...DEFAULT_SETTINGS,
    ...settings,
  };

  const clampedLength = mergedSettings.base === 2 ? 2 : mergedSettings.length;

  return {
    settings: {
      base: mergedSettings.base,
      length: clampedLength,
    },
    secret: '',
    status: 'idle',
    history: [],
    startTime: null,
    endTime: null,
  };
};

export const updateSettings = (state: GameState, newSettings: Partial<GameSettings>): GameState => {
  if (state.status !== 'idle') {
    return state;
  }

  const base = newSettings.base ?? state.settings.base;
  let length = newSettings.length ?? state.settings.length;

  if (base === 2) {
    length = 2;
  } else if (length > base) {
    length = base;
  }

  return {
    ...state,
    settings: {
      base,
      length,
    },
  };
};

export const startGame = (
  state: GameState,
  secretGenerator?: () => string,
  now: () => number = Date.now
): GameState => {
  const secret = secretGenerator
    ? secretGenerator()
    : generateSecret(state.settings.length, state.settings.base);

  return {
    ...state,
    secret,
    status: 'playing',
    history: [],
    startTime: now(),
    endTime: null,
  };
};

export const submitGuess = (
  state: GameState,
  rawGuess: string,
  now: () => number = Date.now
): GuessResult => {
  if (state.status !== 'playing') {
    return { state, error: 'GAME_NOT_IN_PROGRESS' };
  }

  const guess = rawGuess.trim().toLowerCase();

  if (!isValidGuess(guess, state.settings.length, state.settings.base)) {
    return { state, error: 'INVALID_INPUT' };
  }

  const isDuplicate = state.history.some((record) => record.guess.toLowerCase() === guess);

  if (isDuplicate) {
    return { state, error: 'DUPLICATE', isDuplicate: true };
  }

  const evaluation = evaluateGuess(state.secret, guess);
  const currentTime = now();

  const newTurn: TurnRecord = {
    attemptNumber: state.history.length + 1,
    guess,
    bulls: evaluation.bulls,
    cows: evaluation.cows,
    timestamp: currentTime,
  };

  const isWin = evaluation.bulls === state.settings.length;

  const nextState: GameState = {
    ...state,
    history: [...state.history, newTurn],
    status: isWin ? 'won' : 'playing',
    endTime: isWin ? currentTime : null,
  };

  return {
    state: nextState,
    isWin,
  };
};

export const resetGame = (state: GameState): GameState => ({
  ...createInitialState(state.settings),
});
