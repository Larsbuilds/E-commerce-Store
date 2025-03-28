import React from 'react';
import { Product } from '../types';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product, onAddToCart, onRemoveFromCart }) => {
  const { t } = useTranslation();
  
  const handleAddToCart = useCallback(() => {
    onAddToCart(product);
  }, [onAddToCart, product]);

  // Debug translations
  console.log('ProductCard translations:');
  console.log('Category key:', `product.categories.${product.category}`);
  console.log('Category translation:', t(`product.categories.${product.category}`));

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <figure className="px-4 pt-4">
        <img
          src={product.image}
          alt={product.title}
          className="rounded-xl h-48 w-full object-contain transition-transform duration-300 hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg line-clamp-2">{product.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-500">{t(`product.categories.${product.category}`)}</span>
          </div>
          <button
            className="btn btn-primary btn-sm transition-all duration-300 hover:scale-105 active:scale-95"
            onClick={handleAddToCart}
          >
            {t('common.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard; 