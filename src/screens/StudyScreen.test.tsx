import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fixtureWords } from '../test/fixtures';
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
});
