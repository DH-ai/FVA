import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FuturisticCard } from './CommonComponents';
import { Camera, Shield, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface CameraPermissionProps {
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
  purpose: 'biometric' | 'privacy';
  title?: string;
  description?: string;
}

export const CameraPermissionModal: React.FC<CameraPermissionProps> = ({
  onPermissionGranted,
  onPermissionDenied,
  purpose,
  title,
  description
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAllow = async () => {
    setIsProcessing(true);
    
    // Simulate permission processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    onPermissionGranted();
  };

  const handleDeny = () => {
    onPermissionDenied();
  };

  const getPermissionContent = () => {
    switch (purpose) {
      case 'biometric':
        return {
          title: title || 'Camera Access Required',
          description: description || 'This application needs access to your camera to perform biometric verification (face and retina scanning) for secure voter authentication.',
          icon: <Camera className="w-16 h-16 text-blue-400" />,
          features: [
            'Face recognition for identity verification',
            'Retina scanning for enhanced security',
            'Secure biometric data processing',
            'No data is stored permanently'
          ]
        };
      case 'privacy':
        return {
          title: title || 'Privacy Verification Required',
          description: description || 'Camera access is needed to verify that you are voting alone and in a private environment to ensure ballot secrecy.',
          icon: <Shield className="w-16 h-16 text-green-400" />,
          features: [
            'Verify you are voting alone',
            'Ensure ballot secrecy',
            'Detect unauthorized observers',
            'Privacy data processed locally only'
          ]
        };
      default:
        return {
          title: 'Camera Access Required',
          description: 'This application needs camera access for security verification.',
          icon: <Camera className="w-16 h-16 text-blue-400" />,
          features: ['Security verification']
        };
    }
  };

  const content = getPermissionContent();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md">
        <FuturisticCard>
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              {content.icon}
              <h2 className="text-2xl font-bold text-white">
                {content.title}
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                {content.description}
              </p>
            </div>

            {/* Browser-like permission dialog */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Camera className="w-2 h-2 text-white" />
                </div>
                <span className="text-white text-sm font-medium">
                  futuristic-voting-system.Kushagra.space wants to:
                </span>
              </div>
              <div className="ml-6 text-white/80 text-sm">
                Use your camera
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-2">
              <h3 className="text-white font-medium text-sm">This will be used for:</h3>
              <ul className="space-y-1">
                {content.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-white/70 text-sm">
                    <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security notice */}
            <div className="flex items-start space-x-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-yellow-200 text-xs">
                <p className="font-medium mb-1">Privacy Notice:</p>
                <p>All camera data is processed locally in your browser. No video or images are transmitted to external servers.</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={handleDeny}
                variant="outline"
                disabled={isProcessing}
                className="flex-1 bg-red-500/20 border-red-500/50 text-red-200 hover:bg-red-500/30"
              >
                <X className="w-4 h-4 mr-2" />
                Block
              </Button>
              
              <Button
                onClick={handleAllow}
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 text-white font-medium"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Granting...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Allow
                  </>
                )}
              </Button>
            </div>

            {/* Footer note */}
            <div className="text-center">
              <p className="text-white/40 text-xs">
                You can change this permission later in your browser settings
              </p>
            </div>
          </div>
        </FuturisticCard>
      </div>
    </div>
  );
};

export default CameraPermissionModal;

