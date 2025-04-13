
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const EmptyConversation: React.FC = () => {
  return (
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
  );
};

export default EmptyConversation;
