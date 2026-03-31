import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw, Star } from 'lucide-react';
import { productAPI, categoryAPI } from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/common/Loader';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, trendingRes, catRes] = await Promise.all([
          productAPI.getFeatured(),
          productAPI.getAll({ trending: true, limit: 8 }),
          categoryAPI.getAll(),
        ]);
        setFeatured(featuredRes.data.products);
        setTrending(trendingRes.data.products);
        setCategories(catRes.data.categories);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
    // Scrollytelling
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: Shield, title: 'Authenticity Guaranteed', desc: 'Every piece is carefully verified and certified for premium quality.' },
    { icon: Truck, title: 'Free Express Delivery', desc: 'Complimentary delivery on all orders above ₹2,999.' },
    { icon: RotateCcw, title: '30-Day Returns', desc: 'Easy returns and exchanges within 30 days of purchase.' },
    { icon: Star, title: 'Exclusive Rewards', desc: 'Earn points on every purchase. Redeem for discounts and perks.' },
  ];

  const categoryImages = {
    men: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    women: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    kids: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600',
    accessories: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    footwear: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    activewear: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
  };

  return (
    <div className="liquid-bg min-h-screen overflow-hidden">
      {/* Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-gold-400 border border-gold-500/30 px-4 py-2 mb-8">
              <Sparkles size={12} /> New Season 2024 Collection
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] mb-8"
          >
            <span className="text-white">Wear the</span>
            <br />
            <span className="text-gold-gradient italic">Extraordinary</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Discover premium fashion that transcends the ordinary. Each piece is a testament to uncompromising craftsmanship and timeless style.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/products" className="btn-gold text-sm flex items-center gap-2 justify-center">
              Explore Collection <ArrowRight size={16} />
            </Link>
            <Link to="/products?featured=true" className="btn-outline text-sm">
              View Lookbook
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-sm mx-auto"
          >
            {[['250+', 'Styles'], ['50k+', 'Customers'], ['4.9★', 'Rating']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="font-display font-bold text-2xl text-gold-400">{val}</div>
                <div className="text-xs tracking-widest uppercase text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gray-600 to-transparent" />
        </motion.div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="reveal text-center mb-16">
          <span className="text-xs tracking-widest uppercase text-gold-400">Shop By</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-3">Collections</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(categories.length ? categories : ['Men','Women','Kids','Accessories','Footwear','Activewear'].map((n,i)=>({id:i,name:n,slug:n.toLowerCase()}))).slice(0,6).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden group cursor-pointer ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              onClick={() => navigate(`/products?category=${cat.slug}`)}
            >
              <div className={`relative ${i === 0 ? 'aspect-[2/1.2] md:aspect-square' : 'aspect-square'} bg-obsidian-800`}>
                <img
                  src={categoryImages[cat.slug] || cat.image || `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600`}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/90 via-obsidian-950/30 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">{cat.name}</h3>
                  <span className="text-xs text-gold-400 tracking-widest uppercase group-hover:underline">Shop Now →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── FEATURED ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="reveal flex items-end justify-between mb-16">
          <div>
            <span className="text-xs tracking-widest uppercase text-gold-400">Handpicked</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-3">Featured Pieces</h2>
          </div>
          <Link to="/products?featured=true" className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-gold-400 transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            : featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
          }
        </div>
      </section>

      {/* ── BANNER ── */}
      <section className="py-8 px-6">
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto relative overflow-hidden rounded-sm"
          style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0d1a2e 50%, #1a1a0d 100%)' }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full filter blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-aurora-purple rounded-full filter blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative z-10 py-20 px-8 text-center">
            <span className="text-xs tracking-widest uppercase text-gold-400">Limited Time</span>
            <h2 className="font-display text-5xl md:text-7xl font-black text-white mt-4 mb-6">
              Up to <span className="text-gold-gradient">50% Off</span>
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-lg mx-auto">
              Season-end clearance on premium pieces. Elevate your wardrobe while it lasts.
            </p>
            <Link to="/products" className="btn-gold text-sm inline-flex items-center gap-2">
              Shop the Sale <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── TRENDING ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="reveal flex items-end justify-between mb-16">
          <div>
            <span className="text-xs tracking-widest uppercase text-gold-400">Right Now</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-3">Trending</h2>
          </div>
          <Link to="/products?trending=true" className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-gold-400 transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            : trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
          }
        </div>
      </section>

      {/* ── FEATURES / USPs ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass p-8 text-center group hover:border-gold-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 border border-gold-500/30 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold-500/10 transition-colors">
                <Icon size={22} className="text-gold-400" />
              </div>
              <h3 className="font-semibold text-white mb-3 text-sm tracking-wide">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="reveal text-center mb-16">
          <span className="text-xs tracking-widest uppercase text-gold-400">What They Say</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-3">Loved by Thousands</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Aanya Sharma', role: 'Fashion Blogger', text: 'LuxeWear has completely transformed my wardrobe. The quality is unmatched and every piece feels premium. Absolutely obsessed with the Aurora dress!', rating: 5 },
            { name: 'Rohan Mehta', role: 'Entrepreneur', text: 'The Obsidian Blazer is now my go-to for every important meeting. The craftsmanship is exceptional and the fit is perfect. Worth every rupee.', rating: 5 },
            { name: 'Priya Nair', role: 'Stylist', text: 'I recommend LuxeWear to all my clients. The collection is curated beautifully and the customer service is impeccable. 10/10 experience!', rating: 5 },
          ].map(({ name, role, text, rating }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              viewport={{ once: true }}
              className="glass p-8"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(rating)].map((_, j) => <Star key={j} size={14} className="star" fill="currentColor" />)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-bold text-obsidian-900">
                  {name[0]}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{name}</p>
                  <p className="text-gray-500 text-xs">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
