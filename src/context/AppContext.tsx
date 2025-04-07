
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Conversation, SwapProposal, Message } from '../types';
import { users as mockUsers, conversations as mockConversations, swapProposals as mockSwapProposals } from '../data/mockData';

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]); // For demo, default to the first user
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [swapProposals, setSwapProposals] = useState<SwapProposal[]>(mockSwapProposals);

  const sendMessage = (messageData: Omit<Message, 'id' | 'timestamp' | 'read'>) => {
    const newMessage: Message = {
      ...messageData,
      id: String(Date.now()),
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Find existing conversation or create a new one
    const conversationIndex = conversations.findIndex(
      (conv) => 
        conv.participantIds.includes(messageData.senderId) && 
        conv.participantIds.includes(messageData.receiverId)
    );

    if (conversationIndex >= 0) {
      // Update existing conversation
      const updatedConversations = [...conversations];
      updatedConversations[conversationIndex] = {
        ...updatedConversations[conversationIndex],
        messages: [...updatedConversations[conversationIndex].messages, newMessage],
        lastMessageTimestamp: newMessage.timestamp,
        unreadCount: updatedConversations[conversationIndex].unreadCount + 1,
      };
      setConversations(updatedConversations);
    } else {
      // Create new conversation
      const newConversation: Conversation = {
        id: String(Date.now()),
        participantIds: [messageData.senderId, messageData.receiverId],
        lastMessageTimestamp: newMessage.timestamp,
        unreadCount: 1,
        messages: [newMessage],
      };
      setConversations([...conversations, newConversation]);
    }
  };

  const createSwapProposal = (proposalData: Omit<SwapProposal, 'id' | 'createdAt' | 'status'>) => {
    const newProposal: SwapProposal = {
      ...proposalData,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setSwapProposals([...swapProposals, newProposal]);

    // Also send a message about the proposal
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

    // Send a message about the status update
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
    return conversations.find(
      (conv) => 
        conv.participantIds.includes(userId) && 
        conv.participantIds.includes(otherUserId)
    );
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        conversations,
        swapProposals,
        setCurrentUser,
        sendMessage,
        createSwapProposal,
        updateSwapProposalStatus,
        getConversation,
        getUserById,
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
