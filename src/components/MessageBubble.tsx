
import React from 'react';
import { Message } from '../types';
import { formatDistanceToNow, format } from 'date-fns';
import { useApp } from '../context/AppContext';
import { Loader2, Check, CheckCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { currentUser } = useApp();
  const isCurrentUserMessage = message.senderId === currentUser?.id;
  
  // Format timestamp for display
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
          const date = new Date(milliseconds);
          
          // For messages within the last 24 hours, use relative time
          const isWithin24Hours = Date.now() - date.getTime() < 24 * 60 * 60 * 1000;
          
          if (isWithin24Hours) {
            return formatDistanceToNow(date, { addSuffix: true });
          } else {
            // For older messages, show the actual date and time
            return format(date, 'MMM d, h:mm a');
          }
        }
      }
      
      // Regular string timestamp
      const date = new Date(message.timestamp);
      const isWithin24Hours = Date.now() - date.getTime() < 24 * 60 * 60 * 1000;
      
      if (isWithin24Hours) {
        return formatDistanceToNow(date, { addSuffix: true });
      } else {
        return format(date, 'MMM d, h:mm a');
      }
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return '(unknown time)';
    }
  };

  // Get the exact timestamp for tooltip
  const getFullTimestamp = () => {
    try {
      if (!message.timestamp) return '';
      
      if (typeof message.timestamp === 'object' && message.timestamp !== null) {
        if ('seconds' in message.timestamp) {
          const seconds = message.timestamp.seconds || 0;
          const nanoseconds = message.timestamp.nanoseconds || 0;
          const milliseconds = seconds * 1000 + nanoseconds / 1000000;
          return format(new Date(milliseconds), 'PPpp'); // Detailed format
        }
      }
      
      return format(new Date(message.timestamp), 'PPpp');
    } catch (error) {
      return '';
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
          className={`text-xs mt-1 flex items-center justify-end ${
            isCurrentUserMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help">{formatTimestamp()}</span>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{getFullTimestamp()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {message.timestamp ? (
            isCurrentUserMessage && (
              <span className="ml-1 flex items-center">
                {message.read ? (
                  <CheckCheck className="h-3 w-3 ml-1" />
                ) : (
                  <Check className="h-3 w-3 ml-1" />
                )}
              </span>
            )
          ) : (
            <span className="ml-1 flex items-center">
              <Loader2 className="animate-spin h-3 w-3 mr-1" />
              <span>Sending...</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
