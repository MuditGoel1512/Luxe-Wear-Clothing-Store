import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id || product.product_id);
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      <Link to={`/products/${product.id}`} className="block product-card group">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-obsidian-800">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'; }}
          />
          <div className="overlay" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && <span className="badge badge-gold">-{discount}%</span>}
            {product.trending && <span className="badge badge-outline">Trending</span>}
            {product.featured && <span className="badge" style={{background:'rgba(13,13,13,0.8)',border:'1px solid rgba(255,255,255,0.15)',color:'#fff',fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.25rem 0.75rem'}}>Featured</span>}
          </div>

          {/* Actions on hover */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-obsidian-900 text-xs font-semibold py-2.5 hover:bg-gold-400 transition-colors"
            >
              <ShoppingCart size={14} /> Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className={`w-10 flex items-center justify-center border transition-colors ${
                wishlisted ? 'bg-red-500 border-red-500 text-white' : 'border-white/30 text-white hover:border-white'
              }`}
            >
              <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{product.category_name}</p>
          <h3 className="text-sm font-semibold text-white mb-2 line-clamp-1 group-hover:text-gold-400 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.round(product.rating || 4) ? 'star' : 'star-empty'}
                fill={i < Math.round(product.rating || 4) ? 'currentColor' : 'none'}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.review_count || 0})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gold-400">₹{Number(product.price).toLocaleString('en-IN')}</span>
            {product.original_price && (
              <span className="text-xs text-gray-500 line-through">
                ₹{Number(product.original_price).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
