
import React from 'react';
import { User } from '../types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/utils/userUtils';

interface ConversationHeaderProps {
  otherUser: User;
  isMobile: boolean;
  onBackClick: () => void;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ 
  otherUser, 
  isMobile, 
  onBackClick 
}) => {
  return (
    <div className="p-4 border-b flex items-center">
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={onBackClick}
        >
          <ArrowLeft size={20} />
        </Button>
      )}
      
      <Link to={`/profile/${otherUser.id}`} className="flex items-center">
        <Avatar className="w-10 h-10 mr-3">
          <AvatarImage 
            src={otherUser.profilePicture} 
            alt={otherUser.name}
          />
          <AvatarFallback>{getInitials(otherUser.name, true)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{otherUser.name}</h3>
          <p className="text-xs text-muted-foreground">{otherUser.location}</p>
        </div>
      </Link>
    </div>
  );
};

export default ConversationHeader;
