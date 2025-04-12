
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import UserCard from '@/components/UserCard';
import { useProfiles } from '@/hooks/useProfiles';
import { useAuth } from '@/context/AuthContext';

const FeaturedUsersSection = () => {
  const { data: profiles = [], isLoading } = useProfiles();
  const { user } = useAuth();
  
  // Get featured users to display (up to 4 most recently joined users)
  const featuredUsers = [...profiles]
    .sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime())
    .slice(0, 4);
  
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Featured Skill Swappers</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Meet some of our community members who are ready to share their expertise and learn new skills.
        </p>
        
        {isLoading ? (
          <div className="text-center py-10">Loading featured users...</div>
        ) : featuredUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredUsers.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-6">No users have joined yet. Be the first!</p>
            {!user && (
              <Button asChild>
                <Link to="/auth">Create Your Profile</Link>
              </Button>
            )}
          </div>
        )}
        
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
  );
};

export default FeaturedUsersSection;
