export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: number) => void;
}

export interface CartTableProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
} 