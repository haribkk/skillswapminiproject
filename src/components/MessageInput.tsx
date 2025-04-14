
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface MessageInputProps {
  sendMessage: (text: string) => Promise<boolean>;
}

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage }) => {
  const [messageText, setMessageText] = useState('');

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

  return (
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
  );
};

export default MessageInput;
