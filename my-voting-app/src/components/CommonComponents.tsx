import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface LanguageToggleProps {
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language.code === 'en' 
      ? { code: 'hi' as const, name: 'हिंदी' }
      : { code: 'en' as const, name: 'English' };
    setLanguage(newLanguage);
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <Button
        onClick={toggleLanguage}
        variant="outline"
        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
      >
        {t('language.toggle')}
      </Button>
      <p className="text-xs text-white/60">{t('language.moreComingSoon')}</p>
    </div>
  );
};

interface ComingSoonBadgeProps {
  text: string;
  className?: string;
}

export const ComingSoonBadge: React.FC<ComingSoonBadgeProps> = ({ text, className = '' }) => {
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-medium ${className}`}>
      <span className="mr-2">🚀</span>
      {text}
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-white/20 border-t-white ${sizeClasses[size]} ${className}`} />
  );
};

interface FuturisticCardProps {
  children: React.ReactNode;
  className?: string;
}

export const FuturisticCard: React.FC<FuturisticCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl ${className}`}>
      {children}
    </div>
  );
};

