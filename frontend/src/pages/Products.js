import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { productAPI, categoryAPI } from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/common/Loader';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const featured = searchParams.get('featured') || '';
  const trending = searchParams.get('trending') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'created_at';
  const order = searchParams.get('order') || 'DESC';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort, order };
      if (category) params.category = category;
      if (search) params.search = search;
      if (featured) params.featured = featured;
      if (trending) params.trending = trending;
      const res = await productAPI.getAll(params);
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [category, search, featured, trending, page, sort, order]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { categoryAPI.getAll().then(r => setCategories(r.data.categories)).catch(() => {}); }, []);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const sortOptions = [
    { label: 'Latest', value: 'created_at', order: 'DESC' },
    { label: 'Price: Low to High', value: 'price', order: 'ASC' },
    { label: 'Price: High to Low', value: 'price', order: 'DESC' },
    { label: 'Top Rated', value: 'rating', order: 'DESC' },
    { label: 'Name A-Z', value: 'name', order: 'ASC' },
  ];

  const title = search ? `Results for "${search}"` : category ? category.charAt(0).toUpperCase() + category.slice(1) : featured ? 'Featured Collection' : trending ? 'Trending Now' : 'All Products';

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs text-gray-500 uppercase tracking-widest">LuxeWear /</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-2 capitalize">{title}</h1>
          {!loading && <p className="text-gray-400 text-sm mt-2">{total} products found</p>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-2 border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:border-gold-500 hover:text-gold-400 transition-all">
            <SlidersHorizontal size={15} /> Filters
          </button>
          <div className="relative">
            <select
              value={`${sort}:${order}`}
              onChange={e => { const [s, o] = e.target.value.split(':'); setParam('sort', s); const p = new URLSearchParams(searchParams); p.set('order', o); p.delete('page'); setSearchParams(p); }}
              className="appearance-none bg-obsidian-800 border border-white/10 text-sm text-gray-300 px-4 py-2.5 pr-8 focus:border-gold-500 focus:outline-none cursor-pointer"
            >
              {sortOptions.map(o => <option key={o.label} value={`${o.value}:${o.order}`}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filters Drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="glass p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Filter By Category</h3>
                <button onClick={() => setFiltersOpen(false)}><X size={16} className="text-gray-400" /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setParam('category', '')}
                  className={`px-4 py-2 text-xs tracking-widest uppercase border transition-all ${!category ? 'border-gold-500 text-gold-400 bg-gold-500/10' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setParam('category', cat.slug)}
                    className={`px-4 py-2 text-xs tracking-widest uppercase border transition-all ${category === cat.slug ? 'border-gold-500 text-gold-400 bg-gold-500/10' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filters */}
      {(category || search || featured || trending) && (
        <div className="flex flex-wrap gap-2 mb-8">
          {category && <span className="badge badge-outline flex items-center gap-1">{category} <button onClick={() => setParam('category', '')}><X size={10} /></button></span>}
          {search && <span className="badge badge-outline flex items-center gap-1">"{search}" <button onClick={() => setParam('search', '')}><X size={10} /></button></span>}
          {featured && <span className="badge badge-outline flex items-center gap-1">Featured <button onClick={() => setParam('featured', '')}><X size={10} /></button></span>}
          {trending && <span className="badge badge-outline flex items-center gap-1">Trending <button onClick={() => setParam('trending', '')}><X size={10} /></button></span>}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(12).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-32">
          <p className="font-display text-3xl text-gray-600 mb-4">No products found</p>
          <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-16">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => { const sp = new URLSearchParams(searchParams); sp.set('page', p); setSearchParams(sp); }}
              className={`w-10 h-10 text-sm border transition-all ${page === p ? 'border-gold-500 text-gold-400 bg-gold-500/10' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
