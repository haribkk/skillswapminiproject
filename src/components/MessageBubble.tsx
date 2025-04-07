
import React from 'react';
import { Message } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { useApp } from '../context/AppContext';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { currentUser } = useApp();
  const isCurrentUserMessage = message.senderId === currentUser?.id;
  
  return (
    <div 
      className={`flex ${isCurrentUserMessage ? 'justify-end' : 'justify-start'} mb-4`}
      data-message-type={isCurrentUserMessage ? 'sent' : 'received'}
    >
      <div 
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isCurrentUserMessage 
            ? 'bg-primary text-primary-foreground rounded-tr-none' 
            : 'bg-secondary text-secondary-foreground rounded-tl-none'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <div 
          className={`text-xs mt-1 ${
            isCurrentUserMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}
        >
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
