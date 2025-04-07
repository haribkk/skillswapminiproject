
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
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface SwapProposal {
  id: string;
  proposerId: string;
  recipientId: string;
  offeredSkill: Skill;
  requestedSkill: Skill;
  proposedSchedule: string;
  learningGoals: string;
  duration: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageTimestamp: string;
  unreadCount: number;
  messages: Message[];
}
