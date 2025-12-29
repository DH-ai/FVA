import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoting } from '../contexts/VotingContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { LanguageToggle, FuturisticCard, LoadingSpinner } from '../components/CommonComponents';
import CameraPermissionModal from '../components/CameraPermissionModal';
import { Camera, Eye, CheckCircle, ArrowLeft, Scan, X } from 'lucide-react';
import APILogger from '../lib/logger';

type ScanStep = 'permission-request' | 'camera-access' | 'face-scan' | 'retina-scan' | 'completed';

const BiometricScanPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<ScanStep>('permission-request');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [cameraAccess, setCameraAccess] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { setBiometricData } = useVoting();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // Clean up camera stream when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handlePermissionGranted = async () => {
    setCurrentStep('camera-access');
    setPrompt('Initializing camera...');
    
    APILogger.request('POST', '/api/v1/biometric/init-camera', {
      deviceType: 'webcam',
      resolution: '1280x720'
    });

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraAccess(true);
          setPrompt('Camera ready');
          
          APILogger.response('/api/v1/biometric/init-camera', 200, {
            success: true,
            cameraId: 'cam_' + Date.now(),
            resolution: '1280x720',
            frameRate: 30
          }, 800);
          
          setTimeout(() => {
            setCurrentStep('face-scan');
          }, 1000);
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      APILogger.error('Camera access failed', err);
      setPermissionDenied(true);
      setPrompt('Camera access denied');
    }
  };

  const handlePermissionDenied = () => {
    setPermissionDenied(true);
    setCurrentStep('camera-access');
  };

  const startFaceScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setPrompt(t('biometric.facePrompt'));
    
    APILogger.request('POST', '/api/v1/biometric/face-scan', {
      scanType: 'FACE_RECOGNITION',
      algorithm: 'FaceNet-v2'
    });

    // Simulate scanning progress
    for (let i = 0; i <= 100; i += 10) {
      setScanProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));

      if (i === 30) {
        setPrompt('Hold still...');
        APILogger.info('Face detection in progress', { progress: i, status: 'DETECTING_LANDMARKS' });
      }
      if (i === 60) {
        setPrompt('Almost done...');
        APILogger.info('Face encoding in progress', { progress: i, status: 'ENCODING_FEATURES' });
      }
      if (i === 90) {
        setPrompt('Finalizing...');
        APILogger.info('Matching against database', { progress: i, status: 'MATCHING' });
      }
    }

    APILogger.response('/api/v1/biometric/face-scan', 200, {
      success: true,
      matchScore: 0.9847,
      confidence: 'HIGH',
      landmarksDetected: 68,
      faceId: 'face_' + Date.now()
    }, 2000);

    setPrompt('Face scan completed');
    setIsScanning(false);

    setTimeout(() => {
      setCurrentStep('retina-scan');
      setScanProgress(0);
    }, 2000);
  };

  const startRetinaScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setPrompt('Place your left eye close to the scanner');
    
    APILogger.request('POST', '/api/v1/biometric/retina-scan', {
      scanType: 'RETINA_PATTERN',
      eyePosition: 'LEFT'
    });

    // Simulate retina scanning
    for (let i = 0; i <= 100; i += 15) {
      setScanProgress(i);
      await new Promise(resolve => setTimeout(resolve, 600));

      if (i === 45) {
        setPrompt('Move forward slightly...');
        APILogger.info('Retina scan in progress', { progress: i, status: 'CAPTURING_PATTERN' });
      }
      if (i === 75) {
        setPrompt('Perfect position...');
        APILogger.info('Retina pattern analysis', { progress: i, status: 'ANALYZING_VESSELS' });
      }
    }

    APILogger.response('/api/v1/biometric/retina-scan', 200, {
      success: true,
      matchScore: 0.9912,
      confidence: 'VERY_HIGH',
      vesselPointsMatched: 247,
      retinaId: 'retina_' + Date.now()
    }, 4200);

    setPrompt('Retina scan completed');
    setIsScanning(false);

    setBiometricData({
      faceVerified: true,
      retinaVerified: true,
      timestamp: new Date()
    });

    setTimeout(() => {
      setCurrentStep('completed');
    }, 2000);
  };

  const proceedToVoting = () => {
    navigate('/voting');
  };

  const goBack = () => {
    // Stop camera stream before navigating away
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    navigate('/voter-login');
  };

  const renderCameraView = () => {
    return (
      <div className="relative w-full h-96 bg-black/50 rounded-lg border-2 border-white/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30">
          {/* Actual camera video feed */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
          />

          {/* Camera initialization */}
          {currentStep === 'camera-access' && !cameraAccess && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <LoadingSpinner size="lg" />
                <p className="text-white">{prompt}</p>
              </div>
            </div>
          )}

          {/* Face scanning overlay */}
          {currentStep === 'face-scan' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-48 h-48 border-4 border-blue-400 rounded-lg">
                  <div className="absolute inset-2 border-2 border-blue-300 rounded-lg">
                    {isScanning && (
                      <div className="absolute inset-0 bg-blue-400/20 rounded-lg animate-pulse">
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 animate-pulse"
                          style={{ width: `${scanProgress}%` }}></div>
                      </div>
                    )}
                  </div>
                </div>
                {!isScanning && scanProgress === 100 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle className="w-16 h-16 text-green-400" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Retina scanning overlay */}
          {currentStep === 'retina-scan' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-red-400 rounded-full">
                  <div className="absolute inset-2 border-2 border-red-300 rounded-full">
                    {isScanning && (
                      <div className="absolute inset-0 bg-red-400/20 rounded-full animate-ping"></div>
                    )}
                  </div>
                </div>
                {!isScanning && scanProgress === 100 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle className="w-16 h-16 text-green-400" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Camera status */}
        {cameraAccess && (
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-white text-sm">Camera Active</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Camera Permission Modal */}
      {currentStep === 'permission-request' && (
        <CameraPermissionModal
          purpose="biometric"
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
          disabled={currentStep === 'permission-request'}
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
            <div className="space-y-8">
              {/* Permission Denied Error */}
              {permissionDenied && (



                <div className="text-center space-y-4 p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
                
                  <X className="w-16 h-16 text-red-400 mx-auto" />
                  <h2 className="text-2xl font-bold text-red-200">Camera Access Denied</h2>
                  <p className="text-red-300">
                    Camera access is required for biometric verification. Please refresh the page and allow camera access to continue.
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Refresh Page
                  </Button>
                </div>


              )}

              {/* Normal Biometric Flow */}
              {!permissionDenied && (
                <>
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <Scan className="w-16 h-16 text-purple-400 mx-auto" />
                    <h1 className="text-3xl font-bold text-white">
                      {t('biometric.title')}
                    </h1>
                    <p className="text-white/60">
                      Complete biometric verification to proceed
                    </p>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex justify-center space-x-4 mb-8"></div>
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${currentStep === 'camera-access' ? 'bg-blue-500/20 border border-blue-500/30' :
                      ['face-scan', 'retina-scan', 'completed'].includes(currentStep) ? 'bg-green-500/20 border border-green-500/30' :
                        'bg-white/10 border border-white/20'
                    }`}>
                    <Camera className="w-4 h-4 text-white" />
                    <span className="text-white text-sm">Camera</span>
                    {['face-scan', 'retina-scan', 'completed'].includes(currentStep) && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>

                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${currentStep === 'face-scan' ? 'bg-blue-500/20 border border-blue-500/30' :
                      ['retina-scan', 'completed'].includes(currentStep) ? 'bg-green-500/20 border border-green-500/30' :
                        'bg-white/10 border border-white/20'
                    }`}>
                    <Scan className="w-4 h-4 text-white" />
                    <span className="text-white text-sm">Face</span>
                    {['retina-scan', 'completed'].includes(currentStep) && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>

                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${currentStep === 'retina-scan' ? 'bg-blue-500/20 border border-blue-500/30' :
                      currentStep === 'completed' ? 'bg-green-500/20 border border-green-500/30' :
                        'bg-white/10 border border-white/20'
                    }`}>
                    <Eye className="w-4 h-4 text-white" />
                    <span className="text-white text-sm">Retina</span>
                    {currentStep === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                

                  {/* Camera View */}
                  {renderCameraView()}

                  {/* Prompt and Progress */}
                  <div className="text-center space-y-4">
                    <p className="text-white text-lg font-medium">{prompt}</p>

                    {isScanning && (
                      <div className="space-y-2">
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-200"
                            style={{ width: `${scanProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-white/60 text-sm">{scanProgress}% Complete</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4">
                    {currentStep === 'face-scan' && !isScanning && (
                      <Button
                        onClick={startFaceScan}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-8 py-3"
                      >
                        Start Face Scan
                      </Button>
                    )}

                    {currentStep === 'retina-scan' && !isScanning && (
                      <Button
                        onClick={startRetinaScan}
                        className="bg-gradient-to-r from-purple-500 to-red-600 hover:from-purple-600 hover:to-red-700 text-white font-medium px-8 py-3"
                      >
                        Start Retina Scan
                      </Button>
                    )}

                    {currentStep === 'completed' && (
                      <Button
                        onClick={proceedToVoting}
                        className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium px-8 py-3"
                      >
                        Proceed to Voting
                      </Button>
                    )}
                  </div>

                  {/* Security Notice */}
                  <div className="text-center">
                    <p className="text-white/40 text-sm">
                      🔒 Your biometric data is processed locally and not stored permanently
                    </p>
                  </div>
                </>
              )}
            </div>
            </FuturisticCard>
          </div>
        </div>
      
    </div >
  );
};

export default BiometricScanPage;