
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';

const SignInRequired: React.FC = () => {
  const { user, loading } = useAuth();

  // If we're still loading auth state or user is actually signed in,
  // don't show the sign-in required message
  if (loading || user) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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
