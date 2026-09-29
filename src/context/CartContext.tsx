import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedColor?: string, quantity?: number) => void;
  removeFromCart: (productId: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedColor: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'hydrova_cart_items_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  // Refresh cart prices if any item in cart was saved with an older price
  useEffect(() => {
    setCart((prevCart) => {
      let changed = false;
      const updated = prevCart.map((item) => {
        // If product has been updated to 3500 or any new price
        if (item.product?.price && item.unitPrice !== item.product.price) {
          changed = true;
          return {
            ...item,
            unitPrice: item.product.price,
          };
        }
        return item;
      });
      return changed ? updated : prevCart;
    });
  }, []);

  const addToCart = (product: Product, selectedColor?: string, quantity = 1) => {
    const color = selectedColor || product.colors[0] || 'Default';
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product.id && item.selectedColor === color
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, product.stock);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          unitPrice: product.price,
        };
        return updated;
      } else {
        const initialQty = Math.min(quantity, Math.max(1, product.stock));
        return [
          ...prevCart,
          {
            productId: product.id,
            product,
            selectedColor: color,
            quantity: initialQty,
            unitPrice: product.price,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, selectedColor: string) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.selectedColor === selectedColor)));
  };

  const updateQuantity = (productId: string, selectedColor: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.selectedColor === selectedColor) {
          const clamped = Math.min(quantity, item.product.stock || 99);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
