
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const SwapProposalForm: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { currentUser, users, createSwapProposal, sendMessage } = useApp();
  
  const otherUser = userId ? users.find(user => user.id === userId) : undefined;
  
  const [offeredSkillId, setOfferedSkillId] = useState('');
  const [requestedSkillId, setRequestedSkillId] = useState('');
  const [proposedSchedule, setProposedSchedule] = useState('');
  const [duration, setDuration] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  
  if (!currentUser || !otherUser) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6">
          The user you're trying to propose a swap to doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/browse">Browse Users</Link>
        </Button>
      </div>
    );
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const offeredSkill = currentUser.teachableSkills.find(skill => skill.id === offeredSkillId);
    const requestedSkill = otherUser.teachableSkills.find(skill => skill.id === requestedSkillId);
    
    if (!offeredSkill || !requestedSkill) {
      toast({
        title: "Missing Skills",
        description: "Please select the skills you want to teach and learn.",
        variant: "destructive"
      });
      return;
    }
    
    createSwapProposal({
      proposerId: currentUser.id,
      recipientId: otherUser.id,
      offeredSkill,
      requestedSkill,
      proposedSchedule,
      duration,
      learningGoals,
    });
    
    // Explicitly send a message about the proposal
    sendMessage({
      senderId: currentUser.id,
      receiverId: otherUser.id,
      content: `I've sent you a skill swap proposal! I'd like to teach you ${offeredSkill.name} in exchange for learning ${requestedSkill.name}.`,
    });
    
    toast({
      title: "Proposal Sent",
      description: `Your swap proposal has been sent to ${otherUser.name}.`
    });
    
    // Navigate to messages view with this user
    navigate(`/messages/${otherUser.id}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        asChild 
        variant="ghost" 
        className="mb-6"
      >
        <Link to={`/profile/${otherUser.id}`}>
          <ArrowLeft size={18} className="mr-2" />
          Back to {otherUser.name}'s Profile
        </Link>
      </Button>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Propose a Skill Swap</CardTitle>
          <CardDescription>
            Send a swap proposal to {otherUser.name} to exchange skills and knowledge.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="offeredSkill">Skill You'll Teach</Label>
                <Select value={offeredSkillId} onValueChange={setOfferedSkillId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentUser.teachableSkills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name} ({skill.proficiency})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requestedSkill">Skill You'll Learn</Label>
                <Select value={requestedSkillId} onValueChange={setRequestedSkillId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {otherUser.teachableSkills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name} ({skill.proficiency})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proposedSchedule">Proposed Schedule</Label>
              <Input
                id="proposedSchedule"
                placeholder="e.g., Tuesdays and Thursdays, 6-8PM"
                value={proposedSchedule}
                onChange={(e) => setProposedSchedule(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Proposed Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 6 weeks, 2 months"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="learningGoals">Your Learning Goals</Label>
              <Textarea
                id="learningGoals"
                placeholder="What do you hope to learn? Be specific about your goals."
                rows={4}
                value={learningGoals}
                onChange={(e) => setLearningGoals(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" className="w-full md:w-auto">
                Send Proposal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SwapProposalForm;
