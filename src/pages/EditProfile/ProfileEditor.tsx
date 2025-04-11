
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { User } from '../../types';
import PersonalInfoSection from './sections/PersonalInfoSection';
import LocationAvailabilitySection from './sections/LocationAvailabilitySection';
import SocialMediaSection from './sections/SocialMediaSection';
import TeachableSkillsSection from './sections/TeachableSkillsSection';
import DesiredSkillsSection from './sections/DesiredSkillsSection';
import ProfilePhotoSection from './sections/ProfilePhotoSection';
import { LocationPreference, Skill, ProficiencyLevel } from '@/types';

export type FormValues = {
  name: string;
  email: string;
  bio: string;
  location: string;
  locationPreference: LocationPreference;
  availability: string;
  phone: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  other: string;
};

const ProfileEditor: React.FC = () => {
  const { currentUser, updateUserProfile } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [teachableSkills, setTeachableSkills] = useState<Skill[]>(
    currentUser?.teachableSkills || []
  );
  const [desiredSkills, setDesiredSkills] = useState<Skill[]>(
    currentUser?.desiredSkills || []
  );
  const [profilePicture, setProfilePicture] = useState<string>(
    currentUser?.profilePicture || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      bio: currentUser?.bio || '',
      location: currentUser?.location || '',
      locationPreference: currentUser?.locationPreference || 'both',
      availability: currentUser?.availability || '',
      phone: currentUser?.phone || '',
      instagram: currentUser?.socialLinks?.instagram || '',
      facebook: currentUser?.socialLinks?.facebook || '',
      whatsapp: currentUser?.socialLinks?.whatsapp || '',
      other: currentUser?.socialLinks?.other || '',
    },
  });
  
  useEffect(() => {
    if (currentUser) {
      setTeachableSkills(currentUser.teachableSkills || []);
      setDesiredSkills(currentUser.desiredSkills || []);
      setProfilePicture(currentUser.profilePicture || '');
      
      form.reset({
        name: currentUser.name,
        email: currentUser.email,
        bio: currentUser.bio || '',
        location: currentUser.location || '',
        locationPreference: currentUser.locationPreference || 'both',
        availability: currentUser.availability || '',
        phone: currentUser.phone || '',
        instagram: currentUser.socialLinks?.instagram || '',
        facebook: currentUser.socialLinks?.facebook || '',
        whatsapp: currentUser.socialLinks?.whatsapp || '',
        other: currentUser.socialLinks?.other || '',
      });
    }
  }, [currentUser, form]);
  
  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const { instagram, facebook, whatsapp, other, ...restData } = data;
      
      const updatedUser: User = {
        ...currentUser!,
        ...restData,
        teachableSkills,
        desiredSkills,
        profilePicture,
        socialLinks: {
          instagram,
          facebook,
          whatsapp,
          other
        }
      };
      
      const success = await updateUserProfile(updatedUser);
      
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ProfilePhotoSection 
            profilePicture={profilePicture}
            setProfilePicture={setProfilePicture}
            currentUser={currentUser!}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PersonalInfoSection form={form} />
            <LocationAvailabilitySection form={form} />
          </div>
          
          <SocialMediaSection form={form} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TeachableSkillsSection 
              teachableSkills={teachableSkills}
              setTeachableSkills={setTeachableSkills}
            />
            <DesiredSkillsSection 
              desiredSkills={desiredSkills}
              setDesiredSkills={setDesiredSkills}
            />
          </div>
          
          <div className="flex flex-col md:flex-row justify-end space-y-4 md:space-y-0 md:space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/profile')}
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileEditor;
