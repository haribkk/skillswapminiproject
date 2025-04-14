import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Conversation, Message, SwapProposal, Skill } from '../types';
import { conversations as mockConversations, swapProposals as mockSwapProposals } from '../data/mockData';
import { useAuth } from './AuthContext';
import { useProfiles, useProfile } from '../hooks/useProfiles';
import { updateUserProfile as updateProfileService } from '../services/profileService';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  conversations: Conversation[];
  swapProposals: SwapProposal[];
  setCurrentUser: (user: User | null) => void;
  getConversation: (userId: string, otherUserId: string) => Conversation | undefined;
  getUserById: (userId: string) => User | undefined;
  updateUserProfile: (updatedUser: User) => Promise<boolean>;
  markConversationAsRead: (userId: string, otherUserId: string) => void;
  createSwapProposal: (proposal: Omit<SwapProposal, 'id' | 'status' | 'createdAt'>) => void;
  updateSwapProposalStatus: (proposalId: string, status: SwapProposal['status']) => void;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'read'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { data: profiles = [] } = useProfiles();
  const { data: currentUserProfile } = useProfile(user?.id);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [swapProposals, setSwapProposals] = useState<SwapProposal[]>(mockSwapProposals);

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

  const createSwapProposal = (proposalData: Omit<SwapProposal, 'id' | 'status' | 'createdAt'>) => {
    const newProposal: SwapProposal = {
      ...proposalData,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setSwapProposals(prev => [...prev, newProposal]);
  };
  
  const updateSwapProposalStatus = (proposalId: string, status: SwapProposal['status']) => {
    setSwapProposals(prev => 
      prev.map(proposal => 
        proposal.id === proposalId 
          ? { ...proposal, status } 
          : proposal
      )
    );
  };
  
  const sendMessage = (messageData: Omit<Message, 'id' | 'timestamp' | 'read'>) => {
    const { senderId, receiverId, content } = messageData;
    
    const newMessage: Message = {
      id: crypto.randomUUID(),
      senderId,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setConversations(prev => {
      const existingConversation = prev.find(
        conv => conv.participantIds.includes(senderId) && conv.participantIds.includes(receiverId)
      );
      
      if (existingConversation) {
        return prev.map(conv => {
          if (conv.id === existingConversation.id) {
            return {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessageTimestamp: newMessage.timestamp,
              unreadCount: conv.unreadCount + (senderId !== receiverId ? 1 : 0)
            };
          }
          return conv;
        });
      } else {
        const newConversation: Conversation = {
          id: crypto.randomUUID(),
          participantIds: [senderId, receiverId],
          lastMessageTimestamp: newMessage.timestamp,
          unreadCount: 1,
          messages: [newMessage]
        };
        
        return [...prev, newConversation];
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users: profiles,
        conversations,
        swapProposals,
        setCurrentUser,
        getConversation,
        getUserById,
        updateUserProfile,
        markConversationAsRead,
        createSwapProposal,
        updateSwapProposalStatus,
        sendMessage
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
