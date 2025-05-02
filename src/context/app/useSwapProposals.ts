
import { useState } from 'react';
import { SwapProposal } from '../../types';
import { SwapProposalActions } from './types';

export const useSwapProposals = (initialProposals: SwapProposal[]): [
  SwapProposal[], 
  SwapProposalActions
] => {
  const [swapProposals, setSwapProposals] = useState<SwapProposal[]>(initialProposals);

  const createSwapProposal = (proposalData: Omit<SwapProposal, 'id' | 'status' | 'createdAt'>) => {
    const newProposal: SwapProposal = {
      ...proposalData,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setSwapProposals(prev => [...prev, newProposal]);
  };
  
  const updateSwapProposalStatus = (proposalId: string, status: SwapProposal['status']) => {
    setSwapProposals(prev => 
      prev.map(proposal => 
        proposal.id === proposalId 
          ? { ...proposal, status } 
          : proposal
      )
    );
  };

  return [swapProposals, { createSwapProposal, updateSwapProposalStatus }];
};
