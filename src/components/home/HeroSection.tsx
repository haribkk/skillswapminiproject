
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const HeroSection = () => {
  const { user } = useAuth();
  
  return (
    <section className="bg-gradient-to-r from-primary/10 to-accent py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Swap Skills, Grow Together
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            A peer-to-peer learning marketplace where you can exchange expertise and discover new skills from people in your community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/browse">Find Skills</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              {user ? (
                <Link to="/profile">Share Your Skills</Link>
              ) : (
                <Link to="/auth">Join Now</Link>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
