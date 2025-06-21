import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { VotingProvider } from './contexts/VotingContext'
import { LanguageProvider } from './contexts/LanguageContext'
import LandingPage from './pages/LandingPage'
import VoterLoginPage from './pages/VoterLoginPage'
import BiometricScanPage from './pages/BiometricScanPage'
import VotingPage from './pages/VotingPage'
import ConfirmationPage from './pages/ConfirmationPage'
import ReceiptPage from './pages/ReceiptPage'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <VotingProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/voter-login" element={<VoterLoginPage />} />
              <Route path="/biometric-scan" element={<BiometricScanPage />} />
              <Route path="/voting" element={<VotingPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/receipt" element={<ReceiptPage />} />
            </Routes>
          </div>
        </VotingProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App

