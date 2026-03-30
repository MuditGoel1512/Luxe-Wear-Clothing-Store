import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Users, ShoppingBag, TrendingUp, Plus, Edit2, Trash2, X, Check, RefreshCw } from 'lucide-react';
import { productAPI, categoryAPI, adminAPI, orderAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { PageLoader } from '../components/common/Loader';

const TABS = ['Dashboard', 'Products', 'Orders', 'Categories'];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', original_price: '', category_id: '', image: '', sizes: '', colors: '', stock: 100, featured: false, trending: false });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, catRes, ordRes] = await Promise.all([
        adminAPI.getStats(), productAPI.getAll({ limit: 100 }), categoryAPI.getAll(), orderAPI.getAllOrders()
      ]);
      setStats(statsRes.data.stats);
      setProducts(prodRes.data.products);
      setCategories(catRes.data.categories);
      setOrders(ordRes.data.orders);
    } catch (e) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openModal = (product = null) => {
    if (product) {
      setEditProduct(product);
      setForm({ ...product, sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '', colors: Array.isArray(product.colors) ? product.colors.join(', ') : '' });
    } else {
      setEditProduct(null);
      setForm({ name: '', description: '', price: '', original_price: '', category_id: '', image: '', sizes: '', colors: '', stock: 100, featured: false, trending: false });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const data = { ...form, price: parseFloat(form.price), original_price: form.original_price ? parseFloat(form.original_price) : null, stock: parseInt(form.stock), sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean), colors: form.colors.split(',').map(s => s.trim()).filter(Boolean) };
      if (editProduct) { await productAPI.update(editProduct.id, data); toast.success('Product updated'); }
      else { await productAPI.create(data); toast.success('Product created'); }
      setModalOpen(false); fetchAll();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await productAPI.delete(id); toast.success('Deleted'); fetchAll(); }
    catch (e) { toast.error('Failed to delete'); }
  };

  const handleOrderStatus = async (id, status) => {
    try { await orderAPI.updateStatus(id, { status }); toast.success('Status updated'); fetchAll(); }
    catch (e) { toast.error('Failed to update status'); }
  };

  if (loading) return <PageLoader />;

  const statCards = stats ? [
    { icon: Users, label: 'Total Users', value: stats.total_users, color: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/30', icon_color: 'text-blue-400' },
    { icon: Package, label: 'Total Products', value: stats.total_products, color: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-500/30', icon_color: 'text-purple-400' },
    { icon: ShoppingBag, label: 'Total Orders', value: stats.total_orders, color: 'from-teal-500/20 to-teal-600/20', border: 'border-teal-500/30', icon_color: 'text-teal-400' },
    { icon: TrendingUp, label: 'Revenue', value: `₹${Number(stats.total_revenue).toLocaleString('en-IN')}`, color: 'from-gold-500/20 to-gold-600/20', border: 'border-gold-500/30', icon_color: 'text-gold-400' },
  ] : [];

  const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="text-xs text-gold-400 uppercase tracking-widest">Admin</span>
          <h1 className="font-display text-4xl font-bold text-white mt-1">Control Panel</h1>
        </div>
        <button onClick={fetchAll} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gold-400 border border-white/10 hover:border-gold-500 px-4 py-2 transition-all">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-white/10 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 text-sm uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === tab ? 'text-gold-400 border-b-2 border-gold-400' : 'text-gray-500 hover:text-gray-300'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'Dashboard' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map(({ icon: Icon, label, value, color, border, icon_color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className={`glass bg-gradient-to-br ${color} border ${border} p-6`}>
                <Icon size={22} className={`${icon_color} mb-4`} />
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                <p className="font-display text-2xl font-bold text-white">{value}</p>
              </motion.div>
            ))}
          </div>
          <div className="glass p-6">
            <h3 className="font-semibold text-white mb-4">Recent Orders</h3>
            <table className="w-full admin-table">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {stats?.recent_orders?.map(o => (
                  <tr key={o.id}>
                    <td className="text-gray-300 text-sm">#{o.id}</td>
                    <td className="text-gray-300 text-sm">{o.user_name}</td>
                    <td className="text-gold-400 text-sm">₹{Number(o.total_price).toLocaleString('en-IN')}</td>
                    <td><span className="badge badge-outline text-xs">{o.status}</span></td>
                    <td className="text-gray-500 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products */}
      {activeTab === 'Products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-400 text-sm">{products.length} products</p>
            <button onClick={() => openModal()} className="btn-gold text-sm flex items-center gap-2"><Plus size={16} /> Add Product</button>
          </div>
          <div className="glass overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full admin-table">
                <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-12 object-cover bg-obsidian-800" onError={e => e.target.src='https://via.placeholder.com/40x48'} />
                          <span className="text-white text-sm max-w-[180px] truncate">{p.name}</span>
                        </div>
                      </td>
                      <td className="text-gray-400 text-sm">{p.category_name}</td>
                      <td className="text-gold-400 text-sm">₹{Number(p.price).toLocaleString('en-IN')}</td>
                      <td className="text-gray-400 text-sm">{p.stock}</td>
                      <td>{p.featured ? <Check size={14} className="text-green-400" /> : <X size={14} className="text-gray-600" />}</td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => openModal(p)} className="w-8 h-8 flex items-center justify-center border border-white/10 text-gray-400 hover:text-gold-400 hover:border-gold-500 transition-all"><Edit2 size={13} /></button>
                          <button onClick={() => handleDelete(p.id)} className="w-8 h-8 flex items-center justify-center border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500 transition-all"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders */}
      {activeTab === 'Orders' && (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full admin-table">
              <thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Update</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td className="text-gray-300 text-sm">#{o.id}</td>
                    <td><div><p className="text-white text-sm">{o.user_name}</p><p className="text-gray-500 text-xs">{o.user_email}</p></div></td>
                    <td className="text-gold-400 text-sm">₹{Number(o.total_price).toLocaleString('en-IN')}</td>
                    <td><span className={`text-xs ${o.payment_status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>{o.payment_status}</span></td>
                    <td><span className="badge badge-outline text-xs">{o.status}</span></td>
                    <td className="text-gray-500 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td>
                      <select value={o.status} onChange={e => handleOrderStatus(o.id, e.target.value)}
                        className="bg-obsidian-800 border border-white/10 text-gray-300 text-xs px-2 py-1.5 focus:outline-none focus:border-gold-500">
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categories */}
      {activeTab === 'Categories' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="glass p-4">
                <p className="font-semibold text-white">{cat.name}</p>
                <p className="text-xs text-gray-500 mt-1">/{cat.slug}</p>
                <button onClick={async () => { if(window.confirm('Delete category?')) { await categoryAPI.delete(cat.id); fetchAll(); } }} className="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors">Delete</button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Product Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} className="glass-dark w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl font-bold text-white">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setModalOpen(false)}><X size={22} className="text-gray-400" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Product Name', span: 2 },
                  { key: 'price', label: 'Price (₹)', type: 'number' },
                  { key: 'original_price', label: 'Original Price (₹)', type: 'number' },
                  { key: 'stock', label: 'Stock', type: 'number' },
                  { key: 'image', label: 'Image URL', span: 2 },
                  { key: 'sizes', label: 'Sizes (comma-separated)', span: 2 },
                  { key: 'colors', label: 'Colors (comma-separated)', span: 2 },
                ].map(({ key, label, type = 'text', span }) => (
                  <div key={key} className={span === 2 ? 'sm:col-span-2' : ''}>
                    <label className="text-xs uppercase tracking-widest text-gray-400 block mb-2">{label}</label>
                    <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-luxury" placeholder={label} />
                  </div>
                ))}
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-400 block mb-2">Category</label>
                  <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className="input-luxury">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 block mb-2">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="input-luxury resize-none" placeholder="Product description" />
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="accent-gold-500" />
                    <span className="text-sm text-gray-300">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.trending} onChange={e => setForm(f => ({ ...f, trending: e.target.checked }))} className="accent-gold-500" />
                    <span className="text-sm text-gray-300">Trending</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setModalOpen(false)} className="btn-outline flex-1 text-sm">Cancel</button>
                <button onClick={handleSave} className="btn-gold flex-1 text-sm">{editProduct ? 'Update' : 'Create'} Product</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
