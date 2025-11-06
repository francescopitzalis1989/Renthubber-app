import React, { useState, useEffect } from 'react';
import { FacebookIcon, GoogleIcon } from './Icons';
import type { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onLogin: (email: string) => void;
  onRegister: (name: string, email: string, role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onLogin,
  onRegister,
}) => {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('renter');

  useEffect(() => {
    if (isOpen) {
        setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin(email);
    } else {
      onRegister(name, email, selectedRole);
    }
  };

  const SocialButton: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <button className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-2.5 px-4 hover:bg-gray-50 transition-colors">
      {icon}
      <span className="ml-3 text-sm font-medium">{text}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-2">
            {mode === 'login' ? `Bentornato su Renthubber` : `Crea il tuo account`}
            </h2>
            <p className="text-center text-gray-500 mb-6">
            {mode === 'login' ? "Accedi per continuare." : "È facile e veloce."}
            </p>

            <form onSubmit={handleSubmit}>
            {mode === 'register' && (
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome e Cognome</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5" required />
                </div>
            )}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5" required />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5" required />
            </div>
            {mode === 'register' && (
                 <div className="mb-4">
                    <label htmlFor="account-type" className="block text-sm font-medium text-gray-700 mb-1">Tipo di account</label>
                    <select id="account-type" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as UserRole)} className="w-full border border-gray-300 rounded-lg p-2.5 bg-white" required>
                        <option value="renter">Sono qui per noleggiare (Renter)</option>
                        <option value="hubber">Voglio mettere a noleggio (Hubber)</option>
                    </select>
                </div>
            )}

            {mode === 'login' && (
                <a href="#" className="text-sm text-brand-blue hover:underline mb-4 block text-right">Password dimenticata?</a>
            )}
            <button type="submit" className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-teal-800 transition-colors">
                {mode === 'login' ? 'Accedi' : 'Registrati'}
            </button>
            </form>

            <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">oppure</span>
            </div>
            </div>

            <div className="space-y-3">
                <SocialButton icon={<GoogleIcon />} text="Continua con Google" />
                <SocialButton icon={<FacebookIcon />} text="Continua con Facebook" />
            </div>
        </div>
        
        <div className="bg-gray-50 p-4 text-center text-sm rounded-b-2xl border-t">
            {mode === 'login' ? 'Non hai un account?' : 'Hai già un account?'}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="font-semibold text-brand-blue hover:underline ml-1">
            {mode === 'login' ? 'Registrati' : 'Accedi'}
            </button>
        </div>
      </div>
    </div>
  );
};
