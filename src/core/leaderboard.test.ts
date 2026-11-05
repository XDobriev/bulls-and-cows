import { describe, it, expect } from 'vitest';
import {
  sortScores,
  addScore,
  formatDuration,
  loadLeaderboard,
  saveLeaderboard,
  ScoreEntry,
} from './leaderboard';

describe('leaderboard', () => {
  const sampleScores: ScoreEntry[] = [
    {
      id: '1',
      playerName: 'Alice',
      attempts: 5,
      durationMs: 45000,
      length: 4,
      base: 10,
      date: '2026-03-01T10:00:00.000Z',
    },
    {
      id: '2',
      playerName: 'Bob',
      attempts: 3,
      durationMs: 60000,
      length: 4,
      base: 10,
      date: '2026-03-01T11:00:00.000Z',
    },
    {
      id: '3',
      playerName: 'Charlie',
      attempts: 3,
      durationMs: 30000,
      length: 4,
      base: 10,
      date: '2026-03-01T12:00:00.000Z',
    },
  ];

  it('sorts scores primarily by attempts ascending, secondarily by duration ascending', () => {
    const sorted = sortScores(sampleScores);
    expect(sorted.map((s) => s.id)).toEqual(['3', '2', '1']);
  });

  it('adds a score immutably and truncates to max items', () => {
    const newEntry: ScoreEntry = {
      id: '4',
      playerName: 'Dave',
      attempts: 2,
      durationMs: 20000,
      length: 4,
      base: 10,
      date: '2026-03-01T13:00:00.000Z',
    };

    const updated = addScore(sampleScores, newEntry, 2);
    expect(updated).toHaveLength(2);
    expect(updated[0].playerName).toBe('Dave');
    expect(updated[1].playerName).toBe('Charlie');
    expect(sampleScores).toHaveLength(3);
  });

  it('formats duration in mm:ss format', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(9000)).toBe('00:09');
    expect(formatDuration(65000)).toBe('01:05');
    expect(formatDuration(600000)).toBe('10:00');
  });

  it('saves and loads leaderboard from storage mock', () => {
    const mockStorageMap = new Map<string, string>();
    const mockStorage = {
      getItem: (key: string) => mockStorageMap.get(key) ?? null,
      setItem: (key: string, val: string) => {
        mockStorageMap.set(key, val);
      },
      removeItem: (key: string) => {
        mockStorageMap.delete(key);
      },
      clear: () => {
        mockStorageMap.clear();
      },
      key: () => null,
      length: 0,
    } as unknown as Storage;

    saveLeaderboard(sampleScores, 'test_key', mockStorage);
    const loaded = loadLeaderboard('test_key', mockStorage);
    expect(loaded).toHaveLength(3);
    expect(loaded[0].playerName).toBe('Charlie');
  });

  it('safely handles corrupted storage data or throwing storage', () => {
    const corruptStorage = {
      getItem: () => '{"invalid": json',
      setItem: () => {},
    } as unknown as Storage;
    expect(loadLeaderboard('corrupt', corruptStorage)).toEqual([]);

    const malformedStorage = {
      getItem: () => JSON.stringify([{ attempts: 'not a number' }, null, { attempts: 1 }]),
      setItem: () => {},
    } as unknown as Storage;
    expect(loadLeaderboard('malformed', malformedStorage)).toEqual([]);

    const throwingStorage = {
      getItem: () => {
        throw new Error('Access denied');
      },
      setItem: () => {
        throw new Error('Quota exceeded');
      },
    } as unknown as Storage;

    expect(loadLeaderboard('key', throwingStorage)).toEqual([]);
    expect(() => saveLeaderboard(sampleScores, 'key', throwingStorage)).not.toThrow();
  });
});
