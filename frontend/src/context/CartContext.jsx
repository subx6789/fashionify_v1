import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartError, setCartError] = useState('');

  const clearCartError = () => setCartError('');

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
    setCartError('');
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
      const errMsg = e?.response?.data?.message || 'Failed to add item to cart.';
      console.error('Failed to add item to backend cart:', errMsg);
      setCartError(errMsg);
      return false;
    }
  };

  // Remove a product from the cart
  const removeFromCart = async (productId) => {
    setCartError('');
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
      const errMsg = e?.response?.data?.message || 'Failed to remove item from cart.';
      console.error('Failed to remove item from backend cart:', errMsg);
      setCartError(errMsg);
    }
  };

  // Increase quantity of a product in the cart
  const increaseQuantity = async (productId) => {
    setCartError('');
    if (!user) {
      window.location.href = '/login';
      return;
    }

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
      const errMsg = e?.response?.data?.message || 'Failed to increase quantity.';
      console.error('Failed to increase quantity in backend cart:', errMsg);
      setCartError(errMsg);
    }
  };

  // Decrease quantity of a product in the cart
  const decreaseQuantity = async (productId) => {
    setCartError('');
    if (!user) {
      window.location.href = '/login';
      return;
    }

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
      const errMsg = e?.response?.data?.message || 'Failed to decrease quantity.';
      console.error('Failed to decrease quantity in backend cart:', errMsg);
      setCartError(errMsg);
    }
  };

  // Clear all items from the cart
  const clearCart = async () => {
    setCartError('');
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
      const errMsg = e?.response?.data?.message || 'Failed to clear cart.';
      console.error('Failed to clear backend cart:', errMsg);
      setCartError(errMsg);
    }
  };

  // Calculate cart total price
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
        cartError,
        clearCartError,
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
