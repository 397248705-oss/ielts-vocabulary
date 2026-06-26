import type { UserSettings } from '../domain/types';

interface SettingsScreenProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onClear: () => void;
}

export function SettingsScreen({
  settings,
  onSettingsChange,
  onExport,
  onImport,
  onClear
}: SettingsScreenProps) {
  return (
    <section className="screen">
      <h1>设置</h1>
      <label className="field-label">
        每日新词数
        <input
          aria-label="每日新词数"
          type="number"
          min="1"
          max="100"
          value={settings.dailyNewWords}
          onChange={(event) => onSettingsChange({ dailyNewWords: Number(event.target.value) })}
        />
      </label>
      <button type="button" className="secondary-button" onClick={onExport}>
        导出学习记录
      </button>
      <label className="secondary-button import-button">
        导入学习记录
        <input
          type="file"
          accept="application/json"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onImport(file);
            }
          }}
        />
      </label>
      <button type="button" className="danger-button" onClick={onClear}>
        清空本地数据
      </button>
    </section>
  );
}
