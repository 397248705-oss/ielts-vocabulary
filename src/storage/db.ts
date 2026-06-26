import type { StudyRecord, UserSettings } from '../domain/types';

const DB_NAME = 'ielts-vocabulary-pwa';
const DB_VERSION = 1;
const RECORDS = 'records';
const SETTINGS = 'settings';

const defaultSettings: UserSettings = { dailyNewWords: 20 };

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
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
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getRecords(): Promise<StudyRecord[]> {
  const db = await openDatabase();
  const tx = db.transaction(RECORDS, 'readonly');
  return requestToPromise(tx.objectStore(RECORDS).getAll());
}

export async function saveRecord(record: StudyRecord): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(RECORDS, 'readwrite');
  await requestToPromise(tx.objectStore(RECORDS).put(record));
}

export async function saveRecords(records: StudyRecord[]): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(RECORDS, 'readwrite');
  await Promise.all(records.map((record) => requestToPromise(tx.objectStore(RECORDS).put(record))));
}

export async function getSettings(): Promise<UserSettings> {
  const db = await openDatabase();
  const tx = db.transaction(SETTINGS, 'readonly');
  const settings = await requestToPromise<UserSettings | undefined>(tx.objectStore(SETTINGS).get('user'));
  return settings ?? defaultSettings;
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(SETTINGS, 'readwrite');
  await requestToPromise(tx.objectStore(SETTINGS).put(settings, 'user'));
}

export async function clearLocalData(): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction([RECORDS, SETTINGS], 'readwrite');

  await Promise.all([
    requestToPromise(tx.objectStore(RECORDS).clear()),
    requestToPromise(tx.objectStore(SETTINGS).clear())
  ]);
}
