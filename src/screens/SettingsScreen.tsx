import { useEffect, useState } from 'react';
import { Download, Minus, Plus, ShieldCheck, Trash2, Upload } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import type { UserSettings } from '../domain/types';

interface SettingsScreenProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onClear: () => void;
}

function clampDailyWords(value: number): number {
  return Math.max(1, Math.min(100, Math.round(value)));
}

export function SettingsScreen({
  settings,
  onSettingsChange,
  onExport,
  onImport,
  onClear
}: SettingsScreenProps) {
  const [draft, setDraft] = useState(String(settings.dailyNewWords));

  useEffect(() => setDraft(String(settings.dailyNewWords)), [settings.dailyNewWords]);

  function commitDraft() {
    const parsed = Number(draft);
    const nextValue = clampDailyWords(Number.isFinite(parsed) && parsed > 0 ? parsed : settings.dailyNewWords);
    setDraft(String(nextValue));
    if (nextValue !== settings.dailyNewWords) onSettingsChange({ dailyNewWords: nextValue });
  }

  function step(amount: number) {
    const nextValue = clampDailyWords(settings.dailyNewWords + amount);
    setDraft(String(nextValue));
    if (nextValue !== settings.dailyNewWords) onSettingsChange({ dailyNewWords: nextValue });
  }

  return (
    <section className="screen settings-screen">
      <PageHeader title="设置" subtitle="调整学习节奏与本地数据" />

      <section className="settings-group" aria-labelledby="daily-goal-title">
        <div className="settings-group-heading">
          <div>
            <h2 id="daily-goal-title">每日学习</h2>
            <span>新词数量</span>
          </div>
        </div>
        <div className="goal-stepper">
          <button type="button" aria-label="减少每日新词" onClick={() => step(-1)}>
            <Minus size={20} aria-hidden="true" />
          </button>
          <label>
            <input
              aria-label="每日新词数"
              type="number"
              inputMode="numeric"
              min="1"
              max="100"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={commitDraft}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.currentTarget.blur();
              }}
            />
            <span>个新词</span>
          </label>
          <button type="button" aria-label="增加每日新词" onClick={() => step(1)}>
            <Plus size={20} aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="settings-group" aria-labelledby="data-title">
        <div className="settings-group-heading">
          <div>
            <h2 id="data-title">数据备份</h2>
            <span>导出或恢复全部学习记录</span>
          </div>
        </div>
        <div className="settings-actions">
          <button type="button" aria-label="导出备份" onClick={onExport}>
            <Download size={19} aria-hidden="true" />
            <span><strong>导出备份</strong><small>保存为 JSON 文件</small></span>
          </button>
          <label aria-label="导入备份">
            <Upload size={19} aria-hidden="true" />
            <span><strong>导入备份</strong><small>恢复本机学习数据</small></span>
            <input
              type="file"
              accept="application/json"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onImport(file);
                event.target.value = '';
              }}
            />
          </label>
        </div>
      </section>

      <div className="local-data-note">
        <ShieldCheck size={20} aria-hidden="true" />
        <span><strong>仅保存在此浏览器</strong><small>单词和进度不会上传到服务器</small></span>
      </div>

      <section className="settings-group danger-zone" aria-labelledby="danger-title">
        <div className="settings-group-heading">
          <div>
            <h2 id="danger-title">重置数据</h2>
            <span>此操作无法撤销</span>
          </div>
        </div>
        <button type="button" className="clear-data-button" onClick={onClear}>
          <Trash2 size={19} aria-hidden="true" />
          清空本地数据
        </button>
      </section>
    </section>
  );
}
