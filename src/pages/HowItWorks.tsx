
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare, CheckCircle, ArrowRight, Users, Star, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const HowItWorks: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">How SkillSwap Works</h1>
        
        <div className="space-y-16">
          {/* Step 1 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-2">
              <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto md:mx-0">
                <Search size={40} className="text-primary" />
              </div>
            </div>
            <div className="md:col-span-3">
              <h2 className="text-2xl font-bold mb-4">1. Discover Skills</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Browse through our community of skilled individuals who are eager to share their knowledge. 
                Filter by skill category, location, or teaching method to find the perfect match for what you want to learn.
              </p>
              <Button asChild variant="outline">
                <Link to="/browse">
                  Browse Skills Now
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-2 md:order-2">
              <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto md:mx-0">
                <MessageSquare size={40} className="text-primary" />
              </div>
            </div>
            <div className="md:col-span-3 md:order-1">
              <h2 className="text-2xl font-bold mb-4">2. Connect & Propose</h2>
              <p className="text-lg text-muted-foreground mb-4">
                When you find someone whose skills interest you, send them a message to start a conversation. 
                Propose a skill swap by specifying what you can teach in exchange for what you want to learn.
              </p>
              <div className="bg-muted p-4 rounded-md">
                <p className="font-medium">Tip:</p>
                <p className="text-muted-foreground">
                  Be specific about your skill level and what you hope to achieve through the swap. 
                  This helps create realistic expectations for both parties.
                </p>
              </div>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-2">
              <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto md:mx-0">
                <Calendar size={40} className="text-primary" />
              </div>
            </div>
            <div className="md:col-span-3">
              <h2 className="text-2xl font-bold mb-4">3. Schedule & Learn</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Once your swap proposal is accepted, coordinate schedules and set up your first session. 
                You can choose to meet in person or connect online, depending on your preferences.
              </p>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Popular Scheduling Options:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Weekly 1-hour sessions</li>
                    <li>Intensive weekend workshops</li>
                    <li>Flexible on-demand meetings</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Step 4 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-2 md:order-2">
              <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto md:mx-0">
                <CheckCircle size={40} className="text-primary" />
              </div>
            </div>
            <div className="md:col-span-3 md:order-1">
              <h2 className="text-2xl font-bold mb-4">4. Complete & Rate</h2>
              <p className="text-lg text-muted-foreground mb-4">
                After completing your skill swap, both parties confirm completion and leave ratings and reviews. 
                This builds your reputation in the community and helps others find reliable swap partners.
              </p>
              <div className="flex items-center text-yellow-500 mb-4">
                <Star size={20} className="fill-current" />
                <Star size={20} className="fill-current" />
                <Star size={20} className="fill-current" />
                <Star size={20} className="fill-current" />
                <Star size={20} className="fill-current" />
                <span className="ml-2 text-foreground font-medium">Great teacher, highly recommended!</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Community Benefits */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Benefits of Skill Swapping</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-primary">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Build Connections</h3>
                <p className="text-muted-foreground">
                  Connect with like-minded individuals who share your passion for learning and teaching.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-primary">
                  <Star size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Learn by Teaching</h3>
                <p className="text-muted-foreground">
                  Reinforce your own knowledge and gain new perspectives by teaching others what you know.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-primary">
                  <Calendar size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Flexible Learning</h3>
                <p className="text-muted-foreground">
                  Learn at your own pace and on your own schedule, without the constraints of formal courses.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Swapping Skills?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of lifelong learners and start exchanging knowledge today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/browse">Find Skills to Learn</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/profile/edit">Share Your Skills</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
