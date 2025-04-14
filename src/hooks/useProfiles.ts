
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserWithSkills } from '@/types/supabase';
import { toast } from '@/components/ui/use-toast';
import { User } from '@/types';

// Helper function to safely type-cast social_links from Json to our expected structure
const parseSocialLinks = (socialLinks: any): User['socialLinks'] | undefined => {
  if (!socialLinks) return undefined;
  
  // If it's not an object, return undefined
  if (typeof socialLinks !== 'object' || Array.isArray(socialLinks)) {
    return undefined;
  }

  // Create a properly typed object with only our expected properties
  return {
    instagram: typeof socialLinks.instagram === 'string' ? socialLinks.instagram : undefined,
    facebook: typeof socialLinks.facebook === 'string' ? socialLinks.facebook : undefined,
    whatsapp: typeof socialLinks.whatsapp === 'string' ? socialLinks.whatsapp : undefined,
    other: typeof socialLinks.other === 'string' ? socialLinks.other : undefined,
  };
};

// Convert Supabase profile to our app's User type
const mapProfileToUser = (profile: UserWithSkills): User => {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email || '',
    bio: profile.bio || '',
    profilePicture: profile.profile_picture || '', // No default placeholder here, let the Avatar handle that
    location: profile.location || '',
    locationPreference: (profile.location_preference || 'both') as 'in-person' | 'online' | 'both',
    teachableSkills: profile.teachable_skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      proficiency: (skill.proficiency || 'intermediate') as 'beginner' | 'intermediate' | 'expert',
    })),
    desiredSkills: profile.desired_skills.map(skill => ({
      id: skill.id,
      name: skill.name,
    })),
    availability: profile.availability || '',
    joinedDate: profile.joined_date || new Date().toISOString(),
    rating: profile.rating || 5.0,
    completedSwaps: profile.completed_swaps || 0,
    phone: profile.phone || undefined,
    socialLinks: parseSocialLinks(profile.social_links),
  };
};

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select(`
            *,
            teachable_skills(*),
            desired_skills(*)
          `);

        if (error) throw error;
        
        return (profiles as unknown as UserWithSkills[]).map(mapProfileToUser);
      } catch (error: any) {
        toast({
          title: "Error fetching profiles",
          description: error.message || "Failed to load profiles",
          variant: "destructive"
        });
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select(`
            *,
            teachable_skills(*),
            desired_skills(*)
          `)
          .eq('id', userId)
          .single();

        if (error) throw error;
        
        return mapProfileToUser(profile as unknown as UserWithSkills);
      } catch (error: any) {
        toast({
          title: "Error fetching profile",
          description: error.message || "Failed to load profile",
          variant: "destructive"
        });
        return null;
      }
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
};
