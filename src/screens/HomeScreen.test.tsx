import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { StudyStats } from '../domain/stats';
import { HomeScreen } from './HomeScreen';

const stats: StudyStats = {
  seenCount: 128,
  masteredCount: 86,
  mistakeWordCount: 4,
  favoriteCount: 12,
  totalAnswers: 160,
  correctAnswers: 128,
  accuracy: 80,
  streakDays: 5,
  recentActivity: Array.from({ length: 7 }, (_, index) => ({
    date: `2026-06-${21 + index}`,
    answers: index
  }))
};

describe('HomeScreen', () => {
  it('shows daily counts, progress, and learning summary', () => {
    render(
      <HomeScreen
        dueCount={12}
        newCount={20}
        stats={stats}
        onStart={vi.fn()}
        onReviewMistakes={vi.fn()}
        onOpenFavorites={vi.fn()}
        onAddWord={vi.fn()}
      />
    );

    expect(screen.getByText('今天也要向目标靠近')).toBeInTheDocument();
    expect(screen.getByLabelText('新词 20 个')).toBeInTheDocument();
    expect(screen.getByLabelText('待复习 12 个')).toBeInTheDocument();
    expect(screen.getByText('5 天')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
  });

  it('exposes four quick actions', async () => {
    const actions = [vi.fn(), vi.fn(), vi.fn(), vi.fn()];
    render(
      <HomeScreen
        dueCount={0}
        newCount={20}
        stats={stats}
        onStart={actions[0]}
        onReviewMistakes={actions[1]}
        onOpenFavorites={actions[2]}
        onAddWord={actions[3]}
      />
    );

    const quickActions = screen.getByRole('heading', { name: '快捷入口' }).closest('section');
    expect(quickActions).not.toBeNull();

    for (const [index, label] of ['开始学习', '复习错题', '我的收藏', '添加单词'].entries()) {
      await userEvent.click(within(quickActions!).getByRole('button', { name: label }));
      expect(actions[index]).toHaveBeenCalledOnce();
    }
  });
});
