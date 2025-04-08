import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Conversation, SwapProposal, Message } from '../types';
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
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'read'>) => void;
  createSwapProposal: (proposal: Omit<SwapProposal, 'id' | 'createdAt' | 'status'>) => void;
  updateSwapProposalStatus: (proposalId: string, status: SwapProposal['status']) => void;
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

  const sendMessage = (messageData: Omit<Message, 'id' | 'timestamp' | 'read'>) => {
    const newMessage: Message = {
      ...messageData,
      id: String(Date.now()),
      timestamp: new Date().toISOString(),
      read: false,
    };

    const conversationIndex = conversations.findIndex(
      (conv) => 
        (conv.participantIds.includes(messageData.senderId) && 
        conv.participantIds.includes(messageData.receiverId))
    );

    if (conversationIndex >= 0) {
      const updatedConversations = [...conversations];
      updatedConversations[conversationIndex] = {
        ...updatedConversations[conversationIndex],
        messages: [...updatedConversations[conversationIndex].messages, newMessage],
        lastMessageTimestamp: newMessage.timestamp,
        unreadCount: messageData.receiverId === currentUser?.id 
          ? updatedConversations[conversationIndex].unreadCount 
          : updatedConversations[conversationIndex].unreadCount + 1,
      };
      setConversations(updatedConversations);
    } else {
      const newConversation: Conversation = {
        id: String(Date.now()),
        participantIds: [messageData.senderId, messageData.receiverId],
        lastMessageTimestamp: newMessage.timestamp,
        unreadCount: messageData.receiverId === currentUser?.id ? 0 : 1,
        messages: [newMessage],
      };
      setConversations(prevConversations => [...prevConversations, newConversation]);
    }
    
    console.log("Message sent:", newMessage);
    console.log("Current conversations:", conversations);
  };

  const createSwapProposal = (proposalData: Omit<SwapProposal, 'id' | 'createdAt' | 'status'>) => {
    const newProposal: SwapProposal = {
      ...proposalData,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setSwapProposals([...swapProposals, newProposal]);

    sendMessage({
      senderId: proposalData.proposerId,
      receiverId: proposalData.recipientId,
      content: `I've sent you a skill swap proposal! I'd like to teach you ${proposalData.offeredSkill.name} in exchange for learning ${proposalData.requestedSkill.name}.`,
    });
  };

  const updateSwapProposalStatus = (proposalId: string, status: SwapProposal['status']) => {
    const updatedProposals = swapProposals.map(proposal => 
      proposal.id === proposalId ? { ...proposal, status } : proposal
    );
    setSwapProposals(updatedProposals);

    const proposal = swapProposals.find(p => p.id === proposalId);
    if (proposal && currentUser) {
      const otherUserId = currentUser.id === proposal.proposerId 
        ? proposal.recipientId 
        : proposal.proposerId;
      
      let messageContent = '';
      if (status === 'accepted') {
        messageContent = 'I have accepted your skill swap proposal! Looking forward to our exchange.';
      } else if (status === 'declined') {
        messageContent = 'I have declined your skill swap proposal. Perhaps we can find another opportunity in the future.';
      } else if (status === 'completed') {
        messageContent = 'I have marked our skill swap as completed. Thank you for the exchange!';
      }

      if (messageContent) {
        sendMessage({
          senderId: currentUser.id,
          receiverId: otherUserId,
          content: messageContent,
        });
      }
    }
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
        swapProposals,
        setCurrentUser,
        sendMessage,
        createSwapProposal,
        updateSwapProposalStatus,
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
