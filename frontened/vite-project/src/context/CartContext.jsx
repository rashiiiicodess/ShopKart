import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCartApi,
  addToCartApi,
  updateCartQtyApi,
  removeFromCartApi,
} from '../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCartApi();
      setCartItems(data.cart || []);
    } catch (err) {
      setError('Unable to load your cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId) => {
    try {
      const data = await addToCartApi(productId);
      setCartItems(data.cart);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add item to cart.';
      return { success: false, message: msg };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const data = await updateCartQtyApi(productId, quantity);
      setCartItems(data.cart);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not update quantity.';
      return { success: false, message: msg };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const data = await removeFromCartApi(productId);
      setCartItems(data.cart);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not remove item.';
      return { success: false, message: msg };
    }
  };

  // Derived Values
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        cartCount,
        subtotal,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);