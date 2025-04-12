
import React from 'react';

const CommunityStatsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
            <p className="text-lg text-muted-foreground">Active Members</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">120+</div>
            <p className="text-lg text-muted-foreground">Unique Skills</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">8,500+</div>
            <p className="text-lg text-muted-foreground">Successful Swaps</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityStatsSection;
