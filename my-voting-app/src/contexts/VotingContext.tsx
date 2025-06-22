import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VoterData, BiometricData, Vote, PrivacyCheck, VotingContextType } from '../types';

const VotingContext = createContext<VotingContextType | undefined>(undefined);

interface VotingProviderProps {
  children: ReactNode;
}

export const VotingProvider: React.FC<VotingProviderProps> = ({ children }) => {
  const [voterData, setVoterDataState] = useState<VoterData | null>(() => {
    const saved = localStorage.getItem('voting_data');
    return saved ? JSON.parse(saved).voterData || null : null;
  });

  const [biometricData, setBiometricDataState] = useState<BiometricData | null>(() => {
    const saved = localStorage.getItem('voting_data');
    return saved ? JSON.parse(saved).biometricData || null : null;
  });

  const [vote, setVoteState] = useState<Vote | null>(() => {
    const saved = localStorage.getItem('voting_data');
    return saved ? JSON.parse(saved).vote || null : null;
  });

  const [privacyCheck, setPrivacyCheckState] = useState<PrivacyCheck | null>(() => {
    const saved = localStorage.getItem('voting_data');
    return saved ? JSON.parse(saved).privacyCheck || null : null;
  });

  const saveToLocalStorage = (data: any) => {
    const currentData = JSON.parse(localStorage.getItem('voting_data') || '{}');
    localStorage.setItem('voting_data', JSON.stringify({ ...currentData, ...data }));
  };

  const setVoterData = (data: VoterData) => {
    setVoterDataState(data);
    saveToLocalStorage({ voterData: data });
  };

  const setBiometricData = (data: BiometricData) => {
    setBiometricDataState(data);
    saveToLocalStorage({ biometricData: data });
  };

  const setVote = (voteData: Vote) => {
    setVoteState(voteData);
    saveToLocalStorage({ vote: voteData });
  };

  const setPrivacyCheck = (check: PrivacyCheck) => {
    setPrivacyCheckState(check);
    saveToLocalStorage({ privacyCheck: check });
  };

  const resetVotingData = () => {
    setVoterDataState(null);
    setBiometricDataState(null);
    setVoteState(null);
    setPrivacyCheckState(null);
    localStorage.removeItem('voting_data');
  };

  return (
    <VotingContext.Provider value={{
      voterData,
      biometricData,
      vote,
      privacyCheck,
      setVoterData,
      setBiometricData,
      setVote,
      setPrivacyCheck,
      resetVotingData
    }}>
      {children}
    </VotingContext.Provider>
  );
};

export const useVoting = (): VotingContextType => {
  const context = useContext(VotingContext);
  if (context === undefined) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};

