import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('fashionify_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fashionify_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (product) => {
    // TODO:
    // 1. Add product to cart in state structure: { product, quantity }.
    // 2. If product already exists in cart, increase quantity.
    // 3. Keep cart state updated.
  };

  const removeFromCart = (productId) => {
    // TODO:
    // 1. Filter out product with productId from cart state.
  };

  const increaseQuantity = (productId) => {
    // TODO:
    // 1. Find item in cart by productId and increment its quantity.
  };

  const decreaseQuantity = (productId) => {
    // TODO:
    // 1. Find item in cart by productId and decrement its quantity.
    // 2. If quantity reaches 0, remove item or keep minimum 1.
  };

  const clearCart = () => {
    // TODO:
    // 1. Reset cart state to an empty array [].
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
