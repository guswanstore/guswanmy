'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authState, setAuthState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState('loading');
    setErrorMessage('');

    try {
      const result = isLogin
        ? await login(email, password)
        : await register(email, password);

      if (result.success) {
        setAuthState('success');
        setTimeout(() => {
          setEmail('');
          setPassword('');
          onClose();
          setAuthState('idle');
        }, 1500);
      } else {
        setAuthState('error');
        if (isLogin && !result.accountExists) {
          setErrorMessage('Akun tidak ditemukan. Silakan daftar terlebih dahulu');
        } else if (!isLogin) {
          setErrorMessage('Email sudah terdaftar');
        } else {
          setErrorMessage(isLogin ? 'Email atau password salah' : 'Gagal membuat akun');
        }
      }
    } catch (err) {
      setAuthState('error');
      setErrorMessage('Terjadi kesalahan, coba lagi');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-purple-500 border-opacity-30 max-w-md w-full p-8 backdrop-blur-sm">
        {authState === 'loading' ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-purple-500 border-opacity-20 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl">🤖</div>
            </div>
            <p className="text-white font-semibold text-center mb-2">Validasi Akun</p>
            <p className="text-purple-300 text-sm text-center">AI sedang memeriksa akun Anda...</p>
          </div>
        ) : authState === 'success' ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-20 h-20 mb-6">
              <div className="w-full h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-10 h-10 text-white animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-white font-semibold text-center mb-2">Berhasil!</p>
            <p className="text-green-300 text-sm text-center">{isLogin ? 'Login berhasil' : 'Registrasi berhasil'}</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-white mb-2 text-center">
              {isLogin ? 'Login' : 'Register'}
            </h2>
            <p className="text-purple-300 text-center text-sm mb-6">
              {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@gmail.com"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition"
                />
              </div>

              {authState === 'error' && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg px-4 py-2 text-red-300 text-sm flex items-center gap-2">
                  <span>✕</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={authState === 'loading'}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition duration-200"
              >
                {authState === 'loading' ? 'Memproses...' : isLogin ? 'Login' : 'Register'}
              </button>
            </form>

            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMessage('');
                setAuthState('idle');
              }}
              className="w-full text-purple-400 hover:text-purple-300 text-sm font-medium py-2 mt-4 transition"
            >
              {isLogin ? 'Belum punya akun? Daftar sekarang' : 'Sudah punya akun? Login'}
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
