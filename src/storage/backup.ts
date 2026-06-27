import type { BackupFile, StudyRecord, UserSettings, WordEntry } from '../domain/types';

type RawBackupFile = Omit<Partial<BackupFile>, 'version'> & { version?: number };

function normalizeRecord(record: StudyRecord): StudyRecord {
  return {
    ...record,
    errorCount: record.errorCount ?? 0,
    favorite: record.favorite ?? false,
    mistakeMastered: record.mistakeMastered ?? false,
    history: record.history ?? []
  };
}

export function createBackup(
  records: StudyRecord[],
  settings: UserSettings,
  customWords: WordEntry[] = [],
  exportedAt = new Date().toISOString()
): BackupFile {
  return {
    app: 'ielts-vocabulary-pwa',
    version: 2,
    exportedAt,
    settings,
    records,
    customWords
  };
}

export function parseBackup(text: string): BackupFile {
  try {
    const parsed = JSON.parse(text) as RawBackupFile;

    if (
      parsed.app !== 'ielts-vocabulary-pwa' ||
      (parsed.version !== 1 && parsed.version !== 2) ||
      !Array.isArray(parsed.records) ||
      typeof parsed.settings?.dailyNewWords !== 'number' ||
      (parsed.version === 2 && !Array.isArray(parsed.customWords))
    ) {
      throw new Error('Invalid backup file');
    }

    const customWords = parsed.version === 2 ? parsed.customWords ?? [] : [];
    const validCustomWords = customWords.every(
      (word) =>
        typeof word?.id === 'string' &&
        typeof word.word === 'string' &&
        typeof word.meaningZh === 'string' &&
        word.source === 'custom'
    );

    if (!validCustomWords) {
      throw new Error('Invalid backup file');
    }

    return {
      app: 'ielts-vocabulary-pwa',
      version: 2,
      exportedAt: parsed.exportedAt ?? new Date().toISOString(),
      settings: parsed.settings,
      records: parsed.records.map((record) => normalizeRecord(record)),
      customWords
    };
  } catch {
    throw new Error('Invalid backup file');
  }
}
