import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Star } from 'lucide-react';
import { AddWordDialog } from '../components/AddWordDialog';
import { PageHeader } from '../components/PageHeader';
import { filterWords } from '../domain/library';
import type { NewWordInput, StudyRecord, WordEntry, WordSource } from '../domain/types';

export type LibraryMode = 'all' | 'favorites' | 'add';

interface VocabularyScreenProps {
  words: WordEntry[];
  records: StudyRecord[];
  initialMode?: LibraryMode;
  onToggleFavorite: (wordId: string) => void;
  onAddWord: (word: NewWordInput) => void;
}

const sourceOptions: Array<{ value: WordSource | 'all'; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'ielts', label: '雅思' },
  { value: 'custom', label: '自定义' }
];

export function VocabularyScreen({
  words,
  records,
  initialMode = 'all',
  onToggleFavorite,
  onAddWord
}: VocabularyScreenProps) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<WordSource | 'all'>('all');
  const [topic, setTopic] = useState<string | 'all'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(initialMode === 'favorites');
  const [showAddWord, setShowAddWord] = useState(initialMode === 'add');

  useEffect(() => {
    setFavoritesOnly(initialMode === 'favorites');
    setShowAddWord(initialMode === 'add');
  }, [initialMode]);

  const topics = useMemo(
    () => Array.from(new Set(words.map((word) => word.topic))).sort((a, b) => a.localeCompare(b, 'zh-CN')),
    [words]
  );
  const recordByWordId = useMemo(() => new Map(records.map((record) => [record.wordId, record])), [records]);
  const filteredWords = useMemo(
    () => filterWords(words, records, { query, source, topic, favoritesOnly }),
    [favoritesOnly, query, records, source, topic, words]
  );

  return (
    <section className="screen library-screen">
      <PageHeader
        title="雅思词库"
        subtitle={`${words.length} 个单词，只保存在本机`}
        action={
          <button className="header-action" type="button" aria-label="添加单词" onClick={() => setShowAddWord(true)}>
            <Plus size={20} aria-hidden="true" />
          </button>
        }
      />

      <div className="search-wrap">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          aria-label="搜索单词"
          placeholder="搜索英文或中文释义"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="library-filters">
        <div className="segmented-control" aria-label="词库来源">
          {sourceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={source === option.value ? 'active' : ''}
              aria-pressed={source === option.value}
              onClick={() => setSource(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <button
          className={`favorite-filter ${favoritesOnly ? 'active' : ''}`}
          type="button"
          aria-pressed={favoritesOnly}
          onClick={() => setFavoritesOnly((current) => !current)}
        >
          <Star size={16} fill={favoritesOnly ? 'currentColor' : 'none'} aria-hidden="true" />
          只看收藏
        </button>
      </div>

      <div className="topic-scroller" aria-label="单词分类">
        <button className={topic === 'all' ? 'active' : ''} type="button" onClick={() => setTopic('all')}>全部分类</button>
        {topics.map((item) => (
          <button key={item} className={topic === item ? 'active' : ''} type="button" onClick={() => setTopic(item)}>
            {item}
          </button>
        ))}
      </div>

      <div className="library-count">显示 {filteredWords.length} 个单词</div>
      {filteredWords.length > 0 ? (
        <div className="word-list">
          {filteredWords.map((word) => {
            const record = recordByWordId.get(word.id);
            const favorite = record?.favorite === true;
            return (
              <article className="word-row" key={word.id}>
                <div className="word-copy">
                  <div className="word-title-line">
                    <strong>{word.word}</strong>
                    <span className={`source-tag source-tag--${word.source}`}>{word.source === 'custom' ? '自定义' : word.topic}</span>
                  </div>
                  <p>{word.meaningZh}</p>
                  <small>{record?.seen ? '已学习' : '未学习'}</small>
                </div>
                <button
                  className={`favorite-button ${favorite ? 'active' : ''}`}
                  type="button"
                  aria-label={`${favorite ? '取消收藏' : '收藏'} ${word.word}`}
                  onClick={() => onToggleFavorite(word.id)}
                >
                  <Star size={20} fill={favorite ? 'currentColor' : 'none'} aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={28} aria-hidden="true" />
          <strong>没有找到匹配的单词</strong>
          <span>换个关键词或筛选条件试试</span>
        </div>
      )}

      {showAddWord && (
        <AddWordDialog
          onClose={() => setShowAddWord(false)}
          onSave={onAddWord}
        />
      )}
    </section>
  );
}
