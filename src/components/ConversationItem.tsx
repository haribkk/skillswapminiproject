
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Conversation } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, isActive }) => {
  const { currentUser, getUserById } = useApp();
  
  // Find the other participant (not the current user)
  const otherUserId = conversation.participantIds.find(id => id !== currentUser?.id);
  const otherUser = otherUserId ? getUserById(otherUserId) : undefined;
  
  // Get the last message
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const isUnread = lastMessage && !lastMessage.read && lastMessage.receiverId === currentUser?.id;
  
  if (!otherUser) return null;
  
  return (
    <Link
      to={`/messages/${otherUser.id}`}
      className={`block px-4 py-3 border-b hover:bg-accent transition-colors ${
        isActive ? 'bg-accent' : ''
      } ${isUnread ? 'font-semibold' : ''}`}
    >
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
          <img 
            src={otherUser.profilePicture} 
            alt={otherUser.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-baseline">
            <h4 className="font-medium truncate mr-2">{otherUser.name}</h4>
            {lastMessage && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true })}
              </span>
            )}
          </div>
          {lastMessage && (
            <p className={`text-sm truncate ${isUnread ? 'text-foreground' : 'text-muted-foreground'}`}>
              {lastMessage.senderId === currentUser?.id ? 'You: ' : ''}
              {lastMessage.content}
            </p>
          )}
        </div>
        {isUnread && (
          <div className="ml-2 w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
        )}
      </div>
    </Link>
  );
};

export default ConversationItem;
