import { formatDuration } from '../../core/leaderboard';
import { el } from '../domUtils';

interface VictoryModalProps {
  secret: string;
  attempts: number;
  durationMs: number;
  onSaveScore: (playerName: string) => void;
  onPlayAgain: () => void;
  onClose?: () => void;
}

export const createVictoryModal = ({
  secret,
  attempts,
  durationMs,
  onSaveScore,
  onPlayAgain,
  onClose,
}: VictoryModalProps): HTMLElement => {
  const overlay = el('div', { className: 'modal-overlay' });
  const dialog = el('div', { className: 'modal-dialog' });

  if (onClose) {
    const closeBtn = el('button', {
      className: 'modal-close-btn',
      text: '✕',
      attributes: {
        type: 'button',
        title: 'Закрыть окно (просмотреть результат)',
        'aria-label': 'Закрыть',
      },
      onClick: onClose,
    });
    dialog.appendChild(closeBtn);
  }

  const icon = el('div', { className: 'modal-icon', text: '🎉' });
  dialog.appendChild(icon);

  const title = el('h2', { className: 'modal-title', text: 'Победа!' });
  dialog.appendChild(title);

  const desc = el('p', {
    className: 'setting-hint',
    text: 'Вы успешно раскрыли секретную комбинацию!',
  });
  dialog.appendChild(desc);

  const secretBox = el('div', { className: 'modal-secret-box' });
  const secretLabel = el('div', {
    className: 'modal-secret-label',
    text: 'Загаданное число',
  });
  const secretVal = el('div', {
    className: 'modal-secret-value',
    text: secret,
  });
  secretBox.appendChild(secretLabel);
  secretBox.appendChild(secretVal);
  dialog.appendChild(secretBox);

  const stats = el('div', { className: 'modal-stats' });

  const statAttempts = el('div', { className: 'stat-box' });
  statAttempts.appendChild(el('div', { className: 'stat-label', text: 'Попыток' }));
  statAttempts.appendChild(el('div', { className: 'stat-value', text: String(attempts) }));
  stats.appendChild(statAttempts);

  const statTime = el('div', { className: 'stat-box' });
  statTime.appendChild(el('div', { className: 'stat-label', text: 'Время' }));
  statTime.appendChild(el('div', { className: 'stat-value', text: formatDuration(durationMs) }));
  stats.appendChild(statTime);

  dialog.appendChild(stats);

  const actions = el('div', { className: 'modal-actions' });

  let saved = false;
  const nameInput = el('input', {
    className: 'player-name-input',
    attributes: {
      type: 'text',
      placeholder: 'Ваше имя для таблицы рекордов',
      maxlength: '20',
      value: 'Игрок',
    },
  }) as HTMLInputElement;
  actions.appendChild(nameInput);

  const triggerSave = (): void => {
    if (!saved) {
      const name = nameInput.value.trim() || 'Игрок';
      onSaveScore(name);
      saved = true;
      saveBtn.textContent = '✅ Сохранено в рекорды!';
      saveBtn.setAttribute('disabled', 'true');
      nameInput.setAttribute('disabled', 'true');
    }
  };

  nameInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      triggerSave();
    }
  });

  const saveBtn = el('button', {
    className: 'btn btn-primary',
    text: '💾 Сохранить рекорд',
    attributes: {
      type: 'button',
    },
    onClick: triggerSave,
  });
  actions.appendChild(saveBtn);

  const playAgainBtn = el('button', {
    className: 'btn btn-secondary',
    text: '🔄 Новая игра',
    attributes: {
      type: 'button',
    },
    onClick: onPlayAgain,
  });
  actions.appendChild(playAgainBtn);

  dialog.appendChild(actions);
  overlay.appendChild(dialog);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay && onClose) {
      onClose();
    }
  });

  const handleEsc = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && onClose) {
      window.removeEventListener('keydown', handleEsc);
      onClose();
    }
  };
  window.addEventListener('keydown', handleEsc);

  return overlay;
};
