import { useMemo, useState } from 'react';
import { WordCard } from '../components/WordCard';
import { applyReviewResult, createNewRecord } from '../domain/scheduler';
import type { RecallRating, StudyRecord, WordEntry } from '../domain/types';

interface StudyScreenProps {
  words: WordEntry[];
  records: StudyRecord[];
  onFinish: (updatedRecords: StudyRecord[]) => void;
}

function getToday(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

export function StudyScreen({ words, records, onFinish }: StudyScreenProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [localRecords, setLocalRecords] = useState(records);
  const today = getToday();
  const word = words[index];

  const recordByWordId = useMemo(
    () => new Map(localRecords.map((record) => [record.wordId, record])),
    [localRecords]
  );

  if (!word) {
    return (
      <section className="screen">
        <h1>今日完成</h1>
        <button className="primary-button" type="button" onClick={() => onFinish(localRecords)}>
          返回今日
        </button>
      </section>
    );
  }

  function answer(rating: RecallRating) {
    const currentRecord = recordByWordId.get(word.id) ?? createNewRecord(word.id, today);
    const nextRecord = applyReviewResult(
      currentRecord,
      { kind: 'flashcard', rating, correct: rating !== 'again' },
      today
    );
    const nextRecords = localRecords.filter((record) => record.wordId !== word.id).concat(nextRecord);
    const nextIndex = index + 1;

    setLocalRecords(nextRecords);
    setRevealed(false);

    if (nextIndex >= words.length) {
      onFinish(nextRecords);
      return;
    }

    setIndex(nextIndex);
  }

  return (
    <section className="screen study-screen">
      <p className="session-count">
        {index + 1} / {words.length}
      </p>
      <WordCard word={word} revealed={revealed} onReveal={() => setRevealed(true)} />
      {revealed && (
        <div className="answer-grid">
          <button type="button" onClick={() => answer('again')}>
            不认识
          </button>
          <button type="button" onClick={() => answer('hard')}>
            模糊
          </button>
          <button type="button" onClick={() => answer('good')}>
            认识
          </button>
        </div>
      )}
    </section>
  );
}
