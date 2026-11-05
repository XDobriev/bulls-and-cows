import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  updateSettings,
  startGame,
  submitGuess,
  resetGame,
  GameState,
} from './gameState';

describe('gameState management', () => {
  it('creates initial state with default settings', () => {
    const state = createInitialState();
    expect(state.settings).toEqual({ length: 4, base: 10 });
    expect(state.status).toBe('idle');
    expect(state.history).toEqual([]);
    expect(state.secret).toBe('');
    expect(state.startTime).toBeNull();
  });

  it('restricts binary base length to 2', () => {
    const state = createInitialState({ base: 2, length: 5 });
    expect(state.settings.length).toBe(2);
  });

  it('updates settings only when game is idle', () => {
    const idleState = createInitialState();
    const updated = updateSettings(idleState, { base: 16, length: 6 });
    expect(updated.settings).toEqual({ base: 16, length: 6 });

    const playingState = startGame(updated, () => '012345');
    const attemptedUpdate = updateSettings(playingState, { length: 3 });
    expect(attemptedUpdate.settings.length).toBe(6);
  });

  it('adjusts length to 2 when base is changed to binary', () => {
    const state = createInitialState({ base: 10, length: 4 });
    const updated = updateSettings(state, { base: 2 });
    expect(updated.settings.base).toBe(2);
    expect(updated.settings.length).toBe(2);
  });

  it('starts a game and initializes secret and start time', () => {
    const state = createInitialState();
    const started = startGame(
      state,
      () => '1234',
      () => 1000
    );

    expect(started.status).toBe('playing');
    expect(started.secret).toBe('1234');
    expect(started.startTime).toBe(1000);
    expect(started.history).toEqual([]);
  });

  it('immutably appends valid guesses to history', () => {
    const initial = startGame(
      createInitialState(),
      () => '1234',
      () => 1000
    );
    const result1 = submitGuess(initial, '1256', () => 1010);

    expect(result1.error).toBeUndefined();
    expect(result1.state.history).toHaveLength(1);
    expect(result1.state.history[0]).toEqual({
      attemptNumber: 1,
      guess: '1256',
      bulls: 2,
      cows: 0,
      timestamp: 1010,
    });
    // Verifies original state remains unmutated
    expect(initial.history).toHaveLength(0);

    const result2 = submitGuess(result1.state, '1324', () => 1020);
    expect(result2.state.history).toHaveLength(2);
    expect(result2.state.history[1].attemptNumber).toBe(2);
    expect(result1.state.history).toHaveLength(1);
  });

  it('rejects duplicate guesses without adding to history', () => {
    const initial = startGame(createInitialState(), () => '1234');
    const result1 = submitGuess(initial, '1256');
    const result2 = submitGuess(result1.state, '1256');

    expect(result2.error).toBe('DUPLICATE');
    expect(result2.isDuplicate).toBe(true);
    expect(result2.state.history).toHaveLength(1);
  });

  it('rejects invalid guesses with error', () => {
    const initial = startGame(createInitialState(), () => '1234');
    const result = submitGuess(initial, '1123'); // duplicate digit

    expect(result.error).toBe('INVALID_INPUT');
    expect(result.state.history).toHaveLength(0);
  });

  it('transitions to won status and sets endTime on correct guess', () => {
    const initial = startGame(
      createInitialState(),
      () => '1234',
      () => 1000
    );
    const result = submitGuess(initial, '1234', () => 2500);

    expect(result.isWin).toBe(true);
    expect(result.state.status).toBe('won');
    expect(result.state.endTime).toBe(2500);
  });

  it('resets game to idle and clears history while keeping settings', () => {
    const initial = startGame(createInitialState({ base: 8, length: 3 }), () => '012');
    const withGuess = submitGuess(initial, '021').state;
    const reset = resetGame(withGuess);

    expect(reset.status).toBe('idle');
    expect(reset.history).toEqual([]);
    expect(reset.secret).toBe('');
    expect(reset.settings).toEqual({ base: 8, length: 3 });
  });
});
