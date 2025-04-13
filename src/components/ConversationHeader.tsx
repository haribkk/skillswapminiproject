
import React from 'react';
import { User } from '../types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <img 
            src={otherUser.profilePicture} 
            alt={otherUser.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-lg font-medium">
            {otherUser.name ? otherUser.name.charAt(0).toUpperCase() : '?'}
          </div>
        </div>
        <div>
          <h3 className="font-medium">{otherUser.name}</h3>
          <p className="text-xs text-muted-foreground">{otherUser.location}</p>
        </div>
      </Link>
    </div>
  );
};

export default ConversationHeader;
