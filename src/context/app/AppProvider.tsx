
import React, { useState, useEffect } from 'react';
import { User, Conversation, SwapProposal } from '../../types';
import { conversations as mockConversations, swapProposals as mockSwapProposals } from '../../data/mockData';
import { useAuth } from '../AuthContext';
import { useProfiles, useProfile } from '../../hooks/useProfiles';
import { useConversations } from './useConversations';
import { useSwapProposals } from './useSwapProposals';
import { useUsers } from './useUsers';
import { AppContextType } from './types';

export const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { data: profiles = [] } = useProfiles();
  const { data: currentUserProfile } = useProfile(user?.id);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, conversationActions] = useConversations(mockConversations);
  const [swapProposals, swapProposalActions] = useSwapProposals(mockSwapProposals);
  const userActions = useUsers(profiles, setCurrentUser);

  useEffect(() => {
    if (currentUserProfile) {
      setCurrentUser(currentUserProfile);
    } else if (!user) {
      setCurrentUser(null);
    }
  }, [currentUserProfile, user]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users: profiles,
        conversations,
        swapProposals,
        setCurrentUser,
        ...conversationActions,
        ...swapProposalActions,
        ...userActions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
