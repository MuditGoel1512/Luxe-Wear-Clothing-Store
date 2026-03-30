import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        await register(form.name, form.email, form.password);
        toast.success('Account created! Welcome to LuxeWear');
      }
      navigate(from, { replace: true });
    } catch (e) {
      toast.error(e.response?.data?.message || (isLogin ? 'Login failed' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex liquid-bg relative overflow-hidden">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-col justify-between flex-1 p-16 relative z-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 border border-gold-500 flex items-center justify-center">
            <span className="text-gold-500 font-display font-bold text-sm">L</span>
          </div>
          <span className="font-display font-bold text-xl tracking-widest">LUXE<span className="text-gold-gradient">WEAR</span></span>
        </Link>
        <div>
          <h2 className="font-display text-6xl font-black text-white leading-tight mb-6">
            Dress to<br /><span className="text-gold-gradient italic">Impress.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md">Join thousands who trust LuxeWear for premium fashion that speaks volumes.</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[['250+', 'Styles'], ['50k+', 'Happy Customers'], ['4.9★', 'Rating']].map(([val, label]) => (
            <div key={label}>
              <div className="font-display font-bold text-2xl text-gold-400">{val}</div>
              <div className="text-xs tracking-widest uppercase text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center p-8 relative z-10">
        <motion.div
          key={isLogin ? 'login' : 'register'}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          <div className="glass p-8">
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-400 text-sm mb-8">
              {isLogin ? 'Sign in to your LuxeWear account' : 'Join the LuxeWear community'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-400 block mb-2">Full Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" className="input-luxury" required />
                </div>
              )}
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 block mb-2">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" className="input-luxury" required />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 block mb-2">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" className="input-luxury pr-12" required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-gold w-full text-sm flex items-center justify-center gap-2 mt-6">
                {loading ? <div className="w-4 h-4 border-2 border-obsidian-900/30 border-t-obsidian-900 rounded-full animate-spin" /> : <ArrowRight size={16} />}
                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="divider my-6" />

            <p className="text-center text-sm text-gray-400">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button onClick={() => setIsLogin(!isLogin)} className="text-gold-400 hover:text-gold-300 font-semibold transition-colors">
                {isLogin ? 'Register' : 'Sign In'}
              </button>
            </p>

            {isLogin && (
              <div className="mt-6 p-4 bg-white/5 border border-white/10 text-xs text-gray-400 space-y-1">
                <p className="font-semibold text-gray-300 mb-2">Demo Credentials:</p>
                <p>Admin: admin@luxewear.com / Admin@123</p>
                <p>User: john@example.com / Admin@123</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
