
import { User, Message, Conversation, SwapProposal } from '../types';

// Mock user data
export const users: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    bio: 'Software engineer passionate about teaching programming and learning new languages.',
    profilePicture: 'https://i.pravatar.cc/150?img=1',
    location: 'New York, NY',
    locationPreference: 'both',
    teachableSkills: [
      { id: '1', name: 'JavaScript Programming', proficiency: 'expert' },
      { id: '2', name: 'React Development', proficiency: 'expert' },
      { id: '3', name: 'UI/UX Design', proficiency: 'intermediate' }
    ],
    desiredSkills: [
      { id: '4', name: 'Spanish Language' },
      { id: '5', name: 'Photography' }
    ],
    availability: 'Weekends and weekday evenings',
    joinedDate: '2023-01-15',
    rating: 4.8,
    completedSwaps: 12
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    bio: 'Bilingual teacher with experience in language education and culinary arts.',
    profilePicture: 'https://i.pravatar.cc/150?img=5',
    location: 'Chicago, IL',
    locationPreference: 'online',
    teachableSkills: [
      { id: '6', name: 'Spanish Language', proficiency: 'expert' },
      { id: '7', name: 'French Language', proficiency: 'intermediate' },
      { id: '8', name: 'Cooking', proficiency: 'expert' }
    ],
    desiredSkills: [
      { id: '9', name: 'Web Development' },
      { id: '10', name: 'Digital Marketing' }
    ],
    availability: 'Flexible schedule',
    joinedDate: '2023-02-20',
    rating: 4.9,
    completedSwaps: 8
  },
  {
    id: '3',
    name: 'David Kim',
    email: 'david@example.com',
    bio: 'Professional photographer and music enthusiast looking to expand my technical skills.',
    profilePicture: 'https://i.pravatar.cc/150?img=8',
    location: 'Los Angeles, CA',
    locationPreference: 'in-person',
    teachableSkills: [
      { id: '11', name: 'Photography', proficiency: 'expert' },
      { id: '12', name: 'Piano', proficiency: 'intermediate' },
      { id: '13', name: 'Adobe Photoshop', proficiency: 'expert' }
    ],
    desiredSkills: [
      { id: '14', name: 'Python Programming' },
      { id: '15', name: 'Data Analysis' }
    ],
    availability: 'Weekdays 9AM-5PM',
    joinedDate: '2023-03-10',
    rating: 4.7,
    completedSwaps: 5
  },
  {
    id: '4',
    name: 'Sarah Thompson',
    email: 'sarah@example.com',
    bio: 'Data scientist with a passion for teaching analytics and learning creative skills.',
    profilePicture: 'https://i.pravatar.cc/150?img=9',
    location: 'Boston, MA',
    locationPreference: 'both',
    teachableSkills: [
      { id: '16', name: 'Python Programming', proficiency: 'expert' },
      { id: '17', name: 'Data Analysis', proficiency: 'expert' },
      { id: '18', name: 'Machine Learning', proficiency: 'intermediate' }
    ],
    desiredSkills: [
      { id: '19', name: 'Graphic Design' },
      { id: '20', name: 'Public Speaking' }
    ],
    availability: 'Tuesday and Thursday evenings',
    joinedDate: '2023-04-05',
    rating: 4.6,
    completedSwaps: 7
  },
  {
    id: '5',
    name: 'Michael Lee',
    email: 'michael@example.com',
    bio: 'Digital marketing specialist and graphic designer looking to learn programming.',
    profilePicture: 'https://i.pravatar.cc/150?img=3',
    location: 'Seattle, WA',
    locationPreference: 'online',
    teachableSkills: [
      { id: '21', name: 'Digital Marketing', proficiency: 'expert' },
      { id: '22', name: 'Graphic Design', proficiency: 'intermediate' },
      { id: '23', name: 'Social Media Management', proficiency: 'expert' }
    ],
    desiredSkills: [
      { id: '24', name: 'JavaScript Programming' },
      { id: '25', name: 'Web Development' }
    ],
    availability: 'Weekends only',
    joinedDate: '2023-05-12',
    rating: 4.5,
    completedSwaps: 4
  }
];

// Mock messages
export const messages: Message[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: '2',
    content: 'Hi Maria, I saw that you teach Spanish. I would love to learn from you and can offer JavaScript lessons in return.',
    timestamp: '2023-06-10T14:30:00Z',
    read: true
  },
  {
    id: '2',
    senderId: '2',
    receiverId: '1',
    content: 'Hello Alex! That sounds great. I\'ve been wanting to learn web development. When are you available for a skill swap?',
    timestamp: '2023-06-10T15:45:00Z',
    read: true
  },
  {
    id: '3',
    senderId: '1',
    receiverId: '2',
    content: 'I\'m free on weekends. Would Saturday afternoon work for you? We could do online sessions.',
    timestamp: '2023-06-11T10:20:00Z',
    read: false
  },
  {
    id: '4',
    senderId: '3',
    receiverId: '4',
    content: 'Hi Sarah, I noticed you teach Python programming. I\'d love to learn that and can offer photography lessons in exchange.',
    timestamp: '2023-06-12T09:15:00Z',
    read: true
  },
  {
    id: '5',
    senderId: '4',
    receiverId: '3',
    content: 'Hi David! I\'ve been wanting to improve my photography skills. Let\'s discuss further!',
    timestamp: '2023-06-12T11:30:00Z',
    read: false
  }
];

// Mock conversations
export const conversations: Conversation[] = [
  {
    id: '1',
    participantIds: ['1', '2'],
    lastMessageTimestamp: '2023-06-11T10:20:00Z',
    unreadCount: 1,
    messages: [messages[0], messages[1], messages[2]]
  },
  {
    id: '2',
    participantIds: ['3', '4'],
    lastMessageTimestamp: '2023-06-12T11:30:00Z',
    unreadCount: 1,
    messages: [messages[3], messages[4]]
  }
];

// Mock swap proposals
export const swapProposals: SwapProposal[] = [
  {
    id: '1',
    proposerId: '1',
    recipientId: '2',
    offeredSkill: { id: '2', name: 'React Development', proficiency: 'expert' },
    requestedSkill: { id: '6', name: 'Spanish Language', proficiency: 'expert' },
    proposedSchedule: 'Saturdays 2-4PM, for 8 weeks',
    learningGoals: 'Want to be able to carry basic conversations in Spanish',
    duration: '2 months',
    status: 'pending',
    createdAt: '2023-06-11T10:30:00Z'
  },
  {
    id: '2',
    proposerId: '3',
    recipientId: '4',
    offeredSkill: { id: '11', name: 'Photography', proficiency: 'expert' },
    requestedSkill: { id: '16', name: 'Python Programming', proficiency: 'expert' },
    proposedSchedule: 'Tuesdays 6-8PM, for 10 weeks',
    learningGoals: 'Learn Python basics for data processing in my photography workflow',
    duration: '2.5 months',
    status: 'accepted',
    createdAt: '2023-06-12T12:00:00Z'
  }
];
