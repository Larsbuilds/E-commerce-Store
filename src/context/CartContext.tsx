import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';

interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'cart_items';
const SYNC_EVENT = 'cart_sync';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedItems = localStorage.getItem(STORAGE_KEY);
    return savedItems ? JSON.parse(savedItems) : [];
  });

  // Listen for cart sync events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setItems(JSON.parse(e.newValue));
      }
    };

    const handleSyncEvent = (e: CustomEvent) => {
      if (e.detail?.items) {
        setItems(e.detail.items);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(SYNC_EVENT, handleSyncEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(SYNC_EVENT, handleSyncEvent as EventListener);
    };
  }, []);

  // Save to localStorage and broadcast changes
  const syncCart = (newItems: CartItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    // Broadcast to other tabs
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { items: newItems } }));
  };

  const addToCart = (product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      const newItems = existingItem
        ? prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prevItems, { id: product.id, quantity: 1, product }];
      
      syncCart(newItems);
      return newItems;
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== productId);
      syncCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      syncCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    syncCart([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 