
/**
 * Utility functions for user-related operations
 */

/**
 * Get the initials from a user's name
 * @param name The user's full name
 * @returns The initials (first letter of each word in the name)
 */
export const getInitials = (name: string): string => {
  if (!name) return '?';
  
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};
