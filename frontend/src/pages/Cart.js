import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items, total, updateItem, removeItem, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-20">
      <ShoppingBag size={48} className="text-gray-600" />
      <h2 className="font-display text-2xl text-white">Please login to view cart</h2>
      <Link to="/login" className="btn-gold text-sm">Login</Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 max-w-7xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-12">
        Your Cart {items.length > 0 && <span className="text-gold-400">({items.length})</span>}
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-32 flex flex-col items-center gap-6">
          <ShoppingBag size={64} className="text-gray-700" />
          <h2 className="font-display text-3xl text-gray-400">Your cart is empty</h2>
          <p className="text-gray-500 text-sm">Discover our collection and add items you love.</p>
          <Link to="/products" className="btn-gold text-sm">Browse Collection</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass flex gap-4 p-4"
                >
                  <Link to={`/products/${item.product_id}`} className="w-24 h-28 flex-shrink-0 overflow-hidden bg-obsidian-800">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <Link to={`/products/${item.product_id}`} className="font-semibold text-white text-sm hover:text-gold-400 transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0 p-1">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-gray-500">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-white/10">
                        <button onClick={() => updateItem(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
                        <button onClick={() => updateItem(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-semibold text-gold-400">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="glass p-6 sticky top-28">
              <h2 className="font-semibold text-white text-lg mb-6 pb-4 border-b border-white/10">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Shipping</span>
                  <span className={total > 2999 ? 'text-green-400' : ''}>
                    {total > 2999 ? 'FREE' : '₹199'}
                  </span>
                </div>
                {total <= 2999 && <p className="text-xs text-gray-500">Add ₹{(2999 - total).toLocaleString('en-IN')} more for free shipping</p>}
              </div>
              <div className="flex justify-between font-bold text-white text-lg pt-4 border-t border-white/10 mb-8">
                <span>Total</span>
                <span className="text-gold-400">₹{(total + (total > 2999 ? 0 : 199)).toLocaleString('en-IN')}</span>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn-gold w-full text-sm flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <Link to="/products" className="mt-4 block text-center text-sm text-gray-400 hover:text-gold-400 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
