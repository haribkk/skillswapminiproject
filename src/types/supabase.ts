
import { Database } from '@/integrations/supabase/types';

// Extract the profile type from the generated types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type TeachableSkill = Database['public']['Tables']['teachable_skills']['Row'];
export type DesiredSkill = Database['public']['Tables']['desired_skills']['Row'];

// Define our extended type for profiles with related skills
export interface UserWithSkills extends Profile {
  teachable_skills: TeachableSkill[];
  desired_skills: DesiredSkill[];
}
