import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const { user } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!user) { setItems([]); return; }
    try {
      const res = await wishlistAPI.get();
      setItems(res.data.items);
    } catch (e) { console.error(e); }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggle = async (product_id) => {
    if (!user) { toast.error('Please login to use wishlist'); return; }
    const exists = items.some(i => i.product_id === product_id);
    try {
      if (exists) {
        await wishlistAPI.remove(product_id);
        setItems(prev => prev.filter(i => i.product_id !== product_id));
        toast.success('Removed from wishlist');
      } else {
        await wishlistAPI.add({ product_id });
        await fetchWishlist();
        toast.success('Added to wishlist');
      }
    } catch (e) { toast.error('Wishlist update failed'); }
  };

  const isWishlisted = (product_id) => items.some(i => i.product_id === product_id);

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
