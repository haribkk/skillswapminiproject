
import React from 'react';
import { User } from '@/types';
import ConversationHeader from '@/components/ConversationHeader';
import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import { useFirebaseChat } from '@/hooks/useFirebaseChat';

interface ChatAreaProps {
  currentUser: User;
  otherUser: User;
  isMobile: boolean;
  onBackClick: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ 
  currentUser, 
  otherUser, 
  isMobile, 
  onBackClick 
}) => {
  const { 
    messages, 
    loading, 
    error, 
    sendMessage: sendFirebaseMessage, 
    markAsRead 
  } = useFirebaseChat(currentUser.id, otherUser.id);
  
  // Mark messages as read when conversation is opened
  React.useEffect(() => {
    if (otherUser.id && currentUser.id) {
      markAsRead();
    }
  }, [otherUser.id, currentUser.id, markAsRead]);
  
  // Handle error in chat
  React.useEffect(() => {
    if (error) {
      import('@/components/ui/use-toast').then(({ toast }) => {
        toast({
          title: "Chat Error",
          description: "There was an error loading messages. Please try again.",
          variant: "destructive"
        });
      });
    }
  }, [error]);
  
  const handleSendMessage = async (text: string) => {
    if (!currentUser || !otherUser) return false;
    return await sendFirebaseMessage(text);
  };
  
  return (
    <>
      <ConversationHeader 
        otherUser={otherUser}
        isMobile={isMobile}
        onBackClick={onBackClick}
      />
      
      <MessageList messages={messages} loading={loading} />
      
      <MessageInput sendMessage={handleSendMessage} />
    </>
  );
};

export default ChatArea;
