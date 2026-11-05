import {
  GameState,
  createInitialState,
  updateSettings,
  startGame,
  submitGuess,
  resetGame,
  GameSettings,
} from '../core/gameState';
import { ScoreEntry, loadLeaderboard, saveLeaderboard, addScore } from '../core/leaderboard';
import { el, clearElement } from './domUtils';
import { createSettingsView } from './components/settingsView';
import { createGameView } from './components/gameView';
import { createHistoryView } from './components/historyView';
import { createLeaderboardView } from './components/leaderboardView';
import { createVictoryModal } from './components/victoryModal';

export const initApp = (container: HTMLElement): void => {
  let state: GameState = createInitialState();
  let scores: readonly ScoreEntry[] = loadLeaderboard();
  let errorMessage: string | null = null;
  let timerId: number | null = null;
  let elapsedMs = 0;
  let modalElement: HTMLElement | null = null;

  // Root layout elements
  const appContainer = el('div', { className: 'app-container' });

  // 1. Header
  const header = el('header', { className: 'app-header' });
  header.appendChild(el('h1', { className: 'app-title', text: '🐂 Быки и Коровы 🐄' }));
  header.appendChild(
    el('p', {
      className: 'app-subtitle',
      text: 'Классическая логическая игра на угадывание секретного числа с поддержкой различных систем счисления.',
    })
  );
  appContainer.appendChild(header);

  // 2. Main content 2-column layout
  const layout = el('main', { className: 'app-layout' });

  const leftColumn = el('div', {
    attributes: { style: 'display: flex; flex-direction: column; gap: 1.5rem;' },
  });
  const rightColumn = el('div', {
    attributes: { style: 'display: flex; flex-direction: column; gap: 1.5rem;' },
  });

  layout.appendChild(leftColumn);
  layout.appendChild(rightColumn);
  appContainer.appendChild(layout);

  // 3. Footer
  const footer = el('footer', { className: 'app-footer' });
  const footerText = el('p', {
    children: [
      'RS School · ',
      el('a', {
        text: 'Bulls and Cows',
        attributes: {
          href: 'https://github.com/rolling-scopes-school/tasks/blob/master/fullstack-engineering/tasks/bulls-and-cows/README.md',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
  });
  footer.appendChild(footerText);
  appContainer.appendChild(footer);

  container.appendChild(appContainer);

  const startTimer = (): void => {
    stopTimer();
    elapsedMs = 0;
    const startTime = Date.now();
    timerId = window.setInterval(() => {
      elapsedMs = Date.now() - startTime;
      render();
    }, 1000);
  };

  const stopTimer = (): void => {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  const handleUpdateSettings = (newSettings: Partial<GameSettings>): void => {
    state = updateSettings(state, newSettings);
    errorMessage = null;
    render();
  };

  const handleStartGame = (): void => {
    state = startGame(state);
    errorMessage = null;
    startTimer();
    render();
  };

  const handleGuessSubmit = (guess: string): void => {
    const result = submitGuess(state, guess);

    if (result.error === 'DUPLICATE') {
      errorMessage = '⚠️ Эта комбинация уже проверялась ранее!';
      render();
      return;
    }

    if (result.error === 'INVALID_INPUT') {
      errorMessage = `Введите ровно ${state.settings.length} уникальных символов системы ${state.settings.base}.`;
      render();
      return;
    }

    errorMessage = null;
    state = result.state;

    if (result.isWin) {
      stopTimer();
      const finalDuration =
        state.startTime && state.endTime ? state.endTime - state.startTime : elapsedMs;
      showVictory(state.secret, state.history.length, finalDuration);
    }

    render();
  };

  const handleNewGame = (): void => {
    stopTimer();
    closeVictory();
    state = resetGame(state);
    elapsedMs = 0;
    errorMessage = null;
    render();
  };

  const handleSaveScore = (playerName: string): void => {
    const duration = state.startTime && state.endTime ? state.endTime - state.startTime : elapsedMs;

    const newScore: ScoreEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      playerName,
      attempts: state.history.length,
      durationMs: duration,
      length: state.settings.length,
      base: state.settings.base,
      date: new Date().toISOString(),
    };

    scores = addScore(scores, newScore);
    saveLeaderboard(scores);
    render();
  };

  const handleClearScores = (): void => {
    scores = [];
    saveLeaderboard(scores);
    render();
  };

  const showVictory = (secret: string, attempts: number, durationMs: number): void => {
    closeVictory();
    modalElement = createVictoryModal({
      secret,
      attempts,
      durationMs,
      onSaveScore: handleSaveScore,
      onPlayAgain: handleNewGame,
    });
    document.body.appendChild(modalElement);
  };

  const closeVictory = (): void => {
    if (modalElement && modalElement.parentNode) {
      modalElement.parentNode.removeChild(modalElement);
      modalElement = null;
    }
  };

  const render = (): void => {
    // Left column
    clearElement(leftColumn);
    leftColumn.appendChild(
      createSettingsView({
        settings: state.settings,
        status: state.status,
        onUpdateSettings: handleUpdateSettings,
        onStartGame: handleStartGame,
      })
    );
    leftColumn.appendChild(
      createGameView({
        state,
        elapsedMs,
        errorMessage,
        onGuessSubmit: handleGuessSubmit,
        onNewGame: handleNewGame,
      })
    );

    // Right column
    clearElement(rightColumn);
    rightColumn.appendChild(
      createHistoryView({
        history: state.history,
      })
    );
    rightColumn.appendChild(
      createLeaderboardView({
        scores,
        onClear: handleClearScores,
      })
    );
  };

  render();
};
