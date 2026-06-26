import { describe, expect, it } from 'vitest';
import { defaultSettings, makeRecord } from '../test/fixtures';
import { createBackup, parseBackup } from './backup';

describe('backup', () => {
  it('exports records with app metadata', () => {
    const backup = createBackup([makeRecord()], defaultSettings, '2026-06-26T00:00:00.000Z');

    expect(backup.app).toBe('ielts-vocabulary-pwa');
    expect(backup.version).toBe(1);
    expect(backup.records).toHaveLength(1);
    expect(backup.settings.dailyNewWords).toBe(20);
  });

  it('rejects malformed imports', () => {
    expect(() => parseBackup('{"app":"other"}')).toThrow('Invalid backup file');
  });

  it('parses valid imports', () => {
    const backup = createBackup([makeRecord()], defaultSettings, '2026-06-26T00:00:00.000Z');

    expect(parseBackup(JSON.stringify(backup)).records[0].wordId).toBe('ielts-abandon');
  });
});
