
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ConversationItem from '../components/ConversationItem';
import MessageBubble from '../components/MessageBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFirebaseChat } from '@/hooks/useFirebaseChat';
import { toast } from '@/components/ui/use-toast';
import { ref, onValue } from 'firebase/database';
import { db } from '@/integrations/firebase/client';
import { Conversation } from '@/types';

const MessagesPage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { currentUser, users } = useApp();
  
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
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
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !currentUser || !otherUser) return;
    
    const success = await sendFirebaseMessage(messageText);
    
    if (success) {
      setMessageText('');
    } else {
      toast({
        title: "Message not sent",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
        <p className="text-lg text-muted-foreground mb-6">
          You need to sign in to access messages.
        </p>
        <Button asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
      </div>
    );
  }
  
  const showConversationList = isMobile && !userId;
  const showMessages = !isMobile || (isMobile && userId);
  
  return (
    <div className="container mx-auto p-0 flex flex-col h-[calc(100vh-64px-150px)] min-h-[500px]">
      <div className="flex flex-grow overflow-hidden">
        {(!isMobile || showConversationList) && (
          <div className={`${isMobile ? 'w-full' : 'w-72'} bg-card border-r h-full`}>
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Messages</h2>
              
              <Tabs 
                defaultValue="all" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="mt-3"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="received">Received</TabsTrigger>
                  <TabsTrigger value="sent">Sent</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <ScrollArea className="h-[calc(100%-85px)]">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <ConversationItem 
                    key={conv.id} 
                    conversation={conv} 
                    isActive={userId ? conv.participantIds.includes(userId) : false} 
                  />
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <p>No conversations {activeTab !== 'all' ? `in ${activeTab}` : ''} yet.</p>
                  {activeTab === 'all' && (
                    <Button asChild variant="link" className="mt-2">
                      <Link to="/browse">Find Users</Link>
                    </Button>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
        )}
        
        {showMessages && (
          <div className="flex-grow flex flex-col overflow-hidden">
            {otherUser ? (
              <>
                <div className="p-4 border-b flex items-center">
                  {isMobile && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="mr-2"
                      onClick={() => navigate('/messages')}
                    >
                      <ArrowLeft size={20} />
                    </Button>
                  )}
                  
                  <Link to={`/profile/${otherUser.id}`} className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img 
                        src={otherUser.profilePicture} 
                        alt={otherUser.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-lg font-medium">
                        {otherUser.name ? otherUser.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">{otherUser.name}</h3>
                      <p className="text-xs text-muted-foreground">{otherUser.location}</p>
                    </div>
                  </Link>
                </div>
                
                <ScrollArea className="flex-grow p-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-2">Loading messages...</p>
                      </div>
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-2">No messages yet.</p>
                        <p className="text-sm text-muted-foreground">
                          Send a message to start the conversation.
                        </p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex">
                    <Input
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="mr-2"
                    />
                    <Button type="submit" disabled={!messageText.trim()}>
                      <Send size={18} />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center">
                <div className="text-center p-4">
                  <h2 className="text-xl font-medium mb-2">Select a Conversation</h2>
                  <p className="text-muted-foreground mb-6">
                    Choose a conversation from the sidebar or start a new one.
                  </p>
                  <Button asChild>
                    <Link to="/browse">Browse Users</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
