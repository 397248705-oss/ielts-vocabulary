export function SettingsScreen() {
  return (
    <section className="screen">
      <h1>设置</h1>
      <label className="field-label">
        每日新词数
        <input aria-label="每日新词数" type="number" min="1" max="100" defaultValue="20" />
      </label>
    </section>
  );
}
