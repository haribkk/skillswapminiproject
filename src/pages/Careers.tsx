
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Users, Globe, Send } from 'lucide-react';

const Careers: React.FC = () => {
  const openPositions = [
    {
      id: 1,
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Hybrid',
      type: 'Full-time',
    },
    {
      id: 3,
      title: 'Community Manager',
      department: 'Operations',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      id: 4,
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'On-site',
      type: 'Full-time',
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Join Our Team</h1>
        <p className="text-xl mb-12">
          Help us build the future of skill exchange and community learning
        </p>

        <div className="bg-secondary/30 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold mb-6">Why Work at SkillSwap?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6">
              <Heart className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-medium mb-2">Meaningful Impact</h3>
              <p className="text-muted-foreground">
                Help build a platform that empowers people to learn from each other and grow their skills.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-medium mb-2">Collaborative Culture</h3>
              <p className="text-muted-foreground">
                Work with passionate, talented individuals who value knowledge sharing and collaboration.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6">
              <Globe className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-medium mb-2">Flexible Work</h3>
              <p className="text-muted-foreground">
                Enjoy the freedom of remote work with flexible hours and a healthy work-life balance.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6">Open Positions</h2>
        <div className="space-y-4 mb-12">
          {openPositions.map((position) => (
            <div key={position.id} className="border border-border rounded-lg p-6 hover:border-primary transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-xl font-medium">{position.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      {position.department}
                    </span>
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      {position.location}
                    </span>
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      {position.type}
                    </span>
                  </div>
                </div>
                <Button className="mt-4 md:mt-0">
                  <Send className="mr-2 h-4 w-4" />
                  Apply Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary/10 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Don't see a perfect fit?</h2>
          <p className="mb-6">
            We're always looking for talented individuals to join our team. Send us your resume and tell us why you'd be a great addition to SkillSwap.
          </p>
          <Button variant="outline">
            Submit Open Application
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Careers;
