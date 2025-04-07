
import { Database as SupabaseDatabase } from './types';

export type Profile = SupabaseDatabase['public']['Tables']['profiles']['Row'];
export type TeachableSkill = SupabaseDatabase['public']['Tables']['teachable_skills']['Row'];
export type DesiredSkill = SupabaseDatabase['public']['Tables']['desired_skills']['Row'];

export interface UserWithSkills extends Profile {
  teachable_skills: TeachableSkill[];
  desired_skills: DesiredSkill[];
}
