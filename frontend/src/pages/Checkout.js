import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '', country: 'India' });

  const shipping = total > 2999 ? 0 : 199;
  const grandTotal = total + shipping;

  const loadRazorpay = () => new Promise(resolve => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error('Payment gateway failed to load'); return; }

      const orderRes = await orderAPI.createRazorpayOrder({ amount: grandTotal });
      const rzpOrder = orderRes.data.order;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'LuxeWear',
        description: 'Premium Fashion Purchase',
        order_id: rzpOrder.id,
        prefill: { name: user.name, email: user.email, contact: address.phone },
        theme: { color: '#d4a017' },
        handler: async (response) => {
          try {
            await orderAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cart_items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity, price: i.price, size: i.size, color: i.color })),
              shipping_address: address,
            });
            await clearCart();
            setStep(3);
          } catch (e) { toast.error('Payment verification failed'); }
        },
        modal: { ondismiss: () => setProcessing(false) },
      };
      new window.Razorpay(options).open();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (step === 3) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-20 px-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <CheckCircle size={80} className="text-green-400" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
        <h1 className="font-display text-4xl font-bold text-white mb-3">Order Confirmed!</h1>
        <p className="text-gray-400 mb-8">Thank you for shopping with LuxeWear. Your order is being processed.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/orders')} className="btn-gold text-sm">View Orders</button>
          <button onClick={() => navigate('/products')} className="btn-outline text-sm">Continue Shopping</button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 max-w-6xl mx-auto">
      <h1 className="font-display text-4xl font-bold text-white mb-12">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-12">
        {[{ n: 1, label: 'Address', icon: MapPin }, { n: 2, label: 'Payment', icon: CreditCard }].map(({ n, label, icon: Icon }) => (
          <React.Fragment key={n}>
            <div className={`flex items-center gap-2 text-sm ${step >= n ? 'text-gold-400' : 'text-gray-600'}`}>
              <div className={`w-8 h-8 border flex items-center justify-center ${step >= n ? 'border-gold-500 bg-gold-500/10' : 'border-white/10'}`}>
                <Icon size={14} />
              </div>
              <span className="hidden sm:block uppercase tracking-widest text-xs">{label}</span>
            </div>
            {n < 2 && <div className={`flex-1 h-px ${step > n ? 'bg-gold-500' : 'bg-white/10'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass p-8">
              <h2 className="font-semibold text-white text-lg mb-6 flex items-center gap-2"><MapPin size={18} className="text-gold-400" /> Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name', sm: 2 },
                  { key: 'phone', label: 'Phone Number', sm: 2 },
                  { key: 'street', label: 'Street Address', sm: 2 },
                  { key: 'city', label: 'City', sm: 1 },
                  { key: 'state', label: 'State', sm: 1 },
                  { key: 'pincode', label: 'PIN Code', sm: 1 },
                  { key: 'country', label: 'Country', sm: 1 },
                ].map(({ key, label, sm }) => (
                  <div key={key} className={sm === 2 ? 'sm:col-span-2' : ''}>
                    <label className="text-xs uppercase tracking-widest text-gray-400 block mb-2">{label}</label>
                    <input
                      value={address[key]}
                      onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))}
                      className="input-luxury"
                      placeholder={label}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
                    toast.error('Please fill all required fields'); return;
                  }
                  setStep(2);
                }}
                className="btn-gold w-full mt-8 text-sm"
              >
                Continue to Payment
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass p-8">
              <h2 className="font-semibold text-white text-lg mb-6 flex items-center gap-2"><CreditCard size={18} className="text-gold-400" /> Payment</h2>
              <div className="border border-white/10 p-6 mb-6 rounded-sm">
                <p className="text-sm text-gray-300 mb-3">You will be redirected to Razorpay's secure payment gateway to complete your purchase.</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['VISA', 'Mastercard', 'UPI', 'Net Banking', 'Wallets'].map(m => (
                    <span key={m} className="text-xs text-gray-500 border border-white/10 px-2 py-1">{m}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-3 mb-8 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Shipping to:</span>
                  <span className="text-white text-right max-w-xs">{address.street}, {address.city}, {address.state} {address.pincode}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline flex-1 text-sm">Back</button>
                <button onClick={handlePayment} disabled={processing} className="btn-gold flex-1 text-sm flex items-center justify-center gap-2">
                  {processing ? <div className="w-4 h-4 border-2 border-obsidian-900/30 border-t-obsidian-900 rounded-full animate-spin" /> : <CreditCard size={16} />}
                  {processing ? 'Processing...' : `Pay ₹${grandTotal.toLocaleString('en-IN')}`}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div className="glass p-6 h-fit sticky top-28">
          <h3 className="font-semibold text-white mb-6 pb-4 border-b border-white/10">Order Summary</h3>
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {items.map(item => (
              <div key={item.id} className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-14 object-cover bg-obsidian-800 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}{item.size ? ` · ${item.size}` : ''}</p>
                  <p className="text-xs text-gold-400 mt-1">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-gray-400"><span>Shipping</span><span className={shipping === 0 ? 'text-green-400' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-white/10 mt-2">
              <span>Grand Total</span><span className="text-gold-400">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
