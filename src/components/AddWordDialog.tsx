import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import type { NewWordInput } from '../domain/types';

interface AddWordDialogProps {
  onClose: () => void;
  onSave: (word: NewWordInput) => void;
}

export function AddWordDialog({ onClose, onSave }: AddWordDialogProps) {
  const [word, setWord] = useState('');
  const [meaningZh, setMeaningZh] = useState('');
  const [pos, setPos] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [exampleEn, setExampleEn] = useState('');
  const [exampleZh, setExampleZh] = useState('');
  const [topic, setTopic] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      word: word.trim(),
      meaningZh: meaningZh.trim(),
      pos: pos.trim(),
      phonetic: phonetic.trim(),
      exampleEn: exampleEn.trim(),
      exampleZh: exampleZh.trim(),
      topic: topic.trim() || '自定义'
    });
    onClose();
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="dialog-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-word-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="dialog-header">
          <div>
            <h2 id="add-word-title">添加单词</h2>
            <p>保存后会自动加入每日新词候选</p>
          </div>
          <button className="icon-button" type="button" aria-label="关闭" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <form className="add-word-form" onSubmit={submit}>
          <label className="field-label">
            英文单词
            <input required autoFocus value={word} onChange={(event) => setWord(event.target.value)} />
          </label>
          <label className="field-label">
            中文释义
            <input required value={meaningZh} onChange={(event) => setMeaningZh(event.target.value)} />
          </label>
          <div className="form-pair">
            <label className="field-label">
              词性
              <input placeholder="如 n. / v." value={pos} onChange={(event) => setPos(event.target.value)} />
            </label>
            <label className="field-label">
              音标
              <input value={phonetic} onChange={(event) => setPhonetic(event.target.value)} />
            </label>
          </div>
          <label className="field-label">
            分类
            <input placeholder="如生活、教育" value={topic} onChange={(event) => setTopic(event.target.value)} />
          </label>
          <label className="field-label">
            英文例句
            <textarea rows={2} value={exampleEn} onChange={(event) => setExampleEn(event.target.value)} />
          </label>
          <label className="field-label">
            例句翻译
            <textarea rows={2} value={exampleZh} onChange={(event) => setExampleZh(event.target.value)} />
          </label>
          <button className="primary-button" type="submit">保存单词</button>
        </form>
      </section>
    </div>
  );
}
