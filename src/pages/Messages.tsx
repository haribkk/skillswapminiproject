import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ConversationItem from '../components/ConversationItem';
import MessageBubble from '../components/MessageBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MessagesPage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { currentUser, users, conversations, sendMessage, getConversation } = useApp();
  
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get other user if userId is provided
  const otherUser = userId ? users.find(user => user.id === userId) : undefined;
  
  // Get conversation if it exists
  const conversation = userId && currentUser 
    ? getConversation(currentUser.id, userId)
    : undefined;
  
  // Scroll to bottom of messages when conversation changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !currentUser || !otherUser) return;
    
    sendMessage({
      senderId: currentUser.id,
      receiverId: otherUser.id,
      content: messageText,
    });
    
    setMessageText('');
  };
  
  // If no user is selected and there are conversations, navigate to the first one
  useEffect(() => {
    if (!userId && conversations.length > 0 && currentUser) {
      const firstConv = conversations[0];
      const otherParticipantId = firstConv.participantIds.find(id => id !== currentUser.id);
      if (otherParticipantId) {
        navigate(`/messages/${otherParticipantId}`);
      }
    }
  }, [userId, conversations, currentUser, navigate]);
  
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
        <p className="text-lg text-muted-foreground mb-6">
          You need to sign in to access messages.
        </p>
        <Button asChild>
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-0 flex flex-col h-[calc(100vh-64px-150px)]">
      <div className="flex flex-grow overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-full md:w-72 bg-card border-r hidden md:block overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Messages</h2>
          </div>
          
          <div>
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <ConversationItem 
                  key={conv.id} 
                  conversation={conv} 
                  isActive={userId ? conv.participantIds.includes(userId) : false} 
                />
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <p>No conversations yet.</p>
                <Button asChild variant="link" className="mt-2">
                  <Link to="/browse">Find Users</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Message Content */}
        <div className="flex-grow flex flex-col overflow-hidden">
          {otherUser ? (
            <>
              {/* Message Header */}
              <div className="p-4 border-b flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden mr-2"
                  onClick={() => navigate('/messages')}
                >
                  <ArrowLeft size={20} />
                </Button>
                
                <Link to={`/profile/${otherUser.id}`} className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img 
                      src={otherUser.profilePicture} 
                      alt={otherUser.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{otherUser.name}</h3>
                    <p className="text-xs text-muted-foreground">{otherUser.location}</p>
                  </div>
                </Link>
              </div>
              
              {/* Messages */}
              <div className="flex-grow p-4 overflow-y-auto">
                {conversation && conversation.messages.length > 0 ? (
                  conversation.messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))
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
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message Input */}
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
              <div className="text-center">
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
      </div>
    </div>
  );
};

export default MessagesPage;
