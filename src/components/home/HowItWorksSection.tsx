
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, MessageSquare, CheckCircle } from 'lucide-react';

const HowItWorksSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How SkillSwap Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-secondary w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <Search size={28} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Discover Skills</h3>
            <p className="text-muted-foreground">
              Browse profiles of talented people offering skills you want to learn.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-secondary w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={28} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Connect & Propose</h3>
            <p className="text-muted-foreground">
              Message and propose a skill swap with someone whose skills interest you.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-secondary w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={28} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Learn & Teach</h3>
            <p className="text-muted-foreground">
              Schedule sessions, exchange knowledge, and grow your skillset together.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button asChild>
            <Link to="/how-it-works">
              Learn More About SkillSwap
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
