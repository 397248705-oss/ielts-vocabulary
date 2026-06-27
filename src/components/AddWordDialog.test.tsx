import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AddWordDialog } from './AddWordDialog';

describe('AddWordDialog', () => {
  it('submits a custom word with the required fields', async () => {
    const onSave = vi.fn();
    render(<AddWordDialog onClose={vi.fn()} onSave={onSave} />);

    await userEvent.type(screen.getByLabelText('英文单词'), 'commute');
    await userEvent.type(screen.getByLabelText('中文释义'), '通勤');
    await userEvent.type(screen.getByLabelText('分类'), '生活');
    await userEvent.click(screen.getByRole('button', { name: '保存单词' }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ word: 'commute', meaningZh: '通勤', topic: '生活' })
    );
  });
});
