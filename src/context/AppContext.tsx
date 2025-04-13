import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProfiles } from '../hooks/useProfiles';
import { useAuth } from './AuthContext';
import { User } from '../types';

interface AppContextValue {
  currentUser: User | null;
  users: User[];
  getUserById: (id: string) => User | undefined;
	getTotalUnreadMessages: () => number;
}

interface AppProviderProps {
  children: React.ReactNode;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { data: profiles, isLoading, isError } = useProfiles();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
	const [userConversationsMap, setUserConversationsMap] = useState<{ [userId: string]: { lastMessage: string; timestamp: any; unread: boolean; lastMessageSentByMe: boolean } }>({});

  useEffect(() => {
    if (profiles) {
      setUsers(profiles);
      if (user) {
        const userProfile = profiles.find(profile => profile.email === user.email);
        setCurrentUser(userProfile || null);
      } else {
        setCurrentUser(null);
      }
    }
  }, [profiles, user]);

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  // Add a function to get the total number of unread messages
  const getTotalUnreadMessages = () => {
    const userConversations = Object.values(userConversationsMap);
    if (!userConversations.length) return 0;
    
    return userConversations.reduce((total, conv) => {
      if (conv.unread) {
        return total + 1;
      }
      return total;
    }, 0);
  };

	useEffect(() => {
    // Load user conversations from local storage on component mount
    const storedConversations = localStorage.getItem('userConversations');
    if (storedConversations) {
      setUserConversationsMap(JSON.parse(storedConversations));
    }
  }, []);

  useEffect(() => {
    // Save user conversations to local storage whenever they change
    localStorage.setItem('userConversations', JSON.stringify(userConversationsMap));
  }, [userConversationsMap]);

  const value = {
    currentUser,
    users,
    getUserById,
		getTotalUnreadMessages,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = useAppContext;
