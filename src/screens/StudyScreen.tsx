import { useMemo, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { WordCard } from '../components/WordCard';
import { buildChoiceOptions, checkChoiceAnswer, checkSpellingAnswer, chooseExerciseKind } from '../domain/exercises';
import { applyReviewResult, createNewRecord } from '../domain/scheduler';
import type { ExerciseKind, RecallRating, StudyRecord, WordEntry } from '../domain/types';

interface StudyScreenProps {
  words: WordEntry[];
  records: StudyRecord[];
  onFinish: (updatedRecords: StudyRecord[]) => void;
}

interface Feedback {
  kind: 'choice' | 'spelling';
  correct: boolean;
  selected?: string;
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
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [localRecords, setLocalRecords] = useState(records);
  const today = getToday();
  const word = words[index];

  const recordByWordId = useMemo(
    () => new Map(localRecords.map((record) => [record.wordId, record])),
    [localRecords]
  );
  const choiceOptions = useMemo(() => (word ? buildChoiceOptions(word, words) : []), [word, words]);

  if (!word) {
    return (
      <section className="screen study-complete">
        <CheckCircle2 size={42} aria-hidden="true" />
        <h1>今日完成</h1>
        <p>这组单词已经学习完毕。</p>
        <button className="primary-button" type="button" onClick={() => onFinish(localRecords)}>
          返回今日
        </button>
      </section>
    );
  }

  const currentRecord = recordByWordId.get(word.id);
  const exerciseKind = feedback?.kind ?? chooseExerciseKind(currentRecord);
  const progress = Math.round(((index + 1) / words.length) * 100);

  function reviewedRecords(kind: ExerciseKind, correct: boolean, rating: RecallRating) {
    const existing = recordByWordId.get(word.id) ?? createNewRecord(word.id, today);
    const nextRecord = applyReviewResult(existing, { kind, rating, correct }, today);
    return localRecords.filter((record) => record.wordId !== word.id).concat(nextRecord);
  }

  function resetQuestion() {
    setRevealed(false);
    setSpellingAnswer('');
    setFeedback(null);
  }

  function advance(nextRecords: StudyRecord[]) {
    if (index + 1 >= words.length) {
      onFinish(nextRecords);
      return;
    }
    setIndex((current) => current + 1);
    resetQuestion();
  }

  function completeImmediately(kind: ExerciseKind, correct: boolean, rating: RecallRating) {
    const nextRecords = reviewedRecords(kind, correct, rating);
    setLocalRecords(nextRecords);
    advance(nextRecords);
  }

  function answerWithFeedback(kind: Feedback['kind'], correct: boolean, selected?: string) {
    const nextRecords = reviewedRecords(kind, correct, correct ? 'good' : 'again');
    setLocalRecords(nextRecords);
    setFeedback({ kind, correct, selected });
  }

  function submitSpelling() {
    if (!spellingAnswer.trim() || feedback) return;
    answerWithFeedback('spelling', checkSpellingAnswer(spellingAnswer, word.word));
  }

  return (
    <section className="screen study-screen">
      <header className="study-progress-header">
        <span>{index + 1} / {words.length}</span>
        <strong>{exerciseKind === 'flashcard' ? '单词卡' : exerciseKind === 'choice' ? '选择释义' : '拼写练习'}</strong>
        <span>{progress}%</span>
      </header>
      <div className="study-progress" aria-label={`学习进度 ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      {exerciseKind === 'flashcard' && (
        <>
          <WordCard word={word} revealed={revealed} onReveal={() => setRevealed(true)} />
          {revealed && (
            <div className="answer-grid">
              <button type="button" onClick={() => completeImmediately('flashcard', false, 'again')}>不认识</button>
              <button type="button" onClick={() => completeImmediately('flashcard', true, 'hard')}>模糊</button>
              <button type="button" onClick={() => completeImmediately('flashcard', true, 'good')}>认识</button>
            </div>
          )}
        </>
      )}

      {exerciseKind === 'choice' && (
        <article className="exercise-card">
          <div className="exercise-word">
            <h1>{word.word}</h1>
            <p className="word-meta">{word.phonetic} · {word.pos}</p>
          </div>
          <h2>选择正确释义</h2>
          <div className="choice-list">
            {choiceOptions.map((option, optionIndex) => {
              const isCorrect = feedback && option === word.meaningZh;
              const isWrongSelection = feedback && !feedback.correct && feedback.selected === option;
              return (
                <button
                  key={`${option}-${optionIndex}`}
                  className={isCorrect ? 'correct' : isWrongSelection ? 'incorrect' : ''}
                  type="button"
                  disabled={Boolean(feedback)}
                  onClick={() => answerWithFeedback('choice', checkChoiceAnswer(option, word), option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {feedback && (
            <AnswerFeedback
              correct={feedback.correct}
              title={feedback.correct ? '回答正确' : '再记一下'}
              detail={`${word.word}：${word.meaningZh}`}
              onNext={() => advance(localRecords)}
            />
          )}
        </article>
      )}

      {exerciseKind === 'spelling' && (
        <article className="exercise-card spelling-card">
          <div className="spelling-prompt">
            <span>根据释义拼写单词</span>
            <h1>{word.meaningZh}</h1>
            {word.exampleEn && <p className="example-zh">{word.exampleEn}</p>}
          </div>
          <label className="field-label">
            英文拼写
            <input
              aria-label="英文拼写"
              value={spellingAnswer}
              disabled={Boolean(feedback)}
              onChange={(event) => setSpellingAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submitSpelling();
              }}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </label>
          {!feedback && (
            <button className="primary-button" type="button" disabled={!spellingAnswer.trim()} onClick={submitSpelling}>
              提交
            </button>
          )}
          {feedback && (
            <AnswerFeedback
              correct={feedback.correct}
              title={feedback.correct ? '拼写正确' : '再记一下'}
              detail={feedback.correct ? word.exampleZh || word.meaningZh : `正确答案：${word.word}`}
              onNext={() => advance(localRecords)}
            />
          )}
        </article>
      )}
    </section>
  );
}

function AnswerFeedback({
  correct,
  title,
  detail,
  onNext
}: {
  correct: boolean;
  title: string;
  detail: string;
  onNext: () => void;
}) {
  const Icon = correct ? CheckCircle2 : XCircle;
  return (
    <div className={`answer-feedback ${correct ? 'correct' : 'incorrect'}`} role="status">
      <div className="feedback-copy">
        <Icon size={22} aria-hidden="true" />
        <div>
          <strong>{title}</strong>
          <span>{detail}</span>
        </div>
      </div>
      <button className="primary-button" type="button" onClick={onNext}>下一题</button>
    </div>
  );
}
