
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '../../context/AuthContext';
import SignInRequired from '@/components/SignInRequired';
import MessagePageLayout from './components/MessagePageLayout';
import MessagePageContent from './components/MessagePageContent';
import LoadingState from './components/LoadingState';

const MessagesPage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { currentUser, users } = useApp();
  const { user, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('all');
  const isMobile = useIsMobile();
  
  const otherUser = userId ? users.find(user => user.id === userId) : undefined;
  
  // Auto-select first conversation on desktop
  useEffect(() => {
    if (!userId && currentUser && !isMobile) {
      import('@/hooks/useFirebaseChat').then(({ useFirebaseChat }) => {
        const { firebaseConversations } = useFirebaseChat(currentUser.id);
        if (firebaseConversations.length > 0) {
          const firstConv = firebaseConversations[0];
          const otherParticipantId = firstConv.participantIds.find(id => id !== currentUser.id);
          if (otherParticipantId) {
            navigate(`/messages/${otherParticipantId}`);
          }
        }
      });
    }
  }, [userId, currentUser, navigate, isMobile]);
  
  // Show loading state while auth is being checked
  if (authLoading) {
    return <LoadingState message="Loading..." />;
  }
  
  // Only check for user auth after loading is complete
  if (!user) {
    return <SignInRequired />;
  }
  
  // Now check for currentUser from AppContext
  if (!currentUser) {
    // If auth user exists but currentUser doesn't, we're likely still loading the profile
    return <LoadingState message="Loading user profile..." />;
  }
  
  return (
    <MessagePageLayout>
      <MessagePageContent 
        userId={userId} 
        currentUser={currentUser}
        otherUser={otherUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
      />
    </MessagePageLayout>
  );
};

export default MessagesPage;
