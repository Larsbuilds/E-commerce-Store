import { ProductCardProps } from '../types';

const ProductCard = ({ product, onAddToCart, onRemoveFromCart }: ProductCardProps) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="px-4 pt-4">
        <img
          src={product.image}
          alt={product.title}
          className="rounded-xl h-48 w-full object-contain"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg line-clamp-2">{product.title}</h2>
        <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 