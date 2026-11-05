import { GameState } from '../../core/gameState';
import { createDigitValidator } from '../../core/createDigitValidator';
import { formatDuration } from '../../core/leaderboard';
import { el } from '../domUtils';

interface GameViewProps {
  state: GameState;
  elapsedMs: number;
  errorMessage: string | null;
  onGuessSubmit: (guess: string) => void;
  onNewGame: () => void;
}

export const createGameView = ({
  state,
  elapsedMs,
  errorMessage,
  onGuessSubmit,
  onNewGame,
}: GameViewProps): HTMLElement => {
  const card = el('div', { className: 'card game-card' });

  // Title
  const title = el('h2', {
    className: 'card-title',
    text: '🎯 Игровое поле',
  });
  card.appendChild(title);

  const isPlaying = state.status === 'playing';

  // Status Bar
  const statusBar = el('div', { className: 'game-status-bar' });

  const modeBadge = el('span', {
    className: 'status-badge',
    text: `БАЗА: ${state.settings.base} · ДЛИНА: ${state.settings.length}`,
  });
  statusBar.appendChild(modeBadge);

  const attemptsCounter = el('span', {
    className: 'timer-display',
    text: `Попыток: ${state.history.length}`,
  });
  statusBar.appendChild(attemptsCounter);

  const timerBadge = el('span', {
    className: 'timer-display',
    text: `⏱️ ${formatDuration(elapsedMs)}`,
  });
  statusBar.appendChild(timerBadge);

  card.appendChild(statusBar);

  if (!isPlaying) {
    const idleMsg = el('div', {
      className: 'history-empty',
      text: 'Настройте параметры выше и нажмите «Начать игру», чтобы компьютер загадал число.',
    });
    card.appendChild(idleMsg);
    return card;
  }

  // Guess Form
  const form = el('form', { className: 'guess-form' });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (val) {
      onGuessSubmit(val);
    }
  });

  const inputRow = el('div', { className: 'input-row' });

  const input = el('input', {
    className: `guess-input ${errorMessage ? 'error' : ''}`,
    attributes: {
      type: 'text',
      autocomplete: 'off',
      autocapitalize: 'off',
      spellcheck: 'false',
      maxlength: String(state.settings.length),
      placeholder: '•'.repeat(state.settings.length),
      autofocus: 'true',
    },
  }) as HTMLInputElement;

  // Real-time input filtering using createDigitValidator
  const isDigitValid = createDigitValidator(state.settings.base);

  input.addEventListener('beforeinput', (e: InputEvent) => {
    if (e.data) {
      for (const char of e.data) {
        if (!isDigitValid(char)) {
          e.preventDefault();
          return;
        }
      }
    }
  });

  input.addEventListener('input', () => {
    // Filter any pasted invalid chars and convert to lowercase
    const filtered = Array.from(input.value)
      .filter((ch) => isDigitValid(ch))
      .join('')
      .slice(0, state.settings.length)
      .toLowerCase();

    if (input.value !== filtered) {
      input.value = filtered;
    }
  });

  inputRow.appendChild(input);

  const submitBtn = el('button', {
    className: 'btn btn-primary',
    text: 'Проверить',
    attributes: {
      type: 'submit',
    },
  });
  inputRow.appendChild(submitBtn);

  form.appendChild(inputRow);

  // Error / Feedback notice
  const feedback = el('div', {
    className: `input-feedback ${errorMessage ? 'danger' : ''}`,
    text:
      errorMessage ||
      `Введите ровно ${state.settings.length} уникальных символов системы счисления ${state.settings.base}`,
  });
  form.appendChild(feedback);

  card.appendChild(form);

  // New Game action
  const resetBtn = el('button', {
    className: 'btn btn-secondary btn-block',
    text: '🔄 Новая игра (сбросить раунд)',
    attributes: {
      type: 'button',
    },
    onClick: onNewGame,
  });
  card.appendChild(resetBtn);

  // Auto focus input
  setTimeout(() => {
    input.focus();
  }, 50);

  return card;
};
