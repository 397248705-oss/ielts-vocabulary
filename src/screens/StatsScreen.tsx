import { calculateStats } from '../domain/stats';
import type { StudyRecord } from '../domain/types';

interface StatsScreenProps {
  records: StudyRecord[];
}

export function StatsScreen({ records }: StatsScreenProps) {
  const stats = calculateStats(records);

  return (
    <section className="screen">
      <h1>学习统计</h1>
      <div className="stats-grid">
        <div>
          <strong>{stats.seenCount}</strong>
          <span>已学习</span>
        </div>
        <div>
          <strong>{stats.masteredCount}</strong>
          <span>已掌握</span>
        </div>
        <div>
          <strong>{stats.accuracy}%</strong>
          <span>正确率</span>
        </div>
      </div>
    </section>
  );
}
