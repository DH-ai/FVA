// User authentication
export interface User {
  id: string;
  username: string;
  isAuthenticated: boolean;
}

// Voter verification data
export interface VoterData {
  aadharNumber?: string;
  panNumber?: string;
  voterIdNumber?: string;
  phoneNumber?: string;
  isVerified: boolean;
}

// Biometric verification
export interface BiometricData {
  faceVerified: boolean;
  retinaVerified: boolean;
  timestamp: Date;
}

// Voting data
export interface Candidate {
  id: string;
  name: string;
  party: string;
  symbol: string;
}

export interface Vote {
  candidateId: string;
  timestamp: Date;
  voteId: string;
  isConfirmed: boolean;
}

// Privacy verification
export interface PrivacyCheck {
  isAlone: boolean;
  cameraAccess: boolean;
  verified: boolean;
}

// Language support
export interface Language {
  code: 'en' | 'hi';
  name: string;
}

// Application state
export interface AppState {
  user: User | null;
  voterData: VoterData | null;
  biometricData: BiometricData | null;
  vote: Vote | null;
  privacyCheck: PrivacyCheck | null;
  language: Language;
}

// Context types
export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export interface VotingContextType {
  voterData: VoterData | null;
  biometricData: BiometricData | null;
  vote: Vote | null;
  privacyCheck: PrivacyCheck | null;
  setVoterData: (data: VoterData) => void;
  setBiometricData: (data: BiometricData) => void;
  setVote: (vote: Vote) => void;
  setPrivacyCheck: (check: PrivacyCheck) => void;
  resetVotingData: () => void;
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

