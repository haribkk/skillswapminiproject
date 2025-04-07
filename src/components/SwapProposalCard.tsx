
import React from 'react';
import { SwapProposal } from '../types';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SkillBadge from './SkillBadge';
import { Calendar, Clock, Check, X } from 'lucide-react';

interface SwapProposalCardProps {
  proposal: SwapProposal;
}

const SwapProposalCard: React.FC<SwapProposalCardProps> = ({ proposal }) => {
  const { currentUser, getUserById, updateSwapProposalStatus } = useApp();
  
  const isProposer = currentUser?.id === proposal.proposerId;
  const otherUserId = isProposer ? proposal.recipientId : proposal.proposerId;
  const otherUser = getUserById(otherUserId);
  
  if (!otherUser) return null;
  
  const getStatusBadgeClass = () => {
    switch (proposal.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            Skill Swap with {otherUser.name}
          </CardTitle>
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass()}`}>
            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">
              {isProposer ? 'You offer:' : 'They offer:'}
            </h4>
            <SkillBadge skill={proposal.offeredSkill} />
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">
              {isProposer ? 'You request:' : 'They request:'}
            </h4>
            <SkillBadge skill={proposal.requestedSkill} />
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <Calendar size={16} className="mr-2" />
            <span>Proposed Schedule: {proposal.proposedSchedule}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Clock size={16} className="mr-2" />
            <span>Duration: {proposal.duration}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-1">Learning Goals:</h4>
          <p className="text-sm text-muted-foreground">{proposal.learningGoals}</p>
        </div>
      </CardContent>
      
      {proposal.status === 'pending' && !isProposer && (
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => updateSwapProposalStatus(proposal.id, 'declined')}
          >
            <X size={16} className="mr-1" />
            Decline
          </Button>
          <Button
            onClick={() => updateSwapProposalStatus(proposal.id, 'accepted')}
          >
            <Check size={16} className="mr-1" />
            Accept
          </Button>
        </CardFooter>
      )}
      
      {proposal.status === 'accepted' && (
        <CardFooter className="flex justify-end">
          <Button
            onClick={() => updateSwapProposalStatus(proposal.id, 'completed')}
          >
            <Check size={16} className="mr-1" />
            Mark as Completed
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SwapProposalCard;
