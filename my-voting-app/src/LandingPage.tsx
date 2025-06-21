import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageToggle, ComingSoonBadge, FuturisticCard } from '../components/CommonComponents';
import { Eye, EyeOff, Vote, Shield, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = login(username, password);
    
    if (success) {
      navigate('/voter-login');
    } else {
      setError('Invalid credentials. Try: admin/admin123, voter1/vote123, or demo/demo123');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Language Toggle */}
      <header className="absolute top-4 right-4 z-10">
        <LanguageToggle />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Hero Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                {t('landing.title')}
              </h1>
              <p className="text-xl lg:text-2xl text-white/80">
                {t('landing.subtitle')}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center space-y-2 p-4 bg-white/5 rounded-lg">
                <Shield className="w-8 h-8 text-blue-400" />
                <span className="text-white text-sm font-medium">Secure</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-white/5 rounded-lg">
                <Eye className="w-8 h-8 text-green-400" />
                <span className="text-white text-sm font-medium">Transparent</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-white/5 rounded-lg">
                <Zap className="w-8 h-8 text-yellow-400" />
                <span className="text-white text-sm font-medium">Fast</span>
              </div>
            </div>

            {/* Coming Soon Features */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white/90">
                {t('landing.comingSoon')}:
              </h3>
              <div className="flex flex-wrap gap-3">
                <ComingSoonBadge text={t('landing.aadharSupport')} />
                <ComingSoonBadge text={t('landing.panSupport')} />
                <ComingSoonBadge text={t('landing.voterIdSupport')} />
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center">
            <FuturisticCard className="w-full max-w-md">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Vote className="w-12 h-12 text-blue-400 mx-auto" />
                  <h2 className="text-2xl font-bold text-white">
                    {t('landing.login')}
                  </h2>
                  <p className="text-white/60 text-sm">
                    Enter your credentials to access the voting system
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">
                      {t('landing.username')}
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="Enter username"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      {t('landing.password')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                        placeholder="Enter password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-200 text-sm">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      t('landing.login')
                    )}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-xs text-center">
                    Demo credentials: admin/admin123, voter1/vote123, demo/demo123
                  </p>
                </div>
              </div>
            </FuturisticCard>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6">
        <p className="text-white/40 text-sm">
          © 2025 Futuristic Voting System - Demo Application
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;

