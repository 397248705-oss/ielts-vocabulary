import { useMemo, useState } from 'react';
import type { StudyRecord, WordEntry } from '../domain/types';

interface VocabularyScreenProps {
  words: WordEntry[];
  records: StudyRecord[];
}

export function VocabularyScreen({ words, records }: VocabularyScreenProps) {
  const [query, setQuery] = useState('');
  const recordByWordId = useMemo(() => new Map(records.map((record) => [record.wordId, record])), [records]);
  const filteredWords = words.filter((word) => word.word.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="screen">
      <h1>雅思词库</h1>
      <input
        className="search-input"
        aria-label="搜索单词"
        placeholder="搜索英文单词"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="word-list">
        {filteredWords.map((word) => {
          const record = recordByWordId.get(word.id);

          return (
            <article className="word-row" key={word.id}>
              <div>
                <strong>{word.word}</strong>
                <p>{word.meaningZh}</p>
              </div>
              <span>{record?.seen ? '已学习' : '未学习'}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
