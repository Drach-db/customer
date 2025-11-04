// Shared color constants for consistent design
export const TEXT_COLORS = {
  primary: 'text-gray-700 dark:text-gray-200', // #374151 - Notion-style main text
  secondary: 'text-gray-500 dark:text-gray-400', // Secondary/muted text
  tertiary: 'text-gray-400 dark:text-gray-500', // Placeholder/icon text
} as const;

export const SHARED_CLASSES = {
  hover: 'hover-peach',
  transition: 'transition-colors',
  avatar: 'flex items-center justify-center font-semibold',
  border: 'border border-gray-200 dark:border-gray-700',
  input: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg',
  card: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm',
  panel: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl',
} as const;

// Avatar color variants
export const AVATAR_COLORS = [
  'avatar-warm-cream',
  'avatar-soft-green',
  'avatar-soft-blue',
  'avatar-soft-amber',
  'avatar-soft-gray',
  'avatar-soft-purple',
  'avatar-soft-pink',
] as const;

/**
 * Get consistent avatar color based on string (e.g., name or ID)
 */
export function getAvatarColor(str: string): string {
  const hash = str.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}
