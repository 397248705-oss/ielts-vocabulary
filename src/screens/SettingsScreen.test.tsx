import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SettingsScreen } from './SettingsScreen';

describe('SettingsScreen', () => {
  it('edits and clamps the daily new-word target', async () => {
    const onSettingsChange = vi.fn();
    render(
      <SettingsScreen
        settings={{ dailyNewWords: 20 }}
        onSettingsChange={onSettingsChange}
        onExport={vi.fn()}
        onImport={vi.fn()}
        onClear={vi.fn()}
      />
    );

    const input = screen.getByLabelText('每日新词数');
    await userEvent.clear(input);
    await userEvent.type(input, '150');
    await userEvent.tab();
    expect(onSettingsChange).toHaveBeenLastCalledWith({ dailyNewWords: 100 });
  });

  it('supports stepper and backup actions', async () => {
    const onSettingsChange = vi.fn();
    const onExport = vi.fn();
    render(
      <SettingsScreen
        settings={{ dailyNewWords: 20 }}
        onSettingsChange={onSettingsChange}
        onExport={onExport}
        onImport={vi.fn()}
        onClear={vi.fn()}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: '减少每日新词' }));
    expect(onSettingsChange).toHaveBeenCalledWith({ dailyNewWords: 19 });
    await userEvent.click(screen.getByRole('button', { name: '导出备份' }));
    expect(onExport).toHaveBeenCalledOnce();
  });
});
