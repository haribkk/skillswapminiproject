
import { User, Conversation, Message, SwapProposal } from '../../types';

export interface ConversationActions {
  getConversation: (userId: string, otherUserId: string) => Conversation | undefined;
  markConversationAsRead: (userId: string, otherUserId: string) => void;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'read'>) => void;
}

export interface SwapProposalActions {
  createSwapProposal: (proposal: Omit<SwapProposal, 'id' | 'status' | 'createdAt'>) => void;
  updateSwapProposalStatus: (proposalId: string, status: SwapProposal['status']) => void;
}

export interface UserActions {
  getUserById: (userId: string) => User | undefined;
  updateUserProfile: (updatedUser: User) => Promise<boolean>;
}

export interface AppContextState {
  currentUser: User | null;
  users: User[];
  conversations: Conversation[];
  swapProposals: SwapProposal[];
  setCurrentUser: (user: User | null) => void;
}

export type AppContextType = AppContextState & 
  ConversationActions & 
  SwapProposalActions &
  UserActions;
