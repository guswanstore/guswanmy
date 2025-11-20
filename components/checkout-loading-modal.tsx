'use client';

import { useEffect, useState } from 'react';

interface CheckoutLoadingModalProps {
  isOpen: boolean;
  onComplete: (paymentNumber: string) => void;
}

export default function CheckoutLoadingModal({
  isOpen,
  onComplete,
}: CheckoutLoadingModalProps) {
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<string[]>([
    'Menganalisis pesanan...',
    'Menghubungi server pembayaran...',
    'Mengenkripsi data transaksi...',
    'AI sedang membuat bukti pembayaran...',
    'Menggenerasi nomor referensi...',
  ]);
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    setProgress(0);
    setCurrentMessage(0);

    // Simulate progress and message cycling
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setCurrentMessage(messageIndex);
    }, 1200);

    // Simulate progress bar
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress = Math.min(currentProgress + Math.random() * 20, 95);
      setProgress(currentProgress);
    }, 500);

    // Complete after 4 seconds
    const completeTimeout = setTimeout(() => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      setProgress(100);
      
      // Generate payment number
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      const paymentNumber = `PAY-${timestamp}-${random}`;

      setTimeout(() => {
        onComplete(paymentNumber);
      }, 800);
    }, 4000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearTimeout(completeTimeout);
    };
  }, [isOpen, messages]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50" />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-2xl p-12 max-w-md w-full border border-purple-500/30 text-center space-y-8">
          {/* Animated AI Icon */}
          <div className="flex justify-center">
            <div className="relative w-24 h-24">
              {/* Outer rotating ring */}
              <div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 border-r-pink-500"
                style={{
                  animation: 'spin 2s linear infinite',
                }}
              />
              {/* Middle rotating ring */}
              <div
                className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-500 border-l-pink-500"
                style={{
                  animation: 'spin 3s linear reverse infinite',
                }}
              />
              {/* Center AI symbol */}
              <div className="absolute inset-0 flex items-center justify-center text-4xl">
                🤖
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <p className="text-white font-black text-xl">
              {messages[currentMessage]}
            </p>
            <p className="text-slate-400 text-sm">
              Tunggu sebentar, kami sedang memproses pembayaran Anda...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-purple-500/30">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-purple-300 text-xs font-mono">
              {Math.round(progress)}%
            </p>
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{
                  animation: `pulse 1.4s infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
