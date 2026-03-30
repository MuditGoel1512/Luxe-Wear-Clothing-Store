import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { orderAPI } from '../utils/api';
import { PageLoader } from '../components/common/Loader';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30', label: 'Confirmed' },
  processing: { icon: Package, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-teal-400', bg: 'bg-teal-400/10 border-teal-400/30', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30', label: 'Cancelled' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(res => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 max-w-5xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-12">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-32 flex flex-col items-center gap-6">
          <Package size={64} className="text-gray-700" />
          <h2 className="font-display text-3xl text-gray-400">No orders yet</h2>
          <p className="text-gray-500 text-sm">Start shopping to see your orders here.</p>
          <Link to="/products" className="btn-gold text-sm">Browse Collection</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, i) => {
            const cfg = statusConfig[order.status] || statusConfig.pending;
            const Icon = cfg.icon;
            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="glass p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Order #{order.id}</p>
                    <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 text-xs uppercase tracking-widest px-3 py-1.5 border rounded-sm ${cfg.bg} ${cfg.color}`}>
                      <Icon size={12} /> {cfg.label}
                    </span>
                    <span className="font-bold text-gold-400">₹{Number(order.total_price).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-14 h-16 bg-obsidian-800 overflow-hidden flex-shrink-0">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium line-clamp-1 max-w-[150px]">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                        <p className="text-xs text-gold-400 mt-0.5">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {order.payment_id && (
                  <p className="text-xs text-gray-600 mt-4">Payment ID: {order.payment_id}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
