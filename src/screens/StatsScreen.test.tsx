import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { makeRecord } from '../test/fixtures';
import { StatsScreen } from './StatsScreen';

describe('StatsScreen', () => {
  it('shows summary cards and a seven-day trend', () => {
    render(
      <StatsScreen
        today="2026-06-27"
        records={[
          makeRecord({
            favorite: true,
            errorCount: 1,
            history: [
              {
                wordId: 'ielts-abandon',
                kind: 'choice',
                rating: 'good',
                correct: true,
                answeredAt: '2026-06-27T12:00:00.000Z'
              }
            ]
          })
        ]}
      />
    );

    expect(screen.getByText('学习进度')).toBeInTheDocument();
    expect(screen.getByText('已学习')).toBeInTheDocument();
    expect(screen.getByText('错题')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '近 7 天学习趋势' })).toBeInTheDocument();
  });
});
