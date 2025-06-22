import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoting } from '../contexts/VotingContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { LanguageToggle, FuturisticCard } from '../components/CommonComponents';
import { CheckCircle, Download, Home, Hash, Clock, User, Shield } from 'lucide-react';

const ReceiptPage: React.FC = () => {
  const [blockchainHash, setBlockchainHash] = useState('');
  const { vote, resetVotingData } = useVoting();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // If no confirmed vote, redirect to home
  if (!vote || !vote.isConfirmed) {
    navigate('/');
    return null;
  }

  // Mock candidates data (should match other pages)
  const candidates = [
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

  const selectedCandidate = candidates.find(c => c.id === vote.candidateId);

  useEffect(() => {
    // Generate mock blockchain hash
    const generateHash = () => {
      const chars = '0123456789abcdef';
      let hash = '0x';
      for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
      }
      return hash;
    };
    
    setBlockchainHash(generateHash());
  }, []);

  const downloadReceipt = () => {
    // Mock download functionality
    const receiptData = {
      voteId: vote.voteId,
      candidate: selectedCandidate?.name,
      party: selectedCandidate?.party,
      timestamp: vote.timestamp.toISOString(),
      blockchainHash,
      status: 'Confirmed'
    };
    
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vote-receipt-${vote.voteId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const returnHome = () => {
    resetVotingData();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-end items-center p-4">
        <LanguageToggle />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <FuturisticCard>
            <div className="space-y-8">
              {/* Success Header */}
              <div className="text-center space-y-4">
                <div className="relative">
                  <CheckCircle className="w-20 h-20 text-green-400 mx-auto" />
                  <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-green-400 rounded-full animate-ping opacity-20"></div>
                </div>
                <h1 className="text-3xl font-bold text-white">
                  {t('receipt.title')}
                </h1>
                <p className="text-green-200 text-lg">
                  Your vote has been successfully recorded!
                </p>
              </div>

              {/* Vote Summary */}
              {selectedCandidate && (
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-2 border-green-400/50 rounded-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{selectedCandidate.symbol}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{selectedCandidate.name}</h3>
                      <p className="text-white/80">{selectedCandidate.party}</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              )}

              {/* Receipt Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                  Vote Details
                </h2>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Hash className="w-5 h-5 text-blue-400" />
                    <div className="flex-1">
                      <p className="text-white/60 text-sm">{t('receipt.voteId')}</p>
                      <p className="text-white font-mono text-lg">{vote.voteId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <div className="flex-1">
                      <p className="text-white/60 text-sm">{t('receipt.timestamp')}</p>
                      <p className="text-white">{vote.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Shield className="w-5 h-5 text-green-400" />
                    <div className="flex-1">
                      <p className="text-white/60 text-sm">Status</p>
                      <p className="text-green-400 font-medium">Confirmed & Recorded</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blockchain Hash */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Blockchain Hash</h3>
                <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                  <p className="text-white/60 text-sm mb-2">Transaction Hash:</p>
                  <p className="text-green-400 font-mono text-sm break-all">{blockchainHash}</p>
                </div>
              </div>

              {/* Blockchain Disclaimer */}
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <strong>Note:</strong> {t('receipt.blockchain')}. This hash is currently simulated for demonstration purposes.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={downloadReceipt}
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
                
                <Button
                  onClick={returnHome}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Return Home
                </Button>
              </div>

              {/* Security Footer */}
              <div className="text-center space-y-2">
                <p className="text-white/40 text-sm">
                  🔒 Your vote has been encrypted and securely stored
                </p>
                <p className="text-white/40 text-xs">
                  Vote ID: {vote.voteId} | Timestamp: {vote.timestamp.toISOString()}
                </p>
              </div>
            </div>
          </FuturisticCard>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;

