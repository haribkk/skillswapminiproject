
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload } from 'lucide-react';
import { User } from '@/types';
import { getInitials } from '@/utils/userUtils';
import { uploadProfilePicture } from '@/services/profileService';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface ProfilePhotoSectionProps {
  profilePicture: string;
  setProfilePicture: React.Dispatch<React.SetStateAction<string>>;
  currentUser: User;
}

const ProfilePhotoSection: React.FC<ProfilePhotoSectionProps> = ({ 
  profilePicture, 
  setProfilePicture,
  currentUser
}) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  
  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      setIsUploading(true);
      
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setProfilePicture(result);
        };
        reader.readAsDataURL(file);
        
        const uploadedUrl = await uploadProfilePicture(user.id, file);
        if (uploadedUrl) {
          setProfilePicture(uploadedUrl);
          toast({
            title: "Upload successful",
            description: "Your profile picture has been updated."
          });
        }
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "There was an error uploading your profile picture.",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
      }
    }
  };
  
  // Generate proper initials for the fallback
  const userInitials = currentUser?.name ? getInitials(currentUser.name, true) : 'U';
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <Avatar className="w-full h-full">
              {profilePicture ? (
                <AvatarImage 
                  src={profilePicture} 
                  alt={currentUser?.name || 'Profile'} 
                />
              ) : null}
              <AvatarFallback className="text-4xl">{userInitials}</AvatarFallback>
            </Avatar>
            <label 
              htmlFor="profile-photo-upload" 
              className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <Camera size={18} />
              <input 
                type="file" 
                id="profile-photo-upload" 
                className="hidden" 
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </label>
          </div>
          <p className="text-sm text-muted-foreground mb-2">Upload a profile photo to help others recognize you</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <Button type="button" variant="outline" size="sm" className="cursor-pointer" disabled={isUploading}>
              <Upload size={16} className="mr-2" />
              {isUploading ? "Uploading..." : "Choose Photo"}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </Button>
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePhotoSection;
