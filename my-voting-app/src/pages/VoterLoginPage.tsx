import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoting } from '../contexts/VotingContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageToggle, FuturisticCard, LoadingSpinner } from '../components/CommonComponents';
import { CreditCard, IdCard, Phone, Shield, CheckCircle, ArrowLeft } from 'lucide-react';

const VoterLoginPage: React.FC = () => {
  const [step, setStep] = useState<'verification' | 'otp'>('verification');
  const [aadharNumber, setAadharNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [voterIdNumber, setVoterIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified'>('idle');
  
  const { setVoterData } = useVoting();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setVerificationStatus('verifying');

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock verification logic - accept any input
    if (aadharNumber || panNumber || voterIdNumber) {
      setVerificationStatus('verified');
      setVoterData({
        aadharNumber,
        panNumber,
        voterIdNumber,
        isVerified: true
      });
      
      // Auto advance to OTP step after verification
      setTimeout(() => {
        setStep('otp');
        setIsLoading(false);
      }, 1000);
    } else {
      setError('Please enter at least one identification number');
      setVerificationStatus('idle');
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate OTP verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (otp === '123456') {
      // Update voter data with phone number
      setVoterData({
        aadharNumber,
        panNumber,
        voterIdNumber,
        phoneNumber,
        isVerified: true
      });
      navigate('/biometric-scan');
    } else {
      setError('Invalid OTP. Please enter 123456');
    }
    
    setIsLoading(false);
  };

  const sendOtp = async () => {
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    alert('OTP sent to your phone number. Use 123456 to verify.');
  };

  const goBack = () => {
    if (step === 'otp') {
      setStep('verification');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <Button
          onClick={goBack}
          variant="ghost"
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <LanguageToggle />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          
          {step === 'verification' ? (
            <FuturisticCard>
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Shield className="w-16 h-16 text-blue-400 mx-auto" />
                  <h1 className="text-3xl font-bold text-white">
                    {t('voter.title')}
                  </h1>
                  <p className="text-white/60">
                    Enter your identification details for verification
                  </p>
                </div>

                {verificationStatus === 'verified' && (
                  <div className="flex items-center justify-center space-x-2 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-200">Verification Successful!</span>
                  </div>
                )}

                <form onSubmit={handleVerification} className="space-y-6">
                  {/* Aadhar Number */}
                  <div className="space-y-2">
                    <Label htmlFor="aadhar" className="text-white flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      {t('voter.aadhar')}
                    </Label>
                    <Input
                      id="aadhar"
                      type="text"
                      value={aadharNumber}
                      onChange={(e) => setAadharNumber(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="XXXX XXXX XXXX"
                      maxLength={12}
                    />
                  </div>

                  {/* PAN Number */}
                  <div className="space-y-2">
                    <Label htmlFor="pan" className="text-white flex items-center">
                      <IdCard className="w-4 h-4 mr-2" />
                      {t('voter.pan')}
                    </Label>
                    <Input
                      id="pan"
                      type="text"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="ABCDE1234F"
                      maxLength={10}
                    />
                  </div>

                  {/* Voter ID Number */}
                  <div className="space-y-2">
                    <Label htmlFor="voterId" className="text-white flex items-center">
                      <IdCard className="w-4 h-4 mr-2" />
                      {t('voter.voterId')}
                    </Label>
                    <Input
                      id="voterId"
                      type="text"
                      value={voterIdNumber}
                      onChange={(e) => setVoterIdNumber(e.target.value.toUpperCase())}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="ABC1234567"
                      maxLength={10}
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-200 text-sm">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading || verificationStatus === 'verified'}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>
                          {verificationStatus === 'verifying' ? 'Verifying...' : 'Processing...'}
                        </span>
                      </div>
                    ) : verificationStatus === 'verified' ? (
                      'Verified ✓'
                    ) : (
                      t('voter.verify')
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-white/60 text-sm">
                    Enter at least one identification number to proceed
                  </p>
                </div>
              </div>
            </FuturisticCard>
          ) : (
            <FuturisticCard>
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Phone className="w-16 h-16 text-green-400 mx-auto" />
                  <h1 className="text-3xl font-bold text-white">
                    OTP Verification
                  </h1>
                  <p className="text-white/60">
                    Enter your phone number and verify with OTP
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {t('voter.phone')}
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 flex-1"
                        placeholder="+91 XXXXX XXXXX"
                        maxLength={15}
                      />
                      <Button
                        type="button"
                        onClick={sendOtp}
                        disabled={isLoading || !phoneNumber}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        {isLoading ? <LoadingSpinner size="sm" /> : t('voter.sendOtp')}
                      </Button>
                    </div>
                  </div>

                  {/* OTP Input */}
                  <form onSubmit={handleOtpVerification} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-white">
                        {t('voter.otp')}
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-center text-2xl tracking-widest"
                        placeholder="123456"
                        maxLength={6}
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <p className="text-red-200 text-sm">{error}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading || otp.length !== 6}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium py-3"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="sm" />
                          <span>Verifying OTP...</span>
                        </div>
                      ) : (
                        t('voter.verify')
                      )}
                    </Button>
                  </form>

                  <div className="text-center">
                    <p className="text-white/60 text-sm">
                      Demo OTP: 123456
                    </p>
                  </div>
                </div>
              </div>
            </FuturisticCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoterLoginPage;

