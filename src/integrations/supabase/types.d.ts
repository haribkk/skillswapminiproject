
import { Database } from './types';

// Define the UserWithSkills type that was missing
export interface UserWithSkills {
  id: string;
  name: string;
  email: string | null;
  bio: string | null;
  profile_picture: string | null;
  location: string | null;
  location_preference: string | null;
  availability: string | null;
  joined_date: string | null;
  rating: number | null;
  completed_swaps: number | null;
  teachable_skills: {
    id: string;
    name: string;
    proficiency: string | null;
  }[];
  desired_skills: {
    id: string;
    name: string;
  }[];
}

// Add this so the file is treated as a module
export type { Database };
