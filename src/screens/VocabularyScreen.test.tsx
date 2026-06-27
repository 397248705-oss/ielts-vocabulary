import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { StudyRecord, WordEntry } from '../domain/types';
import { VocabularyScreen } from './VocabularyScreen';

const words: WordEntry[] = [
  {
    id: 'deposit',
    word: 'deposit',
    meaningZh: '押金',
    pos: 'n.',
    phonetic: '/dɪˈpɒzɪt/',
    exampleEn: 'Pay a deposit.',
    exampleZh: '支付押金。',
    difficulty: 'core',
    source: 'ielts',
    topic: '生活'
  },
  {
    id: 'custom-luggage',
    word: 'luggage',
    meaningZh: '行李',
    pos: 'n.',
    phonetic: '/ˈlʌɡɪdʒ/',
    exampleEn: 'This is my luggage.',
    exampleZh: '这是我的行李。',
    difficulty: 'core',
    source: 'custom',
    topic: '旅行'
  }
];

const records: StudyRecord[] = [];

describe('VocabularyScreen', () => {
  it('searches Chinese meanings and filters by source', async () => {
    render(
      <VocabularyScreen
        words={words}
        records={records}
        onToggleFavorite={vi.fn()}
        onAddWord={vi.fn()}
      />
    );

    await userEvent.type(screen.getByRole('searchbox', { name: '搜索单词' }), '押金');
    expect(screen.getByText('deposit')).toBeInTheDocument();
    expect(screen.queryByText('luggage')).not.toBeInTheDocument();

    await userEvent.clear(screen.getByRole('searchbox', { name: '搜索单词' }));
    await userEvent.click(screen.getByRole('button', { name: '自定义' }));
    expect(screen.getByText('luggage')).toBeInTheDocument();
    expect(screen.queryByText('deposit')).not.toBeInTheDocument();
  });

  it('supports favorite filtering and favorite actions', async () => {
    const onToggleFavorite = vi.fn();
    const favoriteRecord: StudyRecord = {
      wordId: 'deposit',
      seen: true,
      familiarity: 1,
      intervalDays: 1,
      nextReviewOn: '2026-06-28',
      consecutiveCorrect: 0,
      errorCount: 0,
      favorite: true,
      mistakeMastered: false,
      history: []
    };

    render(
      <VocabularyScreen
        words={words}
        records={[favoriteRecord]}
        onToggleFavorite={onToggleFavorite}
        onAddWord={vi.fn()}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: '只看收藏' }));
    expect(screen.getByText('deposit')).toBeInTheDocument();
    expect(screen.queryByText('luggage')).not.toBeInTheDocument();

    const row = screen.getByText('deposit').closest('article');
    expect(row).not.toBeNull();
    await userEvent.click(within(row!).getByRole('button', { name: '取消收藏 deposit' }));
    expect(onToggleFavorite).toHaveBeenCalledWith('deposit');
  });
});
