interface HomeScreenProps {
  onStart: () => void;
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <section className="screen">
      <h1>今日任务</h1>
      <div className="dashboard-card">
        <p>待复习 0 个</p>
        <p>新词目标 20 个</p>
        <button className="primary-button" type="button" onClick={onStart}>
          开始学习
        </button>
      </div>
    </section>
  );
}
