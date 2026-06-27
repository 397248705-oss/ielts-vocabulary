import { BookOpenCheck, CircleX, Plus, Star } from 'lucide-react';
import { QuickAction } from '../components/QuickAction';
import type { StudyStats } from '../domain/stats';

interface HomeScreenProps {
  dueCount: number;
  newCount: number;
  stats: StudyStats;
  onStart: () => void;
  onReviewMistakes: () => void;
  onOpenFavorites: () => void;
  onAddWord: () => void;
}

export function HomeScreen({
  dueCount,
  newCount,
  stats,
  onStart,
  onReviewMistakes,
  onOpenFavorites,
  onAddWord
}: HomeScreenProps) {
  const todayAnswers = stats.recentActivity.at(-1)?.answers ?? 0;
  const taskTotal = dueCount + newCount;
  const progress = taskTotal === 0 ? 100 : Math.min(100, Math.round((todayAnswers / taskTotal) * 100));

  return (
    <section className="screen home-screen">
      <header className="home-header">
        <div className="app-brand">雅思单词本</div>
        <div className="streak-badge" aria-label={`连续学习 ${stats.streakDays} 天`}>
          <span>{stats.streakDays}</span> 天连续
        </div>
      </header>

      <div className="home-greeting">
        <h1>今天也要向目标靠近</h1>
        <p>保持节奏，每天记住一点点。</p>
      </div>

      <article className="daily-summary">
        <div className="daily-summary-label">今日学习目标</div>
        <div className="daily-summary-counts">
          <div aria-label={`新词 ${newCount} 个`}>
            <strong>{newCount}</strong>
            <span>新词</span>
          </div>
          <div aria-label={`待复习 ${dueCount} 个`}>
            <strong>{dueCount}</strong>
            <span>待复习</span>
          </div>
          <div>
            <strong>{progress}%</strong>
            <span>已完成</span>
          </div>
        </div>
        <div className="summary-progress" aria-label={`今日进度 ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <button type="button" className="summary-start" onClick={onStart}>
          开始学习
        </button>
      </article>

      <section className="home-section" aria-labelledby="quick-actions-title">
        <h2 id="quick-actions-title">快捷入口</h2>
        <div className="quick-action-grid">
          <QuickAction label="开始学习" detail={`${taskTotal} 个任务`} icon={BookOpenCheck} tone="blue" onClick={onStart} />
          <QuickAction label="复习错题" detail={`${stats.mistakeWordCount} 个待巩固`} icon={CircleX} tone="red" onClick={onReviewMistakes} />
          <QuickAction label="我的收藏" detail={`${stats.favoriteCount} 个单词`} icon={Star} tone="green" onClick={onOpenFavorites} />
          <QuickAction label="添加单词" detail="加入每日计划" icon={Plus} tone="purple" onClick={onAddWord} />
        </div>
      </section>

      <section className="home-section" aria-labelledby="overview-title">
        <h2 id="overview-title">学习概览</h2>
        <div className="overview-grid">
          <div><span>总学习单词</span><strong>{stats.seenCount}</strong></div>
          <div><span>已掌握</span><strong>{stats.masteredCount}</strong></div>
          <div><span>连续学习</span><strong>{stats.streakDays} 天</strong></div>
          <div><span>正确率</span><strong>{stats.accuracy}%</strong></div>
        </div>
      </section>
    </section>
  );
}
