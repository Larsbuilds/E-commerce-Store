import { useCart } from '../context/CartContext';
import CartTable from '../components/CartTable';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotal } = useCart();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <CartTable
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
      {items.length > 0 && (
        <div className="mt-8 flex justify-end">
          <div className="text-xl font-bold">
            Total: ${getTotal().toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 