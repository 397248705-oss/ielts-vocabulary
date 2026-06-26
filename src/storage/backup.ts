import type { BackupFile, StudyRecord, UserSettings } from '../domain/types';

export function createBackup(
  records: StudyRecord[],
  settings: UserSettings,
  exportedAt = new Date().toISOString()
): BackupFile {
  return {
    app: 'ielts-vocabulary-pwa',
    version: 1,
    exportedAt,
    settings,
    records
  };
}

export function parseBackup(text: string): BackupFile {
  try {
    const parsed = JSON.parse(text) as Partial<BackupFile>;

    if (
      parsed.app !== 'ielts-vocabulary-pwa' ||
      parsed.version !== 1 ||
      !Array.isArray(parsed.records) ||
      typeof parsed.settings?.dailyNewWords !== 'number'
    ) {
      throw new Error('Invalid backup file');
    }

    return parsed as BackupFile;
  } catch {
    throw new Error('Invalid backup file');
  }
}
