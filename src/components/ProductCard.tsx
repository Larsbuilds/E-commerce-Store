import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onAddToCart, onRemoveFromCart }) => {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <figure className="px-4 pt-4">
        <img
          src={product.image}
          alt={product.title}
          className="rounded-xl h-48 w-full object-contain transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg line-clamp-2">{product.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          <button
            className="btn btn-primary btn-sm transition-all duration-300 hover:scale-105 active:scale-95"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard; 