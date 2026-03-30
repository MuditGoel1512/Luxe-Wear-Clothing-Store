import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { items, toggle } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 max-w-7xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-12">
        Wishlist {items.length > 0 && <span className="text-gold-400">({items.length})</span>}
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-32 flex flex-col items-center gap-6">
          <Heart size={64} className="text-gray-700" />
          <h2 className="font-display text-3xl text-gray-400">Your wishlist is empty</h2>
          <p className="text-gray-500 text-sm">Save items you love to your wishlist.</p>
          <Link to="/products" className="btn-gold text-sm">Browse Collection</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="product-card group">
              <div className="relative overflow-hidden aspect-[3/4] bg-obsidian-800">
                <Link to={`/products/${item.product_id}`}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </Link>
                <button onClick={() => toggle(item.product_id)} className="absolute top-3 right-3 w-8 h-8 bg-red-500/90 flex items-center justify-center text-white hover:bg-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{item.category_name}</p>
                <Link to={`/products/${item.product_id}`} className="text-sm font-semibold text-white hover:text-gold-400 transition-colors line-clamp-1 block mb-3">
                  {item.name}
                </Link>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gold-400 text-sm">₹{Number(item.price).toLocaleString('en-IN')}</span>
                  <button onClick={() => addToCart(item.product_id, 1)} className="flex items-center gap-1.5 text-xs border border-white/20 px-3 py-1.5 text-gray-300 hover:border-gold-400 hover:text-gold-400 transition-all">
                    <ShoppingCart size={12} /> Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
