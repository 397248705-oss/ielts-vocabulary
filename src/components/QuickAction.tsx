import type { LucideIcon } from 'lucide-react';

interface QuickActionProps {
  label: string;
  detail: string;
  icon: LucideIcon;
  tone: 'blue' | 'red' | 'green' | 'purple';
  onClick: () => void;
}

export function QuickAction({ label, detail, icon: Icon, tone, onClick }: QuickActionProps) {
  return (
    <button type="button" className="quick-action" aria-label={label} onClick={onClick}>
      <span className={`quick-action-icon tone-${tone}`}>
        <Icon size={19} aria-hidden="true" />
      </span>
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
    </button>
  );
}
