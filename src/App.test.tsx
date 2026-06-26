import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { getSettings } from './storage/db';

vi.mock('./storage/db', () => ({
  clearLocalData: vi.fn(() => Promise.resolve()),
  getRecords: vi.fn(() => Promise.resolve([])),
  getSettings: vi.fn(() => Promise.resolve({ dailyNewWords: 20 })),
  saveRecords: vi.fn(() => Promise.resolve()),
  saveSettings: vi.fn(() => Promise.resolve())
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens to today dashboard and can switch tabs', async () => {
    render(<App />);

    expect(await screen.findByText('今日任务')).toBeInTheDocument();
    expect(getSettings).toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: '词库' }));
    expect(screen.getByText('雅思词库')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '设置' }));
    expect(screen.getByLabelText('每日新词数')).toBeInTheDocument();
  });
});
