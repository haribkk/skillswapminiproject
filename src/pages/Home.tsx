
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Users, MessageSquare, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import UserCard from '../components/UserCard';

const Home: React.FC = () => {
  const { users } = useApp();
  
  // Get featured users to display (up to 4 most recently joined users)
  const featuredUsers = [...users]
    .sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime())
    .slice(0, 4);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
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
                <Link to="/profile">Share Your Skills</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
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

      {/* Featured Users */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Featured Skill Swappers</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Meet some of our community members who are ready to share their expertise and learn new skills.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredUsers.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link to="/browse">
                View All Skill Swappers
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Skill Categories</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Programming', icon: '💻', color: 'bg-blue-100' },
              { name: 'Languages', icon: '🗣️', color: 'bg-green-100' },
              { name: 'Music', icon: '🎵', color: 'bg-purple-100' },
              { name: 'Cooking', icon: '🍳', color: 'bg-yellow-100' },
              { name: 'Photography', icon: '📸', color: 'bg-pink-100' },
              { name: 'Fitness', icon: '💪', color: 'bg-red-100' },
              { name: 'Art & Design', icon: '🎨', color: 'bg-indigo-100' },
              { name: 'Business', icon: '📊', color: 'bg-teal-100' },
            ].map((category) => (
              <div 
                key={category.name}
                className={`${category.color} rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-medium">{category.name}</h3>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link to="/browse">
                Explore All Categories
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Community Stats */}
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

      {/* CTA */}
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
    </div>
  );
};

export default Home;
