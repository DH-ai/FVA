import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoting } from '../contexts/VotingContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { LanguageToggle, FuturisticCard, LoadingSpinner } from '../components/CommonComponents';
import CameraPermissionModal from '../components/CameraPermissionModal';
import { Camera, Shield, CheckCircle, ArrowLeft, Vote, User, X } from 'lucide-react';
import { Candidate } from '../types';

type VotingStep = 'permission-request' | 'privacy-check' | 'voting' | 'vote-cast';

const VotingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<VotingStep>('permission-request');
  const [isCheckingPrivacy, setIsCheckingPrivacy] = useState(false);
  const [privacyVerified, setPrivacyVerified] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  const { setPrivacyCheck, setVote } = useVoting();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handlePermissionGranted = async () => {
    setCurrentStep('privacy-check');
    startPrivacyCheck();
  };

  const handlePermissionDenied = () => {
    setPermissionDenied(true);
    setCurrentStep('privacy-check'); // Still show the page but with error state
  };

  // Mock candidates data
  const candidates: Candidate[] = [
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      party: 'Progressive Democratic Party',
      symbol: '🌟'
    },
    {
      id: '2',
      name: 'Ms. Priya Sharma',
      party: 'United People\'s Alliance',
      symbol: '🌺'
    },
    {
      id: '3',
      name: 'Mr. Arjun Singh',
      party: 'National Development Front',
      symbol: '🦅'
    },
    {
      id: '4',
      name: 'Dr. Meera Patel',
      party: 'Social Justice Movement',
      symbol: '🌱'
    }
  ];

  useEffect(() => {
    if (currentStep === 'privacy-check') {
      startPrivacyCheck();
    }
  }, [currentStep]);

  const startPrivacyCheck = async () => {
    setIsCheckingPrivacy(true);
    
    // Simulate camera access and privacy verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock privacy verification - always passes
    setPrivacyVerified(true);
    setPrivacyCheck({
      isAlone: true,
      cameraAccess: true,
      verified: true
    });
    
    setIsCheckingPrivacy(false);
    
    // Auto advance to voting after verification
    setTimeout(() => {
      setCurrentStep('voting');
    }, 2000);
  };

  const handleVoteSelection = (candidateId: string) => {
    setSelectedCandidate(candidateId);
  };

  const submitVote = async () => {
    if (!selectedCandidate) return;
    
    setIsSubmitting(true);
    
    // Simulate vote submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock vote ID
    const voteId = `VT${Date.now().toString().slice(-8)}`;
    
    // Save vote data
    setVote({
      candidateId: selectedCandidate,
      timestamp: new Date(),
      voteId,
      isConfirmed: false
    });
    
    setCurrentStep('vote-cast');
    setIsSubmitting(false);
    
    // Auto redirect to confirmation page
    setTimeout(() => {
      navigate('/confirmation');
    }, 2000);
  };

  const goBack = () => {
    navigate('/biometric-scan');
  };

  const renderPrivacyCheck = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Shield className="w-16 h-16 text-green-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">
          {t('voting.privacyCheck')}
        </h2>
        <p className="text-white/60">
          Ensuring voting privacy and security
        </p>
      </div>

      {/* Simulated camera view for privacy check */}
      <div className="relative w-full h-64 bg-black/50 rounded-lg border-2 border-white/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 to-blue-900/30">
          {/* Privacy scanning overlay */}
          {isCheckingPrivacy && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-green-400 rounded-full animate-pulse">
                <div className="absolute inset-2 border-2 border-green-300 rounded-full">
                  <div className="absolute inset-2 bg-green-400/20 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
          )}
          
          {privacyVerified && !isCheckingPrivacy && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
                <p className="text-green-200 font-medium">Privacy Verified</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Camera status */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-white text-sm">Privacy Camera Active</span>
        </div>
      </div>

      <div className="text-center">
        {isCheckingPrivacy ? (
          <div className="flex items-center justify-center space-x-2">
            <LoadingSpinner size="sm" />
            <span className="text-white">Verifying privacy...</span>
          </div>
        ) : privacyVerified ? (
          <p className="text-green-200 font-medium">
            {t('voting.privacyVerified')}
          </p>
        ) : (
          <p className="text-white/60">Initializing privacy check...</p>
        )}
      </div>
    </div>
  );

  const renderVoting = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Vote className="w-16 h-16 text-blue-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">
          {t('voting.title')}
        </h2>
        <p className="text-white/60">
          {t('voting.selectCandidate')}
        </p>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            onClick={() => handleVoteSelection(candidate.id)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedCandidate === candidate.id
                ? 'border-blue-400 bg-blue-500/20'
                : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{candidate.symbol}</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{candidate.name}</h3>
                <p className="text-white/60 text-sm">{candidate.party}</p>
              </div>
              {selectedCandidate === candidate.id && (
                <CheckCircle className="w-6 h-6 text-blue-400" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Vote Button */}
      <div className="text-center">
        <Button
          onClick={submitVote}
          disabled={!selectedCandidate || isSubmitting}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-8 py-3"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span>Casting Vote...</span>
            </div>
          ) : (
            'Cast Vote'
          )}
        </Button>
      </div>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-white/40 text-sm">
          🔒 Your vote is encrypted and securely stored
        </p>
      </div>
    </div>
  );

  const renderVoteCast = () => (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <CheckCircle className="w-20 h-20 text-green-400 mx-auto" />
        <h2 className="text-3xl font-bold text-white">Vote Cast Successfully!</h2>
        <p className="text-white/60">
          Your vote has been recorded securely. Redirecting to confirmation...
        </p>
      </div>
      
      <div className="flex items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Camera Permission Modal */}
      {currentStep === 'permission-request' && (
        <CameraPermissionModal
          purpose="privacy"
          onPermissionGranted={handlePermissionGranted}
          onPermissionDenied={handlePermissionDenied}
        />
      )}

      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <Button
          onClick={goBack}
          variant="ghost"
          className="text-white hover:bg-white/10"
          disabled={currentStep === 'vote-cast' || currentStep === 'permission-request'}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <LanguageToggle />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <FuturisticCard>
            {/* Permission Denied Error */}
            {permissionDenied && (
              <div className="text-center space-y-4 p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
                <X className="w-16 h-16 text-red-400 mx-auto" />
                <h2 className="text-2xl font-bold text-red-200">Camera Access Denied</h2>
                <p className="text-red-300">
                  Camera access is required for privacy verification during voting. Please refresh the page and allow camera access to continue.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Refresh Page
                </Button>
              </div>
            )}

            {/* Normal Voting Flow */}
            {!permissionDenied && (
              <>
                {currentStep === 'privacy-check' && renderPrivacyCheck()}
                {currentStep === 'voting' && renderVoting()}
                {currentStep === 'vote-cast' && renderVoteCast()}
              </>
            )}
          </FuturisticCard>
        </div>
      </div>
    </div>
  );
};

export default VotingPage;

