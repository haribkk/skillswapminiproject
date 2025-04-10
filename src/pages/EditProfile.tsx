
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { User, Skill, ProficiencyLevel, LocationPreference } from '../types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload, Phone, Instagram, Facebook } from 'lucide-react';
import { uploadProfilePicture } from '../services/profileService';
import { getInitials } from '@/utils/userUtils';
import { useIsMobile } from '@/hooks/use-mobile';

type FormValues = {
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

const EditProfile: React.FC = () => {
  const { currentUser, updateUserProfile } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [teachableSkills, setTeachableSkills] = useState<Skill[]>(
    currentUser?.teachableSkills || []
  );
  const [desiredSkills, setDesiredSkills] = useState<Skill[]>(
    currentUser?.desiredSkills || []
  );
  
  const [newTeachableSkill, setNewTeachableSkill] = useState('');
  const [newTeachableSkillProficiency, setNewTeachableSkillProficiency] = 
    useState<ProficiencyLevel>('intermediate');
  
  const [newDesiredSkill, setNewDesiredSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [profilePicture, setProfilePicture] = useState<string>(
    currentUser?.profilePicture || ''
  );
  const [isUploading, setIsUploading] = useState(false);

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
  }, [currentUser]);

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
  
  if (!currentUser || !user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
        <p className="text-lg text-muted-foreground mb-6">
          You need to sign in to edit your profile.
        </p>
        <Button asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
      </div>
    );
  }
  
  const addTeachableSkill = () => {
    if (newTeachableSkill.trim()) {
      setTeachableSkills([
        ...teachableSkills,
        {
          id: Date.now().toString(),
          name: newTeachableSkill.trim(),
          proficiency: newTeachableSkillProficiency,
        },
      ]);
      setNewTeachableSkill('');
    }
  };
  
  const removeTeachableSkill = (skillId: string) => {
    setTeachableSkills(teachableSkills.filter(skill => skill.id !== skillId));
  };
  
  const addDesiredSkill = () => {
    if (newDesiredSkill.trim()) {
      setDesiredSkills([
        ...desiredSkills,
        {
          id: Date.now().toString(),
          name: newDesiredSkill.trim(),
        },
      ]);
      setNewDesiredSkill('');
    }
  };
  
  const removeDesiredSkill = (skillId: string) => {
    setDesiredSkills(desiredSkills.filter(skill => skill.id !== skillId));
  };
  
  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const { instagram, facebook, whatsapp, other, ...restData } = data;
      
      const updatedUser: User = {
        ...currentUser,
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
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={profilePicture} />
                    <AvatarFallback>{currentUser?.name ? getInitials(currentUser.name) : 'U'}</AvatarFallback>
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
                  <Button type="button" variant="outline" size="sm" className="cursor-pointer">
                    <Upload size={16} className="mr-2" />
                    Choose Photo
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" placeholder="+1 (555) 123-4567" />
                      </FormControl>
                      <FormDescription>
                        Add your phone number for additional contact options
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Tell others about yourself..." 
                          className="min-h-[120px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Share your background, interests, and teaching style.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Location & Availability</h2>
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="City, Country" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="locationPreference"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Teaching/Learning Preference</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preference" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="in-person">In-person only</SelectItem>
                          <SelectItem value="online">Online only</SelectItem>
                          <SelectItem value="both">Both in-person & online</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Availability</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="When are you available for skill swaps?" 
                        />
                      </FormControl>
                      <FormDescription>
                        E.g., "Weekday evenings and Sunday afternoons"
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Social Media & Contact Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Instagram size={16} />
                        Instagram
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="@username or full URL" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Facebook size={16} />
                        Facebook
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Username or full URL" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone size={16} />
                        WhatsApp
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Phone number with country code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="other"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Platform</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Website, LinkedIn, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Skills I Can Teach</h2>
                
                <div className="mb-4">
                  {teachableSkills.map((skill) => (
                    <div key={skill.id} className="flex items-center mb-2">
                      <span className={`skill-badge skill-badge-${skill.proficiency}`}>
                        {skill.name} ({skill.proficiency})
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeTeachableSkill(skill.id)}
                        className="ml-2 h-6 text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-2">
                  <Input
                    value={newTeachableSkill}
                    onChange={(e) => setNewTeachableSkill(e.target.value)}
                    placeholder="Add a skill you can teach"
                    className="flex-grow"
                  />
                  <Select 
                    value={newTeachableSkillProficiency}
                    onValueChange={(value: ProficiencyLevel) => 
                      setNewTeachableSkillProficiency(value)
                    }
                  >
                    <SelectTrigger className="w-full md:w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addTeachableSkill}
                  disabled={!newTeachableSkill.trim()}
                  className="w-full md:w-auto"
                >
                  Add Skill
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Skills I Want to Learn</h2>
                
                <div className="mb-4">
                  {desiredSkills.map((skill) => (
                    <div key={skill.id} className="flex items-center mb-2">
                      <span className="skill-badge">
                        {skill.name}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeDesiredSkill(skill.id)}
                        className="ml-2 h-6 text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={newDesiredSkill}
                    onChange={(e) => setNewDesiredSkill(e.target.value)}
                    placeholder="Add a skill you want to learn"
                    className="flex-grow"
                  />
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addDesiredSkill}
                  disabled={!newDesiredSkill.trim()}
                  className="w-full md:w-auto"
                >
                  Add Skill
                </Button>
              </CardContent>
            </Card>
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

export default EditProfile;
