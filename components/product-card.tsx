'use client';

import { useState } from 'react';
import { ChevronDown, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  pricing: {
    duration: string;
    price: number;
  }[];
  icon: string;
  color: string;
  colorDark: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(product.pricing[0].duration);
  const { addItem } = useCart();

  const selectedPrice = product.pricing.find((p) => p.duration === selectedDuration)?.price || 0;

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedDuration}`,
      name: `${product.name} - ${selectedDuration}`,
      price: selectedPrice,
      quantity: 1,
    });
    setIsExpanded(false);
  };

  return (
    <div className={`bg-gradient-to-br ${product.color} rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}>
      <div className={`bg-gradient-to-r ${product.colorDark} p-6 relative h-48 flex items-center justify-center`}>
        <Image
          src={product.icon || "/placeholder.svg"}
          alt={product.name}
          width={150}
          height={150}
          className="object-contain drop-shadow-lg"
        />
      </div>

      <div className="p-6 bg-black/40">
        <h3 className="text-2xl font-black text-white mb-2">{product.name}</h3>
        <p className="text-white/80 text-sm mb-4">{product.description}</p>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mb-4 flex items-center justify-between bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
        >
          <span>
            {isExpanded ? 'Sembunyikan Paket' : 'Lihat Paket (' + product.pricing[0].price + ')'}
          </span>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {isExpanded && (
          <div className="space-y-3 mb-4 animate-in fade-in duration-300">
            {product.pricing.map((tier) => (
              <button
                key={tier.duration}
                onClick={() => setSelectedDuration(tier.duration)}
                className={`w-full text-left py-3 px-4 rounded-lg font-bold transition-all duration-300 ${
                  selectedDuration === tier.duration
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{tier.duration}</span>
                  <span className="text-lg font-black">Rp {tier.price.toLocaleString('id-ID')}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!isExpanded}
          className={`w-full py-3 px-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 ${
            isExpanded
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          Masukkan Keranjang
        </button>
      </div>
    </div>
  );
}
