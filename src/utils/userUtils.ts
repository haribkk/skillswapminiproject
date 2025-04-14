
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
  if (!name || name.trim() === '') return '?';
  
  if (firstNameOnly) {
    // Return just the first letter of the first word
    return name.trim().charAt(0).toUpperCase();
  }
  
  // Get all initials
  return name
    .trim()
    .split(' ')
    .map(n => (n && n.length > 0) ? n[0].toUpperCase() : '')
    .filter(Boolean) // Remove empty strings
    .join('');
};
