
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
  const lastMessage = conversation.messages[0];
  const isUnread = conversation.unreadCount > 0;
  
  if (!otherUser) return null;
  
  // Format timestamp for Firebase timestamps
  const formatTimestamp = (timestamp: any) => {
    try {
      if (!timestamp) return '';
      
      // If timestamp is a Firebase server timestamp object
      if (typeof timestamp === 'object' && timestamp !== null) {
        if ('seconds' in timestamp) {
          // Convert Firebase timestamp to milliseconds
          const seconds = timestamp.seconds || 0;
          const nanoseconds = timestamp.nanoseconds || 0;
          const milliseconds = seconds * 1000 + nanoseconds / 1000000;
          return formatDistanceToNow(new Date(milliseconds), { addSuffix: true });
        }
      }
      
      // Regular string timestamp
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return '(unknown time)';
    }
  };
  
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
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-lg font-medium">
            {otherUser.name ? otherUser.name.charAt(0).toUpperCase() : '?'}
          </div>
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-baseline">
            <h4 className="font-medium truncate mr-2">{otherUser.name}</h4>
            {lastMessage && lastMessage.timestamp && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatTimestamp(lastMessage.timestamp)}
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
