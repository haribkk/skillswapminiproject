
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';
import ConversationSidebar from './ConversationSidebar';
import ChatArea from './ChatArea';
import EmptyConversation from '@/components/EmptyConversation';

interface MessagePageContentProps {
  userId?: string;
  currentUser: User;
  otherUser?: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile: boolean;
}

const MessagePageContent: React.FC<MessagePageContentProps> = ({
  userId,
  currentUser,
  otherUser,
  activeTab,
  setActiveTab,
  isMobile
}) => {
  const navigate = useNavigate();
  
  const showConversationList = isMobile && !userId;
  const showMessages = !isMobile || (isMobile && userId);
  
  return (
    <>
      {(!isMobile || showConversationList) && (
        <div className={`${isMobile ? 'w-full' : 'w-72'}`}>
          <ConversationSidebar 
            currentUserId={currentUser.id}
            activeUserId={userId}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      )}
      
      {showMessages && (
        <div className="flex-grow flex flex-col overflow-hidden">
          {otherUser ? (
            <ChatArea 
              currentUser={currentUser}
              otherUser={otherUser}
              isMobile={isMobile}
              onBackClick={() => navigate('/messages')}
            />
          ) : (
            <EmptyConversation />
          )}
        </div>
      )}
    </>
  );
};

export default MessagePageContent;
