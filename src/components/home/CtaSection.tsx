
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CtaSection = () => {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Share Your Knowledge?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of lifelong learners and start exchanging skills today.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link to="/profile">Create Your Profile</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
