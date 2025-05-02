
import { useState } from 'react';
import { Conversation, Message } from '../../types';
import { ConversationActions } from './types';

export const useConversations = (initialConversations: Conversation[]): [
  Conversation[],
  ConversationActions
] => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

  const markConversationAsRead = (userId: string, otherUserId: string) => {
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (
          conv.participantIds.includes(userId) && 
          conv.participantIds.includes(otherUserId)
        ) {
          const updatedMessages = conv.messages.map(message => {
            if (message.receiverId === userId && !message.read) {
              return { ...message, read: true };
            }
            return message;
          });
          
          return {
            ...conv,
            messages: updatedMessages,
            unreadCount: 0
          };
        }
        return conv;
      });
    });
  };

  const getConversation = (userId: string, otherUserId: string) => {
    const conversation = conversations.find(
      (conv) => 
        conv.participantIds.includes(userId) && 
        conv.participantIds.includes(otherUserId)
    );
    
    if (!conversation) {
      console.log("No conversation found between", userId, "and", otherUserId);
      console.log("Available conversations:", conversations);
    }
    
    return conversation;
  };

  const sendMessage = (messageData: Omit<Message, 'id' | 'timestamp' | 'read'>) => {
    const { senderId, receiverId, content } = messageData;
    
    const newMessage: Message = {
      id: crypto.randomUUID(),
      senderId,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setConversations(prev => {
      const existingConversation = prev.find(
        conv => conv.participantIds.includes(senderId) && conv.participantIds.includes(receiverId)
      );
      
      if (existingConversation) {
        return prev.map(conv => {
          if (conv.id === existingConversation.id) {
            return {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessageTimestamp: newMessage.timestamp,
              unreadCount: conv.unreadCount + (senderId !== receiverId ? 1 : 0)
            };
          }
          return conv;
        });
      } else {
        const newConversation: Conversation = {
          id: crypto.randomUUID(),
          participantIds: [senderId, receiverId],
          lastMessageTimestamp: newMessage.timestamp,
          unreadCount: 1,
          messages: [newMessage]
        };
        
        return [...prev, newConversation];
      }
    });
  };

  return [
    conversations, 
    { getConversation, markConversationAsRead, sendMessage }
  ];
};
