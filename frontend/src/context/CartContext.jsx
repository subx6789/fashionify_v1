import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Fetch the shopping cart for the logged-in user from the backend
  const fetchBackendCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      return;
    }
    try {
      const res = await api.get('/cart');
      if (res.data && res.data.items) {
        setCart(res.data.items);
      }
    } catch (e) {
      console.error('Failed to fetch cart from backend', e);
    }
  }, [user]);

  // Load cart when user session changes
  useEffect(() => {
    if (user) {
      fetchBackendCart();
    } else {
      setCart([]);
    }
  }, [user, fetchBackendCart]);

  // Add product to cart (requires user to be logged in)
  const addToCart = async (product, qty = 1) => {
    if (!user) {
      window.location.href = '/login';
      return false;
    }

    try {
      const res = await api.post('/cart/items', { productId: product.id, quantity: qty });
      if (res.data && res.data.items) {
        setCart(res.data.items);
      }
      return true;
    } catch (e) {
      console.error('Failed to add item to backend cart', e);
      return false;
    }
  };

  // Remove a product from the cart
  const removeFromCart = async (productId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      const res = await api.delete(`/cart/items/${productId}`);
      if (res.data && res.data.items) {
        setCart(res.data.items);
      }
    } catch (e) {
      console.error('Failed to remove item from backend cart', e);
    }
  };

  // Increase quantity of a product in the cart
  const increaseQuantity = async (productId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    // Simple for-loop to find current quantity
    let currentQty = 0;
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      if (item.product && item.product.id === productId) {
        currentQty = item.quantity;
        break;
      }
    }

    const newQty = currentQty + 1;

    try {
      const res = await api.put(`/cart/items/${productId}`, { quantity: newQty });
      if (res.data && res.data.items) {
        setCart(res.data.items);
      }
    } catch (e) {
      console.error('Failed to increase quantity in backend cart', e);
    }
  };

  // Decrease quantity of a product in the cart
  const decreaseQuantity = async (productId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    // Simple for-loop to find current quantity
    let currentQty = 1;
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      if (item.product && item.product.id === productId) {
        currentQty = item.quantity;
        break;
      }
    }

    const newQty = currentQty - 1;

    if (newQty <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      const res = await api.put(`/cart/items/${productId}`, { quantity: newQty });
      if (res.data && res.data.items) {
        setCart(res.data.items);
      }
    } catch (e) {
      console.error('Failed to decrease quantity in backend cart', e);
    }
  };

  // Clear all items from the cart
  const clearCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      const res = await api.delete('/cart');
      if (res.data && res.data.items) {
        setCart(res.data.items);
      } else {
        setCart([]);
      }
    } catch (e) {
      console.error('Failed to clear backend cart', e);
    }
  };

  // Calculate cart total price using a simple beginner-friendly for-loop
  let cartTotal = 0;
  let cartItemCount = 0;

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    const price = item.product && item.product.price ? item.product.price : 0;
    const quantity = item.quantity ? item.quantity : 1;

    cartTotal = cartTotal + (price * quantity);
    cartItemCount = cartItemCount + quantity;
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        fetchBackendCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
