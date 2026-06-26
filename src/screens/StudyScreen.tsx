import { useMemo, useState } from 'react';
import { WordCard } from '../components/WordCard';
import { buildChoiceOptions, checkChoiceAnswer, checkSpellingAnswer, chooseExerciseKind } from '../domain/exercises';
import { applyReviewResult, createNewRecord } from '../domain/scheduler';
import type { ExerciseKind, RecallRating, StudyRecord, WordEntry } from '../domain/types';

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
  const [spellingAnswer, setSpellingAnswer] = useState('');
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

  const currentRecord = recordByWordId.get(word.id);
  const exerciseKind = chooseExerciseKind(currentRecord);

  function complete(kind: ExerciseKind, correct: boolean, rating: RecallRating) {
    const currentRecord = recordByWordId.get(word.id) ?? createNewRecord(word.id, today);
    const nextRecord = applyReviewResult(
      currentRecord,
      { kind, rating, correct },
      today
    );
    const nextRecords = localRecords.filter((record) => record.wordId !== word.id).concat(nextRecord);
    const nextIndex = index + 1;

    setLocalRecords(nextRecords);
    setRevealed(false);
    setSpellingAnswer('');

    if (nextIndex >= words.length) {
      onFinish(nextRecords);
      return;
    }

    setIndex(nextIndex);
  }

  function submitSpelling() {
    const correct = checkSpellingAnswer(spellingAnswer, word.word);
    complete('spelling', correct, correct ? 'good' : 'again');
  }

  return (
    <section className="screen study-screen">
      <p className="session-count">
        {index + 1} / {words.length}
      </p>

      {exerciseKind === 'flashcard' && (
        <>
          <WordCard word={word} revealed={revealed} onReveal={() => setRevealed(true)} />
          {revealed && (
            <div className="answer-grid">
              <button type="button" onClick={() => complete('flashcard', false, 'again')}>
                不认识
              </button>
              <button type="button" onClick={() => complete('flashcard', true, 'hard')}>
                模糊
              </button>
              <button type="button" onClick={() => complete('flashcard', true, 'good')}>
                认识
              </button>
            </div>
          )}
        </>
      )}

      {exerciseKind === 'choice' && (
        <article className="exercise-card">
          <h1>{word.word}</h1>
          <p className="word-meta">
            {word.phonetic} · {word.pos}
          </p>
          <h2>选择正确释义</h2>
          <div className="choice-list">
            {buildChoiceOptions(word, words).map((option, optionIndex) => (
              <button
                key={`${option}-${optionIndex}`}
                type="button"
                onClick={() => {
                  const correct = checkChoiceAnswer(option, word);
                  complete('choice', correct, correct ? 'good' : 'again');
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </article>
      )}

      {exerciseKind === 'spelling' && (
        <article className="exercise-card">
          <h1>输入英文单词</h1>
          <p>{word.meaningZh}</p>
          <p className="example-zh">{word.exampleEn}</p>
          <label className="field-label">
            英文拼写
            <input
              aria-label="英文拼写"
              value={spellingAnswer}
              onChange={(event) => setSpellingAnswer(event.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </label>
          <button className="primary-button" type="button" onClick={submitSpelling}>
            提交
          </button>
        </article>
      )}
    </section>
  );
}
