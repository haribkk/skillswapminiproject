
/**
 * Utility functions for user-related operations
 */

/**
 * Get the initials from a user's name
 * @param name The user's full name
 * @param firstNameOnly Whether to return only the first initial (default: false)
 * @returns The initials (first letter of each word in the name, or just first initial)
 */
export const getInitials = (name: string, firstNameOnly: boolean = false): string => {
  if (!name) return '?';
  
  if (firstNameOnly) {
    // Return just the first letter of the first word
    return name.trim().charAt(0).toUpperCase();
  }
  
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};
