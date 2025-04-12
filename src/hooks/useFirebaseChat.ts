
import { useEffect, useState } from 'react';
import { ref, onValue, push, set, serverTimestamp, query, orderByChild } from 'firebase/database';
import { db } from '../integrations/firebase/client';
import { Message } from '../types';

export const useFirebaseChat = (currentUserId: string | undefined, otherUserId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
          const aTime = new Date(a.timestamp).getTime();
          const bTime = new Date(b.timestamp).getTime();
          return aTime - bTime;
        });

        setMessages(messageList);
        setLoading(false);
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

      // Update last message for both users for quick conversation access
      const userARef = ref(db, `users/${currentUserId}/conversations/${otherUserId}`);
      const userBRef = ref(db, `users/${otherUserId}/conversations/${currentUserId}`);
      
      const conversationData = {
        lastMessage: content.trim(),
        timestamp: serverTimestamp(),
        unread: true
      };
      
      await set(userARef, {
        ...conversationData,
        unread: false
      });
      
      await set(userBRef, conversationData);
      
      return true;
    } catch (err) {
      console.error("Error sending message:", err);
      return false;
    }
  };

  const markAsRead = async () => {
    if (!currentUserId || !otherUserId) {
      return;
    }

    try {
      const conversationId = [currentUserId, otherUserId].sort().join('_');
      
      // Update the unread status for the current user's conversation with other user
      const userConversationRef = ref(db, `users/${currentUserId}/conversations/${otherUserId}`);
      await set(userConversationRef, {
        unread: false
      }, { merge: true });
      
      // Mark all received messages as read
      messages.forEach(async (message) => {
        if (message.receiverId === currentUserId && !message.read) {
          const messageRef = ref(db, `conversations/${conversationId}/messages/${message.id}`);
          await set(messageRef, { read: true }, { merge: true });
        }
      });
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead
  };
};
