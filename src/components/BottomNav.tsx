import { BookOpen, ChartNoAxesColumnIncreasing, CircleX, House, Settings } from 'lucide-react';

export type TabId = 'today' | 'vocabulary' | 'mistakes' | 'stats' | 'settings';

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const tabs = [
  { id: 'today' as const, label: '今日', icon: House },
  { id: 'vocabulary' as const, label: '词库', icon: BookOpen },
  { id: 'mistakes' as const, label: '错题', icon: CircleX },
  { id: 'stats' as const, label: '统计', icon: ChartNoAxesColumnIncreasing },
  { id: 'settings' as const, label: '设置', icon: Settings }
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={active === id ? 'nav-item active' : 'nav-item'}
          onClick={() => onChange(id)}
          aria-current={active === id ? 'page' : undefined}
        >
          <Icon size={20} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
