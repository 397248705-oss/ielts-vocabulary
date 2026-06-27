import { describe, expect, it } from 'vitest';
import { defaultSettings, makeRecord } from '../test/fixtures';
import { createBackup, parseBackup } from './backup';

describe('backup', () => {
  it('exports records with app metadata', () => {
    const backup = createBackup(
      [makeRecord()],
      defaultSettings,
      [],
      '2026-06-26T00:00:00.000Z'
    );

    expect(backup.app).toBe('ielts-vocabulary-pwa');
    expect(backup.version).toBe(2);
    expect(backup.records).toHaveLength(1);
    expect(backup.settings.dailyNewWords).toBe(20);
    expect(backup.customWords).toEqual([]);
  });

  it('rejects malformed imports', () => {
    expect(() => parseBackup('{"app":"other"}')).toThrow('Invalid backup file');
  });

  it('parses valid imports', () => {
    const backup = createBackup(
      [makeRecord()],
      defaultSettings,
      [],
      '2026-06-26T00:00:00.000Z'
    );

    expect(parseBackup(JSON.stringify(backup)).records[0].wordId).toBe('ielts-abandon');
  });

  it('migrates a version 1 backup to version 2 defaults', () => {
    const parsed = parseBackup(
      JSON.stringify({
        app: 'ielts-vocabulary-pwa',
        version: 1,
        exportedAt: '2026-06-26T00:00:00.000Z',
        settings: defaultSettings,
        records: [makeRecord()]
      })
    );

    expect(parsed.version).toBe(2);
    expect(parsed.customWords).toEqual([]);
  });

  it('round-trips custom words', () => {
    const customWord = makeCustomWord();
    const backup = createBackup(
      [makeRecord()],
      defaultSettings,
      [customWord],
      '2026-06-27T00:00:00.000Z'
    );

    expect(parseBackup(JSON.stringify(backup)).customWords).toEqual([customWord]);
  });
});

function makeCustomWord() {
  return {
    id: 'custom-1',
    word: 'resilient',
    meaningZh: '有韧性的',
    pos: 'adjective',
    phonetic: '',
    exampleEn: '',
    exampleZh: '',
    difficulty: 'core' as const,
    source: 'custom' as const,
    topic: 'custom',
    createdAt: '2026-06-27T00:00:00.000Z'
  };
}
