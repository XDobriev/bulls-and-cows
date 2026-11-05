import { TurnRecord } from '../../core/gameState';
import { el } from '../domUtils';

interface HistoryViewProps {
  history: readonly TurnRecord[];
}

export const createHistoryView = ({ history }: HistoryViewProps): HTMLElement => {
  const card = el('div', { className: 'card history-card' });

  const title = el('h2', {
    className: 'card-title',
    text: `📜 История попыток (${history.length})`,
  });
  card.appendChild(title);

  if (history.length === 0) {
    const empty = el('div', {
      className: 'history-empty',
      text: 'Пока нет попыток. Введите вариант, чтобы получить подсказку по быкам и коровам!',
    });
    card.appendChild(empty);
    return card;
  }

  const list = el('div', { className: 'history-list' });

  // Show recent attempts on top (or in order; reversing so latest is visible immediately)
  const reversed = [...history].reverse();

  for (const record of reversed) {
    const item = el('div', { className: 'history-item' });

    const meta = el('div', { className: 'history-attempt-meta' });
    const num = el('span', {
      className: 'attempt-number',
      text: `#${record.attemptNumber}`,
    });
    const guessText = el('span', {
      className: 'attempt-guess',
      text: record.guess,
    });
    meta.appendChild(num);
    meta.appendChild(guessText);
    item.appendChild(meta);

    const results = el('div', { className: 'history-results' });

    const bullsBadge = el('span', {
      className: 'metric-badge metric-bulls',
      text: `🐂 Быки: ${record.bulls}`,
      attributes: {
        title: `${record.bulls} цифр угаданы и стоят на своём месте`,
      },
    });
    results.appendChild(bullsBadge);

    const cowsBadge = el('span', {
      className: 'metric-badge metric-cows',
      text: `🐄 Коровы: ${record.cows}`,
      attributes: {
        title: `${record.cows} цифр угаданы, но стоят не на своём месте`,
      },
    });
    results.appendChild(cowsBadge);

    item.appendChild(results);
    list.appendChild(item);
  }

  card.appendChild(list);
  return card;
};
