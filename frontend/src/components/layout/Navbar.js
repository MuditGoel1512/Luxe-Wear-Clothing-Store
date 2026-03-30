import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, User, Menu, X, Search, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Men', path: '/products?category=men' },
    { label: 'Women', path: '/products?category=women' },
    { label: 'Kids', path: '/products?category=kids' },
    { label: 'Activewear', path: '/products?category=activewear' },
    { label: 'Accessories', path: '/products?category=accessories' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-dark shadow-2xl' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="group">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 border border-gold-500 flex items-center justify-center">
                  <span className="text-gold-500 font-display font-bold text-sm">L</span>
                </div>
                <span className="font-display font-bold text-xl tracking-widest text-white group-hover:text-gold-400 transition-colors">
                  LUXE<span className="text-gold-gradient">WEAR</span>
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-sm tracking-widest uppercase text-gray-300 hover:text-gold-400 transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-500 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button onClick={() => setSearchOpen(!searchOpen)} className="text-gray-300 hover:text-gold-400 transition-colors p-1">
                <Search size={20} />
              </button>

              {user && (
                <Link to="/wishlist" className="text-gray-300 hover:text-gold-400 transition-colors p-1">
                  <Heart size={20} />
                </Link>
              )}

              <Link to="/cart" className="relative text-gray-300 hover:text-gold-400 transition-colors p-1">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-gold-500 text-obsidian-900 text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-gray-300 hover:text-gold-400 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-obsidian-900 font-bold text-sm">
                      {user.name[0].toUpperCase()}
                    </div>
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 glass-dark rounded-sm border border-white/10 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link to="/orders" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-gold-400 hover:bg-white/5 transition-colors">
                          <User size={14} /> My Orders
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-gold-400 hover:bg-white/5 transition-colors">
                            <Settings size={14} /> Admin Panel
                          </Link>
                        )}
                        <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors">
                          <LogOut size={14} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="btn-outline text-sm px-4 py-2 hidden sm:block">
                  Login
                </Link>
              )}

              <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-gray-300 hover:text-gold-400 transition-colors p-1">
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10 overflow-hidden"
            >
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-6 py-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="input-luxury pl-10"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="mobile-menu fixed inset-y-0 right-0 w-72 z-50 flex flex-col pt-20"
          >
            <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2">
              <X size={24} />
            </button>
            <div className="flex flex-col gap-1 p-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={link.path}
                    className="block px-4 py-3 text-base tracking-widest uppercase text-gray-300 hover:text-gold-400 hover:bg-white/5 rounded-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-6 pt-6 border-t border-white/10">
                {!user ? (
                  <Link to="/login" className="btn-gold w-full block text-center text-sm">
                    Login / Register
                  </Link>
                ) : (
                  <button onClick={logout} className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/5 rounded-sm text-sm transition-colors">
                    Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
