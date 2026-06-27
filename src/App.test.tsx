import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { getCustomWords, getSettings } from './storage/db';

vi.mock('./storage/db', () => ({
  clearLocalData: vi.fn(() => Promise.resolve()),
  getCustomWords: vi.fn(() => Promise.resolve([])),
  getRecords: vi.fn(() => Promise.resolve([])),
  getSettings: vi.fn(() => Promise.resolve({ dailyNewWords: 20 })),
  saveCustomWord: vi.fn(() => Promise.resolve()),
  saveCustomWords: vi.fn(() => Promise.resolve()),
  saveRecords: vi.fn(() => Promise.resolve()),
  saveSettings: vi.fn(() => Promise.resolve())
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads local data and shows the approved five-tab navigation', async () => {
    render(<App />);

    expect(await screen.findByText('今日任务')).toBeInTheDocument();
    expect(getSettings).toHaveBeenCalled();
    expect(getCustomWords).toHaveBeenCalled();

    for (const label of ['今日', '词库', '错题', '统计', '设置']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    }

    await userEvent.click(screen.getByRole('button', { name: '词库' }));
    expect(screen.getByText('雅思词库')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '错题' }));
    expect(screen.getByText('错题本')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '设置' }));
    expect(screen.getByLabelText('每日新词数')).toBeInTheDocument();
  });
});
