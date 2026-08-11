import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('fashionify_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  const fetchBackendCart = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/cart');
      if (res.data && res.data.items) {
        setCart(res.data.items);
      }
    } catch (e) {
      console.error('Failed to fetch cart from backend', e);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBackendCart();
    } else {
      try {
        const savedCart = localStorage.getItem('fashionify_cart');
        setCart(savedCart ? JSON.parse(savedCart) : []);
      } catch (e) {
        setCart([]);
      }
    }
  }, [user, fetchBackendCart]);

  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem('fashionify_cart', JSON.stringify(cart));
      } catch (e) {
        console.error('Failed to save cart to localStorage', e);
      }
    }
  }, [cart, user]);

  const addToCart = async (product, qty = 1) => {
    if (user) {
      try {
        const res = await api.post('/cart/items', { productId: product.id, quantity: qty });
        if (res.data && res.data.items) {
          setCart(res.data.items);
        }
        return;
      } catch (e) {
        console.error('Failed to add item to backend cart', e);
      }
    }

    // Local cart fallback
    let found = false;
    const updatedCart = cart.map((item) => {
      if (item.product.id === product.id) {
        found = true;
        return { ...item, quantity: item.quantity + qty };
      }
      return item;
    });

    if (found) {
      setCart(updatedCart);
    } else {
      setCart([...cart, { product, quantity: qty }]);
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const res = await api.delete(`/cart/items/${productId}`);
        if (res.data && res.data.items) {
          setCart(res.data.items);
        }
        return;
      } catch (e) {
        console.error('Failed to remove item from backend cart', e);
      }
    }

    const updatedCart = cart.filter((item) => item.product.id !== productId);
    setCart(updatedCart);
  };

  const increaseQuantity = async (productId) => {
    const item = cart.find((i) => i.product.id === productId);
    const newQty = (item ? item.quantity : 0) + 1;

    if (user) {
      try {
        const res = await api.put(`/cart/items/${productId}`, { quantity: newQty });
        if (res.data && res.data.items) {
          setCart(res.data.items);
        }
        return;
      } catch (e) {
        console.error('Failed to increase quantity in backend cart', e);
      }
    }

    const updatedCart = cart.map((i) => {
      if (i.product.id === productId) {
        return { ...i, quantity: i.quantity + 1 };
      }
      return i;
    });
    setCart(updatedCart);
  };

  const decreaseQuantity = async (productId) => {
    const item = cart.find((i) => i.product.id === productId);
    const newQty = (item ? item.quantity : 1) - 1;

    if (user) {
      try {
        if (newQty <= 0) {
          return await removeFromCart(productId);
        }
        const res = await api.put(`/cart/items/${productId}`, { quantity: newQty });
        if (res.data && res.data.items) {
          setCart(res.data.items);
        }
        return;
      } catch (e) {
        console.error('Failed to decrease quantity in backend cart', e);
      }
    }

    const updatedCart = cart
      .map((i) => {
        if (i.product.id === productId) {
          return { ...i, quantity: i.quantity - 1 };
        }
        return i;
      })
      .filter((i) => i.quantity > 0);

    setCart(updatedCart);
  };

  const clearCart = async () => {
    if (user) {
      try {
        const res = await api.delete('/cart');
        if (res.data && res.data.items) {
          setCart(res.data.items);
        } else {
          setCart([]);
        }
        return;
      } catch (e) {
        console.error('Failed to clear backend cart', e);
      }
    }

    setCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product?.price || 0) * (item.quantity || 1), 0);
  const cartItemCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

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
