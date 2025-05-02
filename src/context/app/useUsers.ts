
import { User } from '../../types';
import { UserActions } from './types';
import { updateUserProfile as updateProfileService } from '../../services/profileService';

export const useUsers = (users: User[], setCurrentUser: (user: User | null) => void): UserActions => {
  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };
  
  const updateUserProfile = async (updatedUser: User) => {
    const success = await updateProfileService(updatedUser);
    if (success) {
      setCurrentUser(updatedUser);
    }
    return success;
  };

  return {
    getUserById,
    updateUserProfile
  };
};
