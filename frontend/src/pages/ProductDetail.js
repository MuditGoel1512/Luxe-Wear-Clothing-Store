import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, ArrowLeft, Check, Minus, Plus } from 'lucide-react';
import { productAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';
import { PageLoader } from '../components/common/Loader';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    productAPI.getOne(id)
      .then(res => {
        setProduct(res.data.product);
        setSelectedSize(res.data.product.sizes?.[0] || '');
        setSelectedColor(res.data.product.colors?.[0] || '');
        return productAPI.getAll({ category: res.data.product.category_slug, limit: 4 });
      })
      .then(res => setRelated(res.data.products.filter(p => p.id !== parseInt(id)).slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!product) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Product not found</p></div>;

  const images = [product.image, ...(product.images || [])].filter(Boolean);
  const discount = product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product.id, quantity, selectedSize, selectedColor);
    setAdding(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-500">
          <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gold-400 transition-colors">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category_slug}`} className="hover:text-gold-400 transition-colors capitalize">{product.category_name}</Link>
          <span>/</span>
          <span className="text-gray-300 line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Images */}
          <div className="space-y-3">
            <motion.div
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[4/5] overflow-hidden bg-obsidian-800"
            >
              <img src={images[activeImg] || product.image} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-24 overflow-hidden border-2 transition-all ${activeImg === i ? 'border-gold-500' : 'border-transparent opacity-50 hover:opacity-75'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-2">
              <Link to={`/products?category=${product.category_slug}`} className="text-xs uppercase tracking-widest text-gold-400 hover:underline">
                {product.category_name}
              </Link>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className={i < Math.round(product.rating) ? 'star' : 'star-empty'} fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-sm text-gray-400">{product.rating} ({product.review_count} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
              <span className="font-display text-3xl font-bold text-gold-400">₹{Number(product.price).toLocaleString('en-IN')}</span>
              {product.original_price && (
                <>
                  <span className="text-lg text-gray-500 line-through">₹{Number(product.original_price).toLocaleString('en-IN')}</span>
                  <span className="badge badge-gold">{discount}% OFF</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed mb-8">{product.description}</p>

            {/* Color */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Color: <span className="text-white">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs border transition-all ${selectedColor === color ? 'border-gold-500 text-gold-400 bg-gold-500/10' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Size: <span className="text-white">{selectedSize}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] py-2 px-3 text-sm border transition-all ${selectedSize === size ? 'border-gold-500 text-gold-400 bg-gold-500/10' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <p className="text-xs uppercase tracking-widest text-gray-400">Quantity</p>
              <div className="flex items-center border border-white/10">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-white">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-xs text-gray-500">{product.stock} in stock</span>
            </div>

            {/* CTA */}
            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart} disabled={adding} className="btn-gold flex-1 flex items-center justify-center gap-2 text-sm">
                {adding ? <div className="w-4 h-4 border-2 border-obsidian-900/30 border-t-obsidian-900 rounded-full animate-spin" /> : <ShoppingCart size={16} />}
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={() => toggle(product.id)}
                className={`w-12 h-12 border flex items-center justify-center transition-all ${isWishlisted(product.id) ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
              >
                <Heart size={18} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Perks */}
            <div className="space-y-3 pt-6 border-t border-white/10">
              {['Free shipping on orders above ₹2,999', 'Easy 30-day returns', 'Authenticity guaranteed'].map(perk => (
                <div key={perk} className="flex items-center gap-2 text-sm text-gray-400">
                  <Check size={14} className="text-gold-400" /> {perk}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-24">
            <div className="divider" />
            <h2 className="font-display text-3xl font-bold text-white mb-10">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
