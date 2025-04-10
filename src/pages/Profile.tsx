import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SkillBadge from '../components/SkillBadge';
import SwapProposalCard from '../components/SwapProposalCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Calendar, MapPin, Star, Clock, Edit, Phone } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/utils/userUtils';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { currentUser, users, swapProposals } = useApp();
  
  const user = userId 
    ? users.find(u => u.id === userId) 
    : currentUser;
  
  const userSwapProposals = swapProposals.filter(
    proposal => proposal.proposerId === user?.id || proposal.recipientId === user?.id
  );
  
  const isCurrentUser = user?.id === currentUser?.id;
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6">
          The user you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/browse">Browse Users</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                  <Avatar className="w-full h-full">
                    <AvatarImage 
                      src={user.profilePicture} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </div>
                <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                
                <div className="flex items-center text-yellow-500 mb-2">
                  <Star size={18} className="fill-current" />
                  <span className="ml-1">{user.rating.toFixed(1)} ({user.completedSwaps} swaps)</span>
                </div>
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin size={16} className="mr-1" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center text-muted-foreground mb-4">
                  <Clock size={16} className="mr-1" />
                  <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                </div>
                
                {!isCurrentUser && (
                  <Button asChild className="w-full">
                    <Link to={`/messages/${user.id}`}>
                      <MessageSquare size={16} className="mr-2" />
                      Message
                    </Link>
                  </Button>
                )}
                
                {isCurrentUser && (
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/profile/edit">
                      <Edit size={16} className="mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                )}
                
                {user.phone && (
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Phone size={16} className="mr-1" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">About</h2>
                <p className="text-muted-foreground">{user.bio}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Availability</h2>
                <div className="flex items-start">
                  <Calendar size={16} className="mr-2 mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">{user.availability}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Preferred Learning Method</h2>
                <p className="text-muted-foreground capitalize">
                  {user.locationPreference === 'both' 
                    ? 'In-person & Online' 
                    : user.locationPreference}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="skills">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="proposals">Swap Proposals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Skills I Teach</h2>
                    {user.teachableSkills.length > 0 ? (
                      <div>
                        {user.teachableSkills.map((skill) => (
                          <SkillBadge key={skill.id} skill={skill} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No teachable skills listed yet.</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Skills I Want to Learn</h2>
                    {user.desiredSkills.length > 0 ? (
                      <div>
                        {user.desiredSkills.map((skill) => (
                          <SkillBadge key={skill.id} skill={skill} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No desired skills listed yet.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {!isCurrentUser && (
                <div className="mt-6">
                  <Button asChild className="w-full">
                    <Link to={`/swap-proposal/new/${user.id}`}>
                      Propose a Skill Swap
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="proposals" className="mt-0">
              {userSwapProposals.length > 0 ? (
                <div className="space-y-4">
                  {userSwapProposals.map((proposal) => (
                    <SwapProposalCard key={proposal.id} proposal={proposal} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <h3 className="text-lg font-medium mb-2">No Swap Proposals Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      {isCurrentUser
                        ? "You haven't sent or received any skill swap proposals yet."
                        : "This user doesn't have any active skill swap proposals."}
                    </p>
                    {isCurrentUser ? (
                      <Button asChild>
                        <Link to="/browse">Browse Users</Link>
                      </Button>
                    ) : (
                      <Button asChild>
                        <Link to={`/swap-proposal/new/${user.id}`}>
                          Propose a Skill Swap
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
