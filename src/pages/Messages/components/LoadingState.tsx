
import React from 'react';

interface LoadingStateProps {
  message: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  return (
    <div className="container mx-auto p-4 flex justify-center items-center h-[calc(100vh-64px-150px)]">
      <p>{message}</p>
    </div>
  );
};

export default LoadingState;
