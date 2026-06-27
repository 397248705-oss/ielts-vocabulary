import { PageHeader } from '../components/PageHeader';
import { calculateStats } from '../domain/stats';
import type { StudyRecord } from '../domain/types';

interface StatsScreenProps {
  records: StudyRecord[];
  today?: string;
}

export function StatsScreen({ records, today }: StatsScreenProps) {
  const stats = calculateStats(records, today);
  const maxAnswers = Math.max(1, ...stats.recentActivity.map((item) => item.answers));

  return (
    <section className="screen stats-screen">
      <PageHeader title="学习进度" subtitle="每一次练习都算数" />

      <div className="stats-grid">
        <div><span>已学习</span><strong>{stats.seenCount}</strong><small>个单词</small></div>
        <div><span>已掌握</span><strong>{stats.masteredCount}</strong><small>个单词</small></div>
        <div><span>错题</span><strong>{stats.mistakeWordCount}</strong><small>待巩固</small></div>
        <div><span>连续学习</span><strong>{stats.streakDays}</strong><small>天</small></div>
      </div>

      <section className="progress-section" aria-labelledby="accuracy-title">
        <div className="section-heading-row">
          <h2 id="accuracy-title">答题正确率</h2>
          <strong>{stats.accuracy}%</strong>
        </div>
        <div className="completion-bar"><span style={{ width: `${stats.accuracy}%` }} /></div>
        <p>{stats.correctAnswers} / {stats.totalAnswers} 次回答正确</p>
      </section>

      <section className="activity-section" aria-labelledby="activity-title">
        <div className="section-heading-row">
          <h2 id="activity-title">近 7 天学习趋势</h2>
          <span>{stats.totalAnswers} 次累计</span>
        </div>
        <div className="activity-chart" role="img" aria-label="近 7 天学习趋势">
          {stats.recentActivity.map((item) => (
            <div className="activity-column" key={item.date}>
              <span className="activity-value">{item.answers}</span>
              <div className="activity-track">
                <span style={{ height: `${Math.max(6, (item.answers / maxAnswers) * 100)}%` }} />
              </div>
              <small>{item.date.slice(5).replace('-', '/')}</small>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
