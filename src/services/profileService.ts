
import { supabase } from '@/integrations/supabase/client';
import { User, Skill } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const updateUserProfile = async (user: User) => {
  try {
    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        location_preference: user.locationPreference,
        availability: user.availability,
        profile_picture: user.profilePicture,
      })
      .eq('id', user.id);

    if (profileError) throw profileError;

    // Replace teachable skills (delete old ones, add new ones)
    const { error: deleteTeachableError } = await supabase
      .from('teachable_skills')
      .delete()
      .eq('user_id', user.id);

    if (deleteTeachableError) throw deleteTeachableError;

    if (user.teachableSkills.length > 0) {
      const teachableSkillsData = user.teachableSkills.map(skill => ({
        user_id: user.id,
        name: skill.name,
        proficiency: skill.proficiency || 'intermediate',
      }));

      const { error: insertTeachableError } = await supabase
        .from('teachable_skills')
        .insert(teachableSkillsData);

      if (insertTeachableError) throw insertTeachableError;
    }

    // Replace desired skills (delete old ones, add new ones)
    const { error: deleteDesiredError } = await supabase
      .from('desired_skills')
      .delete()
      .eq('user_id', user.id);

    if (deleteDesiredError) throw deleteDesiredError;

    if (user.desiredSkills.length > 0) {
      const desiredSkillsData = user.desiredSkills.map(skill => ({
        user_id: user.id,
        name: skill.name,
      }));

      const { error: insertDesiredError } = await supabase
        .from('desired_skills')
        .insert(desiredSkillsData);

      if (insertDesiredError) throw insertDesiredError;
    }

    return true;
  } catch (error: any) {
    toast({
      title: "Profile update failed",
      description: error.message || "There was an error updating your profile",
      variant: "destructive"
    });
    return false;
  }
};

export const uploadProfilePicture = async (userId: string, file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error: any) {
    toast({
      title: "Upload failed",
      description: error.message || "There was an error uploading your profile picture",
      variant: "destructive"
    });
    return null;
  }
};
