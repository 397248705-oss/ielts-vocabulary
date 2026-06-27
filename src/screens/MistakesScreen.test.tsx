import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fixtureWords, makeRecord } from '../test/fixtures';
import { MistakesScreen } from './MistakesScreen';

describe('MistakesScreen', () => {
  it('lists active mistakes and exposes review and mastered actions', async () => {
    const onStart = vi.fn();
    const onMarkMastered = vi.fn();
    const mistake = makeRecord({
      wordId: 'ielts-abandon',
      errorCount: 3,
      lastMistakeAt: '2026-06-28T12:00:00.000Z'
    });

    render(
      <MistakesScreen
        words={fixtureWords}
        records={[mistake]}
        onStart={onStart}
        onMarkMastered={onMarkMastered}
      />
    );

    expect(screen.getByText('abandon')).toBeInTheDocument();
    expect(screen.getByText('错 3 次')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '标记已掌握 abandon' }));
    expect(onMarkMastered).toHaveBeenCalledWith('ielts-abandon');

    await userEvent.click(screen.getByRole('button', { name: '复习全部错题' }));
    expect(onStart).toHaveBeenCalledOnce();
  });

  it('shows a calm empty state when there are no active mistakes', () => {
    render(
      <MistakesScreen words={fixtureWords} records={[]} onStart={vi.fn()} onMarkMastered={vi.fn()} />
    );
    expect(screen.getByText('暂时没有需要复习的错题')).toBeInTheDocument();
  });
});
