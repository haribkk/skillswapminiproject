
export type ProficiencyLevel = 'beginner' | 'intermediate' | 'expert';
export type LocationPreference = 'in-person' | 'online' | 'both';

export interface Skill {
  id: string;
  name: string;
  proficiency?: ProficiencyLevel;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
  location: string;
  locationPreference: LocationPreference;
  teachableSkills: Skill[];
  desiredSkills: Skill[];
  availability: string;
  joinedDate: string;
  rating: number;
  completedSwaps: number;
  phone?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    other?: string;
  };
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: any | null; // Updated to explicitly allow null
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageTimestamp: string;
  unreadCount: number;
  messages: Message[];
}

export type ProposalStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface SwapProposal {
  id: string;
  proposerId: string;
  recipientId: string;
  offeredSkill: Skill;
  requestedSkill: Skill;
  proposedSchedule: string;
  learningGoals: string;
  duration: string;
  status: ProposalStatus;
  createdAt: string;
}
