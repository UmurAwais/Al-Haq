import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Attempt to load cart from localStorage
    const savedCart = localStorage.getItem('alhaq_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('alhaq_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (course) => {
    // Only add if not already in cart
    if (!cartItems.some(item => (item.id || item._id) === (course.id || course._id))) {
      setCartItems(prev => [...prev, course]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => (item.id || item._id) !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
