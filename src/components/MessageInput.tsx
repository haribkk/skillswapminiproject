
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, Image, Smile } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface MessageInputProps {
  sendMessage: (text: string) => Promise<boolean>;
}

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage }) => {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle auto-focus of the input field
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    const success = await sendMessage(messageText);
    
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

  // Handle attachment button click (future feature)
  const handleAttachmentClick = () => {
    toast({
      title: "Coming soon",
      description: "File attachments will be available in a future update.",
    });
  };

  return (
    <div className="p-4 border-t">
      <form onSubmit={handleSendMessage} className="flex items-center">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="mr-1"
          onClick={handleAttachmentClick}
        >
          <Paperclip size={18} />
        </Button>
        
        <Input
          ref={inputRef}
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
            setIsTyping(e.target.value.length > 0);
          }}
          className="mr-2"
        />
        
        <Button 
          type="submit" 
          disabled={!messageText.trim()}
          className={`transition-colors ${isTyping ? 'bg-green-500 hover:bg-green-600' : ''}`}
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
