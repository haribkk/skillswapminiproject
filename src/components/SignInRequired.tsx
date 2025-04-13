
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SignInRequired: React.FC = () => {
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
};

export default SignInRequired;
