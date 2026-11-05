export interface ScoreEntry {
  readonly id: string;
  readonly playerName: string;
  readonly attempts: number;
  readonly durationMs: number;
  readonly length: number;
  readonly base: number;
  readonly date: string;
}

export const STORAGE_KEY = 'bulls_and_cows_leaderboard_v1';

export const sortScores = (scores: readonly ScoreEntry[]): readonly ScoreEntry[] => {
  return [...scores].sort((a, b) => {
    if (a.attempts !== b.attempts) {
      return a.attempts - b.attempts;
    }
    if (a.durationMs !== b.durationMs) {
      return a.durationMs - b.durationMs;
    }
    return b.date.localeCompare(a.date);
  });
};

export const addScore = (
  scores: readonly ScoreEntry[],
  newEntry: ScoreEntry,
  maxItems = 10
): readonly ScoreEntry[] => {
  const updated = [...scores, newEntry];
  return sortScores(updated).slice(0, maxItems);
};

export const loadLeaderboard = (
  storageKey = STORAGE_KEY,
  storage: Storage | null = typeof window !== 'undefined' && window.localStorage
    ? window.localStorage
    : null
): readonly ScoreEntry[] => {
  if (!storage) {
    return [];
  }
  try {
    const raw = storage.getItem(storageKey);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return sortScores(parsed);
  } catch {
    return [];
  }
};

export const saveLeaderboard = (
  scores: readonly ScoreEntry[],
  storageKey = STORAGE_KEY,
  storage: Storage | null = typeof window !== 'undefined' && window.localStorage
    ? window.localStorage
    : null
): void => {
  if (!storage) {
    return;
  }
  try {
    storage.setItem(storageKey, JSON.stringify(scores));
  } catch {
    // Graceful fallback for storage quota errors or private browsing
  }
};

export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${paddedMinutes}:${paddedSeconds}`;
};
