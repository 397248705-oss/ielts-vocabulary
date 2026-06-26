import { Volume2 } from 'lucide-react';
import type { WordEntry } from '../domain/types';
import { canSpeak, speakWord } from '../platform/speech';

interface WordCardProps {
  word: WordEntry;
  revealed: boolean;
  onReveal: () => void;
}

export function WordCard({ word, revealed, onReveal }: WordCardProps) {
  const speechSupported = canSpeak();

  return (
    <article className="word-card">
      <div className="word-card-top">
        <div>
          <p className="word-text">{word.word}</p>
          <p className="word-meta">
            {word.phonetic} · {word.pos}
          </p>
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label="播放发音"
          disabled={!speechSupported}
          onClick={() => speakWord(word.word)}
        >
          <Volume2 size={22} aria-hidden="true" />
        </button>
      </div>

      {revealed ? (
        <div className="word-details">
          <p className="meaning">{word.meaningZh}</p>
          <p>{word.exampleEn}</p>
          <p className="example-zh">{word.exampleZh}</p>
        </div>
      ) : (
        <button type="button" className="secondary-button" onClick={onReveal}>
          查看释义
        </button>
      )}
    </article>
  );
}
