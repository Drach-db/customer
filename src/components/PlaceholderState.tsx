import { LucideIcon } from 'lucide-react';
import { TEXT_COLORS } from '@/lib/constants/colors';

interface PlaceholderStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  animateIcon?: boolean;
  width?: 'w-96' | 'flex-1';
  children?: React.ReactNode;
}

export default function PlaceholderState({
  icon: Icon,
  title,
  description,
  animateIcon = false,
  width = 'flex-1',
  children
}: PlaceholderStateProps) {
  const containerClasses = width === 'w-96'
    ? 'w-96 panel flex-center'
    : 'flex-1 panel flex-center';

  return (
    <div className={containerClasses}>
      <div className="text-center px-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 placeholder-bg">
          <Icon className={`w-9 h-9 placeholder-icon ${animateIcon ? 'animate-spin' : ''}`} strokeWidth={1.5} />
        </div>
        <p className={`text-base font-medium ${TEXT_COLORS.primary} mb-1`}>{title}</p>
        <p className={`text-sm ${TEXT_COLORS.secondary}`}>{description}</p>
        {children}
      </div>
    </div>
  );
}