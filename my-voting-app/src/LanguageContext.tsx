import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, LanguageContextType } from '../types';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation strings
const translations: Record<string, Record<string, string>> = {
  en: {
    // Landing Page
    'landing.title': 'Futuristic Voting System',
    'landing.subtitle': 'Secure, Transparent, Democratic',
    'landing.login': 'Login',
    'landing.username': 'Username',
    'landing.password': 'Password',
    'landing.comingSoon': 'Coming Soon',
    'landing.aadharSupport': 'Aadhar Support',
    'landing.panSupport': 'PAN Support',
    'landing.voterIdSupport': 'Voter ID Support',
    
    // Voter Login
    'voter.title': 'Voter Verification',
    'voter.aadhar': 'Aadhar Number',
    'voter.pan': 'PAN Number',
    'voter.voterId': 'Voter ID Number',
    'voter.phone': 'Phone Number',
    'voter.otp': 'Enter OTP',
    'voter.verify': 'Verify',
    'voter.sendOtp': 'Send OTP',
    
    // Biometric
    'biometric.title': 'Biometric Verification',
    'biometric.facePrompt': 'Place your face in the frame',
    'biometric.eyePrompt': 'Place left eye in the scanner',
    'biometric.moveForward': 'Move forward',
    'biometric.verified': 'Verified',
    
    // Voting
    'voting.title': 'Cast Your Vote',
    'voting.privacyCheck': 'Privacy Verification',
    'voting.privacyVerified': 'Privacy Verified - You are alone',
    'voting.selectCandidate': 'Select Your Candidate',
    
    // Confirmation
    'confirmation.title': 'Confirm Your Vote',
    'confirmation.selected': 'You have selected:',
    'confirmation.confirm': 'Confirm Vote',
    'confirmation.back': 'Go Back',
    
    // Receipt
    'receipt.title': 'Vote Receipt',
    'receipt.voteId': 'Vote ID:',
    'receipt.timestamp': 'Timestamp:',
    'receipt.blockchain': 'Blockchain integration coming soon',
    
    // Common
    'common.next': 'Next',
    'common.back': 'Back',
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'language.toggle': 'हिंदी',
    'language.moreComingSoon': 'More languages coming soon'
  },
  hi: {
    // Landing Page
    'landing.title': 'भविष्य की मतदान प्रणाली',
    'landing.subtitle': 'सुरक्षित, पारदर्शी, लोकतांत्रिक',
    'landing.login': 'लॉगिन',
    'landing.username': 'उपयोगकर्ता नाम',
    'landing.password': 'पासवर्ड',
    'landing.comingSoon': 'जल्द आ रहा है',
    'landing.aadharSupport': 'आधार समर्थन',
    'landing.panSupport': 'पैन समर्थन',
    'landing.voterIdSupport': 'मतदाता पहचान समर्थन',
    
    // Voter Login
    'voter.title': 'मतदाता सत्यापन',
    'voter.aadhar': 'आधार संख्या',
    'voter.pan': 'पैन संख्या',
    'voter.voterId': 'मतदाता पहचान संख्या',
    'voter.phone': 'फोन नंबर',
    'voter.otp': 'ओटीपी दर्ज करें',
    'voter.verify': 'सत्यापित करें',
    'voter.sendOtp': 'ओटीपी भेजें',
    
    // Biometric
    'biometric.title': 'बायोमेट्रिक सत्यापन',
    'biometric.facePrompt': 'अपना चेहरा फ्रेम में रखें',
    'biometric.eyePrompt': 'बाईं आंख को स्कैनर में रखें',
    'biometric.moveForward': 'आगे बढ़ें',
    'biometric.verified': 'सत्यापित',
    
    // Voting
    'voting.title': 'अपना वोट डालें',
    'voting.privacyCheck': 'गोपनीयता सत्यापन',
    'voting.privacyVerified': 'गोपनीयता सत्यापित - आप अकेले हैं',
    'voting.selectCandidate': 'अपना उम्मीदवार चुनें',
    
    // Confirmation
    'confirmation.title': 'अपने वोट की पुष्टि करें',
    'confirmation.selected': 'आपने चुना है:',
    'confirmation.confirm': 'वोट की पुष्टि करें',
    'confirmation.back': 'वापस जाएं',
    
    // Receipt
    'receipt.title': 'वोट रसीद',
    'receipt.voteId': 'वोट आईडी:',
    'receipt.timestamp': 'समय:',
    'receipt.blockchain': 'ब्लॉकचेन एकीकरण जल्द आ रहा है',
    
    // Common
    'common.next': 'अगला',
    'common.back': 'वापस',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि हुई',
    'language.toggle': 'English',
    'language.moreComingSoon': 'अधिक भाषाएं जल्द आ रही हैं'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('voting_language');
    return saved ? JSON.parse(saved) : { code: 'en', name: 'English' };
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('voting_language', JSON.stringify(newLanguage));
  };

  const t = (key: string): string => {
    return translations[language.code][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

