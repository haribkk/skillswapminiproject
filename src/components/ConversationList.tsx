
import React from 'react';
import { Conversation } from '../types';
import ConversationItem from './ConversationItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ConversationListProps {
  conversations: Conversation[];
  activeUserId?: string;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeUserId,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="h-full bg-card border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
        
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={onTabChange}
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
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <ConversationItem 
              key={conv.id} 
              conversation={conv} 
              isActive={activeUserId ? conv.participantIds.includes(activeUserId) : false} 
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
  );
};

export default ConversationList;
