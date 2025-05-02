
import React, { useState, useEffect } from 'react';
import { Conversation } from '@/types';
import ConversationList from '@/components/ConversationList';
import { ref, onValue } from 'firebase/database';
import { db } from '@/integrations/firebase/client';

interface ConversationSidebarProps {
  currentUserId: string;
  activeUserId?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({ 
  currentUserId,
  activeUserId, 
  activeTab, 
  onTabChange 
}) => {
  const [firebaseConversations, setFirebaseConversations] = useState<Conversation[]>([]);
  
  // Listen for real-time conversation updates from Firebase
  useEffect(() => {
    if (!currentUserId) return;
    
    const userConversationsRef = ref(db, `users/${currentUserId}/conversations`);
    
    const unsubscribe = onValue(userConversationsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (!data) {
          setFirebaseConversations([]);
          return;
        }
        
        const conversationList: Conversation[] = Object.entries(data).map(([otherId, metadata]: [string, any]) => {
          const participantIds = [currentUserId, otherId];
          
          // Create a mock message for display purposes
          const mockMessage = {
            id: `last-${otherId}`,
            senderId: metadata.lastMessageSentByMe ? currentUserId : otherId,
            receiverId: metadata.lastMessageSentByMe ? otherId : currentUserId,
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
  }, [currentUserId]);
  
  // Filter conversations for the sidebar
  const filteredConversations = firebaseConversations.filter(conv => {
    if (!currentUserId) return false;
    
    if (activeTab === 'all') return true;
    
    // Get the other participant's ID
    const otherParticipantId = conv.participantIds.find(id => id !== currentUserId);
    if (!otherParticipantId) return false;
    
    // Get the last message from this conversation
    const lastMessage = conv.messages[0];
    if (!lastMessage) return false;
    
    if (activeTab === 'sent') {
      // Show in "sent" tab if the last message was sent by current user
      return lastMessage.senderId === currentUserId;
    } else if (activeTab === 'received') {
      // Show in "received" tab if the last message was received by current user
      return lastMessage.senderId !== currentUserId;
    }
    
    return true;
  });
  
  return (
    <ConversationList 
      conversations={filteredConversations}
      activeUserId={activeUserId}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
};

export default ConversationSidebar;
