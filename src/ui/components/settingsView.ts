import { BaseOption, GameSettings, GameStatus } from '../../core/gameState';
import { countPossibleSecrets } from '../../core/countPossibleSecrets';
import { el } from '../domUtils';

interface SettingsViewProps {
  settings: GameSettings;
  status: GameStatus;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onStartGame: () => void;
}

const BASES: { label: string; value: BaseOption; desc: string }[] = [
  { label: 'BIN (2)', value: 2, desc: '0, 1' },
  { label: 'OCT (8)', value: 8, desc: '0–7' },
  { label: 'DEC (10)', value: 10, desc: '0–9' },
  { label: 'HEX (16)', value: 16, desc: '0–9, a–f' },
];

const LENGTHS = [2, 3, 4, 5, 6];

export const createSettingsView = ({
  settings,
  status,
  onUpdateSettings,
  onStartGame,
}: SettingsViewProps): HTMLElement => {
  const isPlaying = status === 'playing';

  const card = el('div', { className: 'card settings-card' });

  const title = el('h2', {
    className: 'card-title',
    text: '⚙️ Настройки игры',
  });
  card.appendChild(title);

  const group = el('div', { className: 'settings-group' });

  // 1. Base selection
  const baseRow = el('div', { className: 'setting-row' });
  const baseLabel = el('div', {
    className: 'setting-label',
    text: 'Система счисления:',
  });
  baseRow.appendChild(baseLabel);

  const basePills = el('div', { className: 'options-pill-group' });
  for (const b of BASES) {
    const btn = el('button', {
      className: `pill-button ${settings.base === b.value ? 'active' : ''}`,
      text: b.label,
      attributes: {
        type: 'button',
        title: `Алфавит: ${b.desc}`,
      },
      onClick: () => {
        if (!isPlaying && settings.base !== b.value) {
          onUpdateSettings({ base: b.value });
        }
      },
    });
    if (isPlaying) {
      btn.setAttribute('disabled', 'true');
    }
    basePills.appendChild(btn);
  }
  baseRow.appendChild(basePills);

  const currentBaseObj = BASES.find((b) => b.value === settings.base);
  const baseHint = el('span', {
    className: 'setting-hint',
    text: `Допустимые цифры: ${currentBaseObj?.desc ?? ''}`,
  });
  baseRow.appendChild(baseHint);
  group.appendChild(baseRow);

  // 2. Length selection
  const lengthRow = el('div', { className: 'setting-row' });
  const lengthLabel = el('div', {
    className: 'setting-label',
    text: 'Длина секретного числа:',
  });
  lengthRow.appendChild(lengthLabel);

  const lengthPills = el('div', { className: 'options-pill-group' });
  for (const len of LENGTHS) {
    const isLenDisabled = isPlaying || (settings.base === 2 && len > 2);
    const btn = el('button', {
      className: `pill-button ${settings.length === len ? 'active' : ''}`,
      text: String(len),
      attributes: {
        type: 'button',
      },
      onClick: () => {
        if (!isPlaying && !isLenDisabled && settings.length !== len) {
          onUpdateSettings({ length: len });
        }
      },
    });
    if (isLenDisabled) {
      btn.setAttribute('disabled', 'true');
    }
    lengthPills.appendChild(btn);
  }
  lengthRow.appendChild(lengthPills);

  if (settings.base === 2) {
    const binNotice = el('span', {
      className: 'setting-hint',
      text: 'Для двоичной системы доступна только длина 2 (алфавит 0 и 1)',
    });
    lengthRow.appendChild(binNotice);
  }
  group.appendChild(lengthRow);

  // 3. Possible combinations calculation
  const possibleCount = countPossibleSecrets(settings.length, settings.base);
  const infoRow = el('div', { className: 'possible-secrets-info' });
  const infoLabel = el('span', { text: 'Возможных комбинаций (P):' });
  const infoVal = el('span', {
    className: 'possible-secrets-number',
    text: possibleCount.toLocaleString('ru-RU'),
  });
  infoRow.appendChild(infoLabel);
  infoRow.appendChild(infoVal);
  group.appendChild(infoRow);

  // 4. Start game button
  const startBtn = el('button', {
    className: 'btn btn-primary btn-block',
    text: isPlaying ? 'Раунд идёт...' : '🎮 Начать игру',
    attributes: {
      type: 'button',
    },
    onClick: () => {
      if (!isPlaying) {
        onStartGame();
      }
    },
  });
  if (isPlaying) {
    startBtn.setAttribute('disabled', 'true');
  }
  group.appendChild(startBtn);

  card.appendChild(group);
  return card;
};
