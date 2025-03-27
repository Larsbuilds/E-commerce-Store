import { CartItem } from '../types';

interface CartTableProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

const CartTable: React.FC<CartTableProps> = ({ items, onUpdateQuantity, onRemoveItem }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <p className="text-lg">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="animate-fade-in">
              <td>
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-16 h-16 object-contain"
                  />
                  <div>
                    <h3 className="font-medium">{item.product.title}</h3>
                    <p className="text-sm text-gray-600">{item.product.category}</p>
                  </div>
                </div>
              </td>
              <td>${item.product.price.toFixed(2)}</td>
              <td>
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-sm btn-circle btn-ghost transition-all duration-200 hover:bg-base-200"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    className="btn btn-sm btn-circle btn-ghost transition-all duration-200 hover:bg-base-200"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </td>
              <td>${(item.product.price * item.quantity).toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-sm btn-error transition-all duration-200 hover:scale-105 active:scale-95"
                  onClick={() => onRemoveItem(item.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable; 