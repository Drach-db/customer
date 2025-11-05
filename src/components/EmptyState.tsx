'use client';

import { LucideIcon } from 'lucide-react';
import { TEXT_COLORS } from '@/lib/constants/colors';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconSize?: 'sm' | 'md' | 'lg';
}

const ICON_SIZES = {
  sm: { container: 'w-16 h-16', icon: 'w-7 h-7' },
  md: { container: 'w-20 h-20', icon: 'w-9 h-9' },
  lg: { container: 'w-24 h-24', icon: 'w-11 h-11' },
} as const;

export default function EmptyState({
  icon: Icon,
  title,
  description,
  iconSize = 'md'
}: EmptyStateProps) {
  const sizes = ICON_SIZES[iconSize];

  return (
    <div className="flex-1 panel flex-center">
      <div className="text-center px-8">
        <div className={`inline-flex items-center justify-center ${sizes.container} rounded-full mb-4 placeholder-bg`}>
          <Icon className={`${sizes.icon} placeholder-icon`} strokeWidth={1.5} />
        </div>
        <p className={`text-base font-medium ${TEXT_COLORS.primary} mb-1`}>{title}</p>
        <p className={`text-sm ${TEXT_COLORS.secondary}`}>{description}</p>
      </div>
    </div>
  );
}
