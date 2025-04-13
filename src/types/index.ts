export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
  location: string;
  locationPreference: 'in-person' | 'online' | 'both';
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

export interface Skill {
  id: string;
  name: string;
  proficiency?: 'beginner' | 'intermediate' | 'expert';
}

export interface Conversation {
  id: string;
  participantIds: string[];
  messages: Message[];
  lastMessageTimestamp: any;
  unreadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: any;
  read: boolean;
}

export interface AppContextValue {
  currentUser: User | null;
  users: User[];
  getUserById: (id: string) => User | undefined;
  updateCurrentUser: (user: User) => void;
  userConversationsMap: { [userId: string]: any };
  getTotalUnreadMessages: () => number;
}

export interface AppProviderProps {
  children: React.ReactNode;
}
