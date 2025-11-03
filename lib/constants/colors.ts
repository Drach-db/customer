// Shared color constants for consistent design
export const TEXT_COLORS = {
  primary: 'text-gray-700', // #374151 - Notion-style main text
  secondary: 'text-gray-500', // Secondary/muted text
  tertiary: 'text-gray-400', // Placeholder/icon text
} as const;

export const SHARED_CLASSES = {
  hover: 'hover-peach',
  transition: 'transition-colors',
  avatar: 'flex items-center justify-center font-semibold',
  border: 'border border-gray-200',
  input: 'bg-white border border-gray-200 rounded-lg',
  card: 'bg-white border border-gray-200 rounded-xl shadow-sm',
  panel: 'bg-white border border-gray-200 shadow-sm rounded-2xl',
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
