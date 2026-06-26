import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('opens to today dashboard and can switch tabs', async () => {
    render(<App />);

    expect(screen.getByText('今日任务')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '词库' }));
    expect(screen.getByText('雅思词库')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '设置' }));
    expect(screen.getByLabelText('每日新词数')).toBeInTheDocument();
  });
});
