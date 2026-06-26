import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fixtureWords, makeRecord } from '../test/fixtures';
import { StudyScreen } from './StudyScreen';

describe('StudyScreen', () => {
  it('reveals flashcard meaning and records a known answer', async () => {
    const onFinish = vi.fn();

    render(<StudyScreen words={fixtureWords.slice(0, 1)} records={[]} onFinish={onFinish} />);

    expect(screen.getByText('abandon')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '查看释义' }));
    expect(screen.getByText('放弃；抛弃')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '认识' }));
    expect(onFinish).toHaveBeenCalled();
  });

  it('shows multiple choice for medium-familiarity words', async () => {
    const onFinish = vi.fn();

    render(
      <StudyScreen
        words={fixtureWords.slice(0, 1)}
        records={[makeRecord({ wordId: 'ielts-abandon', familiarity: 2, consecutiveCorrect: 1 })]}
        onFinish={onFinish}
      />
    );

    expect(screen.getByText('选择正确释义')).toBeInTheDocument();

    const [correctButton] = screen.getAllByRole('button', { name: '放弃；抛弃' });
    await userEvent.click(correctButton);

    expect(onFinish).toHaveBeenCalled();
  });

  it('shows spelling input for familiar words', async () => {
    const onFinish = vi.fn();

    render(
      <StudyScreen
        words={fixtureWords.slice(0, 1)}
        records={[makeRecord({ wordId: 'ielts-abandon', familiarity: 4, consecutiveCorrect: 2 })]}
        onFinish={onFinish}
      />
    );

    expect(screen.getByText('输入英文单词')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('英文拼写'), 'abandon');
    await userEvent.click(screen.getByRole('button', { name: '提交' }));

    expect(onFinish).toHaveBeenCalled();
  });
});
