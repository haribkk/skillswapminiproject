
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
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
import { Camera, Upload } from 'lucide-react';

type FormValues = {
  name: string;
  email: string;
  bio: string;
  location: string;
  locationPreference: LocationPreference;
  availability: string;
};

const EditProfile: React.FC = () => {
  const { currentUser, updateUserProfile } = useApp();
  const navigate = useNavigate();
  
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
  
  // Add state for profile picture
  const [profilePicture, setProfilePicture] = useState<string>(
    currentUser?.profilePicture || ''
  );

  // Handle profile picture change
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePicture(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const form = useForm<FormValues>({
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      bio: currentUser?.bio || '',
      location: currentUser?.location || '',
      locationPreference: currentUser?.locationPreference || 'both',
      availability: currentUser?.availability || '',
    },
  });
  
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
        <p className="text-lg text-muted-foreground mb-6">
          You need to sign in to edit your profile.
        </p>
        <Button asChild>
          <Link to="/login">Sign In</Link>
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
  
  const onSubmit = (data: FormValues) => {
    // Create updated user object
    const updatedUser: User = {
      ...currentUser,
      ...data,
      teachableSkills,
      desiredSkills,
      profilePicture, // Include the updated profile picture
    };
    
    // Update user profile
    updateUserProfile(updatedUser);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    
    // Navigate back to profile page
    navigate('/profile');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Photo Upload */}
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
            {/* Personal Information */}
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
            
            {/* Location & Availability */}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Teachable Skills */}
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
                
                <div className="flex space-x-2 mb-2">
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
                    <SelectTrigger className="w-[140px]">
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
                >
                  Add Skill
                </Button>
              </CardContent>
            </Card>
            
            {/* Desired Skills */}
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
                >
                  Add Skill
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/profile')}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProfile;
