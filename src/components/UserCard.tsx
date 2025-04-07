
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import SkillBadge from './SkillBadge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Star } from 'lucide-react';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
            <img 
              src={user.profilePicture} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
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
