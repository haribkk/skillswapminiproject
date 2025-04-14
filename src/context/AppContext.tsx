
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Conversation, Message } from '../types';
import { conversations as mockConversations } from '../data/mockData';
import { useAuth } from './AuthContext';
import { useProfiles, useProfile } from '../hooks/useProfiles';
import { updateUserProfile as updateProfileService } from '../services/profileService';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  conversations: Conversation[];
  setCurrentUser: (user: User | null) => void;
  getConversation: (userId: string, otherUserId: string) => Conversation | undefined;
  getUserById: (userId: string) => User | undefined;
  updateUserProfile: (updatedUser: User) => Promise<boolean>;
  markConversationAsRead: (userId: string, otherUserId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { data: profiles = [] } = useProfiles();
  const { data: currentUserProfile } = useProfile(user?.id);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);

  useEffect(() => {
    if (currentUserProfile) {
      setCurrentUser(currentUserProfile);
    } else if (!user) {
      setCurrentUser(null);
    }
  }, [currentUserProfile, user]);

  const markConversationAsRead = (userId: string, otherUserId: string) => {
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (
          conv.participantIds.includes(userId) && 
          conv.participantIds.includes(otherUserId)
        ) {
          const updatedMessages = conv.messages.map(message => {
            if (message.receiverId === userId && !message.read) {
              return { ...message, read: true };
            }
            return message;
          });
          
          return {
            ...conv,
            messages: updatedMessages,
            unreadCount: 0
          };
        }
        return conv;
      });
    });
  };

  const getConversation = (userId: string, otherUserId: string) => {
    const conversation = conversations.find(
      (conv) => 
        conv.participantIds.includes(userId) && 
        conv.participantIds.includes(otherUserId)
    );
    
    if (!conversation) {
      console.log("No conversation found between", userId, "and", otherUserId);
      console.log("Available conversations:", conversations);
    }
    
    return conversation;
  };

  const getUserById = (userId: string) => {
    return profiles.find(user => user.id === userId);
  };
  
  const updateUserProfile = async (updatedUser: User) => {
    const success = await updateProfileService(updatedUser);
    if (success) {
      setCurrentUser(updatedUser);
    }
    return success;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users: profiles,
        conversations,
        setCurrentUser,
        getConversation,
        getUserById,
        updateUserProfile,
        markConversationAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
