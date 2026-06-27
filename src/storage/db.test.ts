import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import type { WordEntry } from '../domain/types';
import { makeRecord } from '../test/fixtures';
import { getCustomWords, getRecords, openDatabase, saveCustomWord } from './db';

const DB_NAME = 'ielts-vocabulary-pwa';

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function createLegacyDatabase(): Promise<void> {
  await requestResult(indexedDB.deleteDatabase(DB_NAME));
  const request = indexedDB.open(DB_NAME, 1);

  request.onupgradeneeded = () => {
    request.result.createObjectStore('records', { keyPath: 'wordId' });
    request.result.createObjectStore('settings');
  };

  const db = await requestResult(request);
  const transaction = db.transaction('records', 'readwrite');
  await requestResult(transaction.objectStore('records').put(makeRecord()));
  db.close();
}

describe('IndexedDB adapter', () => {
  it('migrates version 1 data and persists custom words', async () => {
    await createLegacyDatabase();

    const db = await openDatabase();
    expect(db.version).toBe(2);
    expect(Array.from(db.objectStoreNames)).toContain('customWords');
    db.close();

    expect(await getRecords()).toHaveLength(1);

    const customWord: WordEntry = {
      id: 'custom-1',
      word: 'resilient',
      meaningZh: '有韧性的',
      pos: 'adjective',
      phonetic: '',
      exampleEn: '',
      exampleZh: '',
      difficulty: 'core',
      source: 'custom',
      topic: 'custom',
      createdAt: '2026-06-27T00:00:00.000Z'
    };

    await saveCustomWord(customWord);
    expect(await getCustomWords()).toEqual([customWord]);
  });
});
