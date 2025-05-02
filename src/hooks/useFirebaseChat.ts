
import { useEffect, useState, useCallback } from 'react';
import { ref, onValue, push, set, serverTimestamp, query, orderByChild, update } from 'firebase/database';
import { db } from '../integrations/firebase/client';
import { Message, Conversation } from '../types';

export const useFirebaseChat = (currentUserId?: string, otherUserId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [firebaseConversations, setFirebaseConversations] = useState<Conversation[]>([]);

  // Fetch messages for a conversation
  useEffect(() => {
    if (!currentUserId || !otherUserId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    // Create a conversation ID based on user IDs (alphabetically sorted to ensure consistency)
    const conversationId = [currentUserId, otherUserId].sort().join('_');
    const messagesRef = ref(db, `conversations/${conversationId}/messages`);
    const messagesQuery = query(messagesRef, orderByChild('timestamp'));

    setLoading(true);

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      try {
        const data = snapshot.val();
        if (!data) {
          setMessages([]);
          setLoading(false);
          return;
        }

        const messageList: Message[] = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          senderId: value.senderId,
          receiverId: value.receiverId,
          content: value.content,
          timestamp: value.timestamp,
          read: value.read || false
        }));

        // Sort messages by timestamp
        messageList.sort((a, b) => {
          // Handle Firebase server timestamps which might be objects
          const getTime = (timestamp: any) => {
            if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
              return timestamp.seconds * 1000;
            }
            return new Date(timestamp || 0).getTime();
          };
          
          return getTime(a.timestamp) - getTime(b.timestamp);
        });

        setMessages(messageList);
        setLoading(false);
        
        // Mark messages as read if the current user is the receiver
        const unreadMessages = messageList.filter(
          msg => msg.receiverId === currentUserId && !msg.read
        );
        
        if (unreadMessages.length > 0) {
          markAsRead();
        }
      } catch (err) {
        console.error("Error loading messages:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    }, (err) => {
      console.error("Firebase error:", err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserId, otherUserId]);

  // Fetch all conversations for the current user
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

  const sendMessage = async (content: string) => {
    if (!currentUserId || !otherUserId || !content.trim()) {
      return false;
    }

    try {
      // Create a conversation ID based on user IDs (alphabetically sorted to ensure consistency)
      const conversationId = [currentUserId, otherUserId].sort().join('_');
      const messagesRef = ref(db, `conversations/${conversationId}/messages`);
      
      const newMessageRef = push(messagesRef);
      
      const newMessage = {
        senderId: currentUserId,
        receiverId: otherUserId,
        content: content.trim(),
        timestamp: serverTimestamp(),
        read: false
      };
      
      await set(newMessageRef, newMessage);

      // Update conversation metadata for both sender and receiver
      const senderRef = ref(db, `users/${currentUserId}/conversations/${otherUserId}`);
      const receiverRef = ref(db, `users/${otherUserId}/conversations/${currentUserId}`);
      
      const senderData = {
        lastMessage: content.trim(),
        timestamp: serverTimestamp(),
        unread: false,
        lastMessageSentByMe: true
      };
      
      const receiverData = {
        lastMessage: content.trim(),
        timestamp: serverTimestamp(),
        unread: true,
        lastMessageSentByMe: false
      };
      
      await set(senderRef, senderData);
      await set(receiverRef, receiverData);
      
      return true;
    } catch (err) {
      console.error("Error sending message:", err);
      return false;
    }
  };

  const markAsRead = useCallback(async () => {
    if (!currentUserId || !otherUserId) {
      return;
    }

    try {
      const conversationId = [currentUserId, otherUserId].sort().join('_');
      
      // Update the unread status for the current user's conversation with other user
      const userConversationRef = ref(db, `users/${currentUserId}/conversations/${otherUserId}`);
      await update(userConversationRef, {
        unread: false
      });
      
      // Mark all received messages as read
      for (const message of messages) {
        if (message.receiverId === currentUserId && !message.read) {
          const messageRef = ref(db, `conversations/${conversationId}/messages/${message.id}`);
          await update(messageRef, { read: true });
        }
      }
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  }, [currentUserId, otherUserId, messages]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    firebaseConversations
  };
};
