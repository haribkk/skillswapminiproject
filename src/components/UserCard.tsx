import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import SkillBadge from './SkillBadge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Star, Phone, Instagram, Facebook } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/utils/userUtils';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
            <Avatar className="w-full h-full">
              <AvatarImage 
                src={user.profilePicture} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
              <AvatarFallback>{getInitials(user.name, true)}</AvatarFallback>
            </Avatar>
          </div>
          <h3 className="text-lg font-semibold text-center">{user.name}</h3>
          <div className="flex items-center text-yellow-500 mt-1">
            <Star size={16} className="fill-current" />
            <span className="ml-1 text-sm">{user.rating.toFixed(1)} ({user.completedSwaps} swaps)</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {user.location} • {user.locationPreference === 'both' 
              ? 'In-person & Online' 
              : user.locationPreference.charAt(0).toUpperCase() + user.locationPreference.slice(1)}
          </div>
          
          {/* Social/Contact Links */}
          {(user.phone || user.socialLinks) && (
            <div className="flex gap-2 mt-2">
              {user.phone && (
                <a href={`tel:${user.phone}`} aria-label="Call">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Phone size={14} />
                  </Button>
                </a>
              )}
              
              {user.socialLinks?.instagram && (
                <a href={user.socialLinks.instagram.startsWith('http') ? user.socialLinks.instagram : `https://instagram.com/${user.socialLinks.instagram.replace('@', '')}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   aria-label="Instagram">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Instagram size={14} />
                  </Button>
                </a>
              )}
              
              {user.socialLinks?.facebook && (
                <a href={user.socialLinks.facebook.startsWith('http') ? user.socialLinks.facebook : `https://facebook.com/${user.socialLinks.facebook}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   aria-label="Facebook">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Facebook size={14} />
                  </Button>
                </a>
              )}
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Teaches:</h4>
          <div>
            {user.teachableSkills.map((skill) => (
              <SkillBadge key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Wants to Learn:</h4>
          <div>
            {user.desiredSkills.map((skill) => (
              <SkillBadge key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between space-x-2 pt-0">
        <Button variant="outline" asChild className="w-1/2">
          <Link to={`/profile/${user.id}`}>View Profile</Link>
        </Button>
        <Button className="w-1/2" asChild>
          <Link to={`/messages/${user.id}`}>
            <MessageSquare size={16} className="mr-2" />
            Message
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserCard;
