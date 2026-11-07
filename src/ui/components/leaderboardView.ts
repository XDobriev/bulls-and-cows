import { ScoreEntry, formatDuration } from '../../core/leaderboard';
import { el } from '../domUtils';

interface LeaderboardViewProps {
  scores: readonly ScoreEntry[];
  onClear: () => void;
}

const getBaseName = (base: number): string => {
  switch (base) {
    case 2:
      return 'BIN';
    case 8:
      return 'OCT';
    case 10:
      return 'DEC';
    case 16:
      return 'HEX';
    default:
      return `b${base}`;
  }
};

export const createLeaderboardView = ({ scores, onClear }: LeaderboardViewProps): HTMLElement => {
  const card = el('div', { className: 'card leaderboard-card' });

  const header = el('div', { className: 'card-title' });
  const titleText = el('span', { text: '🏆 Таблица рекордов' });
  header.appendChild(titleText);

  if (scores.length > 0) {
    const clearBtn = el('button', {
      className: 'btn btn-secondary',
      text: 'Очистить',
      attributes: {
        type: 'button',
        style: 'padding: 0.25rem 0.6rem; font-size: 0.75rem;',
      },
      onClick: () => {
        if (window.confirm('Очистить таблицу рекордов?')) {
          onClear();
        }
      },
    });
    header.appendChild(clearBtn);
  }

  card.appendChild(header);

  if (scores.length === 0) {
    const empty = el('div', {
      className: 'history-empty',
      text: 'Рекордов пока нет. Выиграйте свой первый раунд, чтобы попасть в список чемпионов!',
    });
    card.appendChild(empty);
    return card;
  }

  const table = el('table', { className: 'leaderboard-table' });

  const thead = el('thead');
  const headerRow = el('tr');
  headerRow.appendChild(el('th', { text: '#' }));
  headerRow.appendChild(el('th', { text: 'Игрок' }));
  headerRow.appendChild(el('th', { text: 'Попытки' }));
  headerRow.appendChild(el('th', { text: 'Время' }));
  headerRow.appendChild(el('th', { text: 'Режим' }));
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = el('tbody');
  scores.forEach((entry, idx) => {
    const row = el('tr');

    const rankCell = el('td', {
      className: 'leaderboard-rank',
      text: `${idx + 1}`,
    });
    const playerCell = el('td', {
      className: 'leaderboard-player',
      text: entry.playerName,
    });
    const attemptsCell = el('td', {
      text: `${entry.attempts}`,
    });
    const timeCell = el('td', {
      text: formatDuration(entry.durationMs),
    });
    const modeCell = el('td');
    const badge = el('span', {
      className: 'mode-badge',
      text: `${getBaseName(entry.base)} · ${entry.length}`,
    });
    modeCell.appendChild(badge);

    row.appendChild(rankCell);
    row.appendChild(playerCell);
    row.appendChild(attemptsCell);
    row.appendChild(timeCell);
    row.appendChild(modeCell);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  card.appendChild(table);
  return card;
};
