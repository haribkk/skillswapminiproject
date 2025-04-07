
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">About SkillSwap</h1>
      
      <div className="max-w-3xl mx-auto mb-12">
        <p className="text-lg text-center text-muted-foreground mb-8">
          SkillSwap is a peer-to-peer learning marketplace where users can exchange their expertise for new skills.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                We believe everyone has valuable knowledge to share. SkillSwap creates a community 
                where people can teach what they're good at and learn what they're curious about,
                without financial barriers.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">How It Works</h2>
              <p className="text-muted-foreground">
                Create a profile showcasing your teachable skills and the skills you want to learn.
                Browse other users, connect through our messaging system, and propose skill exchanges
                that benefit both parties.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Profile Creation</h3>
              <p className="text-sm text-muted-foreground">
                List your teachable skills, desired skills, availability, and learning preferences.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Skill Discovery</h3>
              <p className="text-sm text-muted-foreground">
                Browse and search for users based on skills, location, and availability.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Swap Proposals</h3>
              <p className="text-sm text-muted-foreground">
                Send structured skill swap proposals including schedule, goals, and duration.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Button asChild size="lg">
            <Link to="/browse">Start Exploring Skills</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
