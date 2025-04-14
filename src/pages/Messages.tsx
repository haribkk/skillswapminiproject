
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Conversation } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFirebaseChat } from '@/hooks/useFirebaseChat';
import { toast } from '@/components/ui/use-toast';
import { ref, onValue } from 'firebase/database';
import { db } from '@/integrations/firebase/client';
import { useAuth } from '../context/AuthContext';

// Imported components
import ConversationList from '@/components/ConversationList';
import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import ConversationHeader from '@/components/ConversationHeader';
import EmptyConversation from '@/components/EmptyConversation';
import SignInRequired from '@/components/SignInRequired';

const MessagesPage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { currentUser, users } = useApp();
  const { user, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('all');
  const isMobile = useIsMobile();
  const [firebaseConversations, setFirebaseConversations] = useState<Conversation[]>([]);
  
  const otherUser = userId ? users.find(user => user.id === userId) : undefined;
  
  const { 
    messages, 
    loading, 
    error, 
    sendMessage: sendFirebaseMessage, 
    markAsRead 
  } = useFirebaseChat(currentUser?.id, userId);
  
  // Listen for real-time conversation updates from Firebase
  useEffect(() => {
    if (!currentUser?.id) return;
    
    const userConversationsRef = ref(db, `users/${currentUser.id}/conversations`);
    
    const unsubscribe = onValue(userConversationsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (!data) {
          setFirebaseConversations([]);
          return;
        }
        
        const conversationList: Conversation[] = Object.entries(data).map(([otherId, metadata]: [string, any]) => {
          const participantIds = [currentUser.id, otherId];
          
          // Create a mock message for display purposes
          const mockMessage = {
            id: `last-${otherId}`,
            senderId: metadata.lastMessageSentByMe ? currentUser.id : otherId,
            receiverId: metadata.lastMessageSentByMe ? otherId : currentUser.id,
            content: metadata.lastMessage || '',
            timestamp: metadata.timestamp,
            read: !metadata.unread
          };
          
          return {
            id: participantIds.sort().join('_'),
            participantIds: participantIds,
            messages: [mockMessage],
            lastMessageTimestamp: metadata.timestamp,
            unreadCount: metadata.unread ? 1 : 0
          };
        });
        
        // Sort by most recent message
        conversationList.sort((a, b) => {
          const getTime = (timestamp: any) => {
            if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
              return timestamp.seconds * 1000;
            }
            return new Date(timestamp || 0).getTime();
          };
          
          return getTime(b.lastMessageTimestamp) - getTime(a.lastMessageTimestamp);
        });
        
        setFirebaseConversations(conversationList);
      } catch (err) {
        console.error("Error loading conversations:", err);
      }
    });
    
    return () => unsubscribe();
  }, [currentUser?.id]);
  
  // Filter conversations for the sidebar
  const filteredConversations = firebaseConversations.filter(conv => {
    if (!currentUser) return false;
    
    if (activeTab === 'all') return true;
    
    // Get the other participant's ID
    const otherParticipantId = conv.participantIds.find(id => id !== currentUser.id);
    if (!otherParticipantId) return false;
    
    // Get the last message from this conversation
    const lastMessage = conv.messages[0];
    if (!lastMessage) return false;
    
    if (activeTab === 'sent') {
      // Show in "sent" tab if the last message was sent by current user
      return lastMessage.senderId === currentUser.id;
    } else if (activeTab === 'received') {
      // Show in "received" tab if the last message was received by current user
      return lastMessage.senderId !== currentUser.id;
    }
    
    return true;
  });
  
  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (userId && currentUser) {
      markAsRead();
    }
  }, [userId, currentUser, markAsRead]);
  
  // Handle error in chat
  useEffect(() => {
    if (error) {
      toast({
        title: "Chat Error",
        description: "There was an error loading messages. Please try again.",
        variant: "destructive"
      });
    }
  }, [error]);
  
  // Auto-select first conversation on desktop
  useEffect(() => {
    if (!userId && firebaseConversations.length > 0 && currentUser && !isMobile) {
      const firstConv = firebaseConversations[0];
      const otherParticipantId = firstConv.participantIds.find(id => id !== currentUser.id);
      if (otherParticipantId) {
        navigate(`/messages/${otherParticipantId}`);
      }
    }
  }, [userId, firebaseConversations, currentUser, navigate, isMobile]);
  
  const handleSendMessage = async (text: string) => {
    if (!currentUser || !otherUser) return false;
    return await sendFirebaseMessage(text);
  };
  
  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-[calc(100vh-64px-150px)]">
        <p>Loading...</p>
      </div>
    );
  }
  
  // Only check for user auth after loading is complete
  if (!user) {
    return <SignInRequired />;
  }
  
  // Now check for currentUser from AppContext
  if (!currentUser) {
    // If auth user exists but currentUser doesn't, we're likely still loading the profile
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-[calc(100vh-64px-150px)]">
        <p>Loading user profile...</p>
      </div>
    );
  }
  
  const showConversationList = isMobile && !userId;
  const showMessages = !isMobile || (isMobile && userId);
  
  return (
    <div className="container mx-auto p-0 flex flex-col h-[calc(100vh-64px-150px)] min-h-[500px]">
      <div className="flex flex-grow overflow-hidden">
        {(!isMobile || showConversationList) && (
          <div className={`${isMobile ? 'w-full' : 'w-72'}`}>
            <ConversationList 
              conversations={filteredConversations}
              activeUserId={userId}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        )}
        
        {showMessages && (
          <div className="flex-grow flex flex-col overflow-hidden">
            {otherUser ? (
              <>
                <ConversationHeader 
                  otherUser={otherUser}
                  isMobile={isMobile}
                  onBackClick={() => navigate('/messages')}
                />
                
                <MessageList messages={messages} loading={loading} />
                
                <MessageInput sendMessage={handleSendMessage} />
              </>
            ) : (
              <EmptyConversation />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
