import { CheckCircle2, CircleAlert } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { getActiveMistakes } from '../domain/mistakes';
import type { StudyRecord, WordEntry } from '../domain/types';

interface MistakesScreenProps {
  words: WordEntry[];
  records: StudyRecord[];
  onStart: () => void;
  onMarkMastered: (wordId: string) => void;
}

export function MistakesScreen({ words, records, onStart, onMarkMastered }: MistakesScreenProps) {
  const wordById = new Map(words.map((word) => [word.id, word]));
  const mistakes = getActiveMistakes(records)
    .map((record) => ({ record, word: wordById.get(record.wordId) }))
    .filter((item): item is { record: StudyRecord; word: WordEntry } => Boolean(item.word));

  return (
    <section className="screen mistakes-screen">
      <PageHeader title="错题本" subtitle={`${mistakes.length} 个单词需要巩固`} />

      {mistakes.length > 0 ? (
        <>
          <div className="mistake-list">
            {mistakes.map(({ record, word }) => (
              <article className="mistake-row" key={word.id}>
                <div className="mistake-icon" aria-hidden="true">
                  <CircleAlert size={19} />
                </div>
                <div className="mistake-copy">
                  <strong>{word.word}</strong>
                  <span>{word.meaningZh}</span>
                  <small>错 {record.errorCount} 次</small>
                </div>
                <button
                  className="mastered-button"
                  type="button"
                  aria-label={`标记已掌握 ${word.word}`}
                  onClick={() => onMarkMastered(word.id)}
                >
                  <CheckCircle2 size={20} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
          <button className="primary-button mistake-review-button" type="button" onClick={onStart}>
            复习全部错题
          </button>
        </>
      ) : (
        <div className="empty-state mistakes-empty">
          <CheckCircle2 size={34} aria-hidden="true" />
          <strong>暂时没有需要复习的错题</strong>
          <span>继续保持，答错的单词会自动出现在这里</span>
        </div>
      )}
    </section>
  );
}
