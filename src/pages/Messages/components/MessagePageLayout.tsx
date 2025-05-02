
import React from 'react';

interface MessagePageLayoutProps {
  children: React.ReactNode;
}

const MessagePageLayout: React.FC<MessagePageLayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto p-0 flex flex-col h-[calc(100vh-64px-150px)] min-h-[500px]">
      <div className="flex flex-grow overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default MessagePageLayout;
