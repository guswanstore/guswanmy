'use client';

import { useState } from 'react';
import ProductCard from './product-card';
import { PRODUCTS } from '@/data/products';

interface ProductGridProps {
  category: string;
}

export default function ProductGrid({ category }: ProductGridProps) {
  const products = PRODUCTS[category as keyof typeof PRODUCTS] || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
