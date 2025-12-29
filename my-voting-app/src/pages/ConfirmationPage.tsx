import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoting } from '../contexts/VotingContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { LanguageToggle, FuturisticCard, LoadingSpinner } from '../components/CommonComponents';
import { CheckCircle, ArrowLeft, Vote, AlertTriangle } from 'lucide-react';
import APILogger from '../lib/logger';

const ConfirmationPage: React.FC = () => {
  const [isConfirming, setIsConfirming] = useState(false);
  const { vote, setVote } = useVoting();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Mock candidates data (should match VotingPage)
  const candidates = [
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      party: 'Bharatiya Log Democratic Party',
      symbol: '🪷'
    },
    {
      id: '2',
      name: 'Mr. Donald Thompson',
      party: 'Repulican Unity Front',
      symbol: '🐘'
    },
    {
      id: '3',
      name: 'Mr. Narendra Singh',
      party: 'National Communist Front',
      symbol: '🔴'
    },
    {
      id: '4',
      name: 'Dr. Meera Patel',
      party: 'Social Congress Alliance',
      symbol:'🖐️'
    }
  ];

  // If no vote data, redirect to voting page
  if (!vote) {
    navigate('/voting');
    return null;
  }

  const selectedCandidate = candidates.find(c => c.id === vote.candidateId);

  const confirmVote = async () => {
    setIsConfirming(true);
    
    APILogger.request('POST', '/api/v1/voting/confirm-vote', {
      voteId: vote.voteId,
      candidateId: vote.candidateId,
      timestamp: vote.timestamp.toISOString(),
      confirmationMethod: 'USER_ACTION'
    });
    
    // Simulate confirmation processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const blockchainHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    APILogger.response('/api/v1/voting/confirm-vote', 200, {
      success: true,
      voteId: vote.voteId,
      status: 'CONFIRMED',
      blockchainHash,
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      gasUsed: 21000,
      confirmations: 1
    }, 2000);
    
    APILogger.success('Vote permanently recorded on blockchain', {
      voteId: vote.voteId,
      blockchainHash
    });
    
    // Update vote as confirmed
    setVote({
      ...vote,
      isConfirmed: true
    });
    
    setIsConfirming(false);
    navigate('/receipt');
  };

  const goBack = () => {
    navigate('/voting');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <Button
          onClick={goBack}
          variant="ghost"
          className="text-white hover:bg-white/10"
          disabled={isConfirming}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('confirmation.back')}
        </Button>
        <LanguageToggle />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <FuturisticCard>
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-2">
                <Vote className="w-16 h-16 text-orange-400 mx-auto" />
                <h1 className="text-3xl font-bold text-white">
                  {t('confirmation.title')}
                </h1>
                <p className="text-white/60">
                  Please review your selection before final submission
                </p>
              </div>

              {/* Selected Candidate Display */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white text-center">
                  {t('confirmation.selected')}
                </h2>
                
                {selectedCandidate && (
                  <div className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-400/50 rounded-lg">
                    <div className="flex items-center space-x-6">
                      <div className="text-6xl">{selectedCandidate.symbol}</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white">{selectedCandidate.name}</h3>
                        <p className="text-white/80 text-lg">{selectedCandidate.party}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Vote Details */}
              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Vote ID:</span>
                  <span className="text-white font-mono">{vote.voteId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Timestamp:</span>
                  <span className="text-white">{vote.timestamp.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Status:</span>
                  <span className="text-yellow-400">Pending Confirmation</span>
                </div>
              </div>

              {/* Warning Notice */}
              <div className="flex items-start space-x-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-200">
                  <p className="font-medium mb-1">Important Notice:</p>
                  <p>Once confirmed, your vote cannot be changed. Please ensure your selection is correct before proceeding.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={goBack}
                  variant="outline"
                  disabled={isConfirming}
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  {t('confirmation.back')}
                </Button>
                
                <Button
                  onClick={confirmVote}
                  disabled={isConfirming}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium"
                >
                  {isConfirming ? (
                    <div className="flex items-center space-x-2">
                      <LoadingSpinner size="sm" />
                      <span>Confirming...</span>
                    </div>
                  ) : (
                    t('confirmation.confirm')
                  )}
                </Button>
              </div>

              {/* Security Notice */}
              <div className="text-center">
                <p className="text-white/40 text-sm">
                  🔒 Your vote is encrypted and will be securely recorded on confirmation
                </p>
              </div>
            </div>
          </FuturisticCard>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;

