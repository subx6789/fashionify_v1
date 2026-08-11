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
    let found = false;

    const updatedCart = cart.map((item) => {
      if (item.product.id === product.id) {
        found = true;
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    if (found) {
      setCart(updatedCart);
    } else {
      setCart([...cart, { product: product, quantity: 1 }]);
    }
  };

   const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    setCart(updatedCart);
  };


  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };


   const decreaseQuantity = (productId) => {
    const updatedCart = cart
      .map((item) => {
        if (item.product.id === productId) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0); // removes item if quantity becomes 0

    setCart(updatedCart);
  };


  const clearCart = () => {
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
