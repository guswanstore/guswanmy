'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import AddProductModal from './add-product-modal';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomePopup({ isOpen, onClose }: WelcomePopupProps) {
  const { user } = useAuth();
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
      }, 0);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  if (showAddProduct) {
    return <AddProductModal isOpen={true} onClose={() => setShowAddProduct(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-green-500 border-opacity-30 max-w-md w-full p-8 backdrop-blur-sm animate-bounce">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Selamat Datang!</h2>
          <p className="text-gray-300 mb-1">Nama: <span className="text-green-400 font-semibold">{user.email.split('@')[0]}</span></p>
          <p className="text-gray-300 mb-6">Email: <span className="text-green-400 font-semibold">{user.email}</span></p>
          
          {user.isAdmin && (
            <button
              onClick={() => setShowAddProduct(true)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition duration-200 mb-3"
            >
              Tambah Produk Baru
            </button>
          )}
          
          <button
            onClick={onClose}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
