
import React from 'react';
import { Message } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { useApp } from '../context/AppContext';
import { Loader2 } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { currentUser } = useApp();
  const isCurrentUserMessage = message.senderId === currentUser?.id;
  
  // Handle Firebase serverTimestamp which may be in a different format
  const formatTimestamp = () => {
    try {
      if (!message.timestamp) return '';
      
      // If timestamp is a Firebase server timestamp object with seconds
      if (typeof message.timestamp === 'object' && message.timestamp !== null) {
        if ('seconds' in message.timestamp) {
          // Convert Firebase timestamp to milliseconds
          const seconds = message.timestamp.seconds || 0;
          const nanoseconds = message.timestamp.nanoseconds || 0;
          const milliseconds = seconds * 1000 + nanoseconds / 1000000;
          return formatDistanceToNow(new Date(milliseconds), { addSuffix: true });
        }
      }
      
      // Regular string timestamp
      return formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return '(unknown time)';
    }
  };
  
  return (
    <div 
      className={`flex ${isCurrentUserMessage ? 'justify-end' : 'justify-start'}`}
      data-message-type={isCurrentUserMessage ? 'sent' : 'received'}
    >
      <div 
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isCurrentUserMessage 
            ? 'bg-primary text-primary-foreground rounded-tr-none' 
            : 'bg-secondary text-secondary-foreground rounded-tl-none'
        }`}
      >
        <p className="text-sm break-words">{message.content}</p>
        <div 
          className={`text-xs mt-1 flex items-center ${
            isCurrentUserMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}
        >
          {message.timestamp ? (
            <span>{formatTimestamp()}</span>
          ) : (
            <>
              <Loader2 className="animate-spin h-3 w-3 mr-1" />
              <span>Sending...</span>
            </>
          )}
          {isCurrentUserMessage && (
            <span className="ml-1">
              {message.read ? ' • Read' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
