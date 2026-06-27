import type { StudyRecord, UserSettings, WordEntry } from '../domain/types';

const DB_NAME = 'ielts-vocabulary-pwa';
const DB_VERSION = 2;
const RECORDS = 'records';
const SETTINGS = 'settings';
const CUSTOM_WORDS = 'customWords';

const defaultSettings: UserSettings = { dailyNewWords: 20 };

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionToPromise(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function normalizeRecord(record: StudyRecord): StudyRecord {
  return {
    ...record,
    errorCount: record.errorCount ?? 0,
    favorite: record.favorite ?? false,
    mistakeMastered: record.mistakeMastered ?? false,
    history: record.history ?? []
  };
}

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(RECORDS)) {
        db.createObjectStore(RECORDS, { keyPath: 'wordId' });
      }

      if (!db.objectStoreNames.contains(SETTINGS)) {
        db.createObjectStore(SETTINGS);
      }

      if (!db.objectStoreNames.contains(CUSTOM_WORDS)) {
        db.createObjectStore(CUSTOM_WORDS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getRecords(): Promise<StudyRecord[]> {
  const db = await openDatabase();
  const tx = db.transaction(RECORDS, 'readonly');
  const completion = transactionToPromise(tx);
  const records = await requestToPromise<StudyRecord[]>(tx.objectStore(RECORDS).getAll());
  await completion;
  db.close();
  return records.map(normalizeRecord);
}

export async function saveRecord(record: StudyRecord): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(RECORDS, 'readwrite');
  const completion = transactionToPromise(tx);
  await requestToPromise(tx.objectStore(RECORDS).put(record));
  await completion;
  db.close();
}

export async function saveRecords(records: StudyRecord[]): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(RECORDS, 'readwrite');
  const completion = transactionToPromise(tx);
  await Promise.all(records.map((record) => requestToPromise(tx.objectStore(RECORDS).put(record))));
  await completion;
  db.close();
}

export async function getSettings(): Promise<UserSettings> {
  const db = await openDatabase();
  const tx = db.transaction(SETTINGS, 'readonly');
  const completion = transactionToPromise(tx);
  const settings = await requestToPromise<UserSettings | undefined>(tx.objectStore(SETTINGS).get('user'));
  await completion;
  db.close();
  return settings ?? defaultSettings;
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(SETTINGS, 'readwrite');
  const completion = transactionToPromise(tx);
  await requestToPromise(tx.objectStore(SETTINGS).put(settings, 'user'));
  await completion;
  db.close();
}

export async function getCustomWords(): Promise<WordEntry[]> {
  const db = await openDatabase();
  const tx = db.transaction(CUSTOM_WORDS, 'readonly');
  const completion = transactionToPromise(tx);
  const words = await requestToPromise<WordEntry[]>(tx.objectStore(CUSTOM_WORDS).getAll());
  await completion;
  db.close();
  return words;
}

export async function saveCustomWord(word: WordEntry): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(CUSTOM_WORDS, 'readwrite');
  const completion = transactionToPromise(tx);
  await requestToPromise(tx.objectStore(CUSTOM_WORDS).put(word));
  await completion;
  db.close();
}

export async function saveCustomWords(words: WordEntry[]): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(CUSTOM_WORDS, 'readwrite');
  const completion = transactionToPromise(tx);
  await Promise.all(words.map((word) => requestToPromise(tx.objectStore(CUSTOM_WORDS).put(word))));
  await completion;
  db.close();
}

export async function deleteCustomWord(wordId: string): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(CUSTOM_WORDS, 'readwrite');
  const completion = transactionToPromise(tx);
  await requestToPromise(tx.objectStore(CUSTOM_WORDS).delete(wordId));
  await completion;
  db.close();
}

export async function clearLocalData(): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction([RECORDS, SETTINGS, CUSTOM_WORDS], 'readwrite');
  const completion = transactionToPromise(tx);

  await Promise.all([
    requestToPromise(tx.objectStore(RECORDS).clear()),
    requestToPromise(tx.objectStore(SETTINGS).clear()),
    requestToPromise(tx.objectStore(CUSTOM_WORDS).clear())
  ]);
  await completion;
  db.close();
}
