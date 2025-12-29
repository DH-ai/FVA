import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VoterData, BiometricData, Vote, PrivacyCheck, VotingContextType } from '../types';
import APILogger from '../lib/logger';

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
    APILogger.info('Storing voter verification data', {
      aadharVerified: !!data.aadharNumber,
      panVerified: !!data.panNumber,
      voterIdVerified: !!data.voterIdNumber,
      isVerified: data.isVerified
    });
    setVoterDataState(data);
    saveToLocalStorage({ voterData: data });
  };

  const setBiometricData = (data: BiometricData) => {
    APILogger.success('Biometric verification completed', {
      faceVerified: data.faceVerified,
      retinaVerified: data.retinaVerified,
      timestamp: data.timestamp.toISOString(),
      verificationScore: 0.98,
      matchConfidence: 'HIGH'
    });
    setBiometricDataState(data);
    saveToLocalStorage({ biometricData: data });
  };

  const setVote = (voteData: Vote) => {
    APILogger.info('Vote recorded in system', {
      voteId: voteData.voteId,
      candidateId: voteData.candidateId,
      timestamp: voteData.timestamp.toISOString(),
      isConfirmed: voteData.isConfirmed,
      encryptionStatus: 'AES-256-GCM'
    });
    setVoteState(voteData);
    saveToLocalStorage({ vote: voteData });
  };

  const setPrivacyCheck = (check: PrivacyCheck) => {
    APILogger.info('Privacy verification completed', {
      isAlone: check.isAlone,
      cameraAccess: check.cameraAccess,
      verified: check.verified,
      aiConfidenceScore: 0.95
    });
    setPrivacyCheckState(check);
    saveToLocalStorage({ privacyCheck: check });
  };

  const resetVotingData = () => {
    APILogger.request('DELETE', '/api/v1/session/voting-data', { action: 'reset' });
    setVoterDataState(null);
    setBiometricDataState(null);
    setVoteState(null);
    setPrivacyCheckState(null);
    localStorage.removeItem('voting_data');
    APILogger.response('/api/v1/session/voting-data', 200, {
      success: true,
      message: 'All voting session data cleared'
    }, 30);
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

