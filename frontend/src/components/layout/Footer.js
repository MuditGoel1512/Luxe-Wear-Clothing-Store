import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="bg-obsidian-950 border-t border-white/5 mt-24">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 border border-gold-500 flex items-center justify-center">
              <span className="text-gold-500 font-display font-bold text-sm">L</span>
            </div>
            <span className="font-display font-bold text-xl tracking-widest">
              LUXE<span className="text-gold-gradient">WEAR</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Premium fashion for those who demand the exceptional. Curated collections that define modern luxury.
          </p>
          <div className="flex gap-4">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="/" className="w-9 h-9 border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-400 transition-all">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-widest uppercase text-gold-400 mb-6">Collections</h3>
          <ul className="space-y-3">
            {['Men', 'Women', 'Kids', 'Activewear', 'Accessories', 'Footwear'].map(cat => (
              <li key={cat}>
                <Link to={`/products?category=${cat.toLowerCase()}`} className="text-gray-400 hover:text-white text-sm transition-colors">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-widest uppercase text-gold-400 mb-6">Help</h3>
          <ul className="space-y-3">
            {['FAQ', 'Shipping & Returns', 'Size Guide', 'Track Order', 'Contact Us', 'Privacy Policy'].map(item => (
              <li key={item}>
                <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-widest uppercase text-gold-400 mb-6">Contact</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-gray-400">
              <MapPin size={15} className="text-gold-400 mt-0.5 flex-shrink-0" />
              <span>42 Fashion Avenue, Mumbai, India 400001</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Phone size={15} className="text-gold-400 flex-shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Mail size={15} className="text-gold-400 flex-shrink-0" />
              <span>hello@luxewear.in</span>
            </li>
          </ul>

          <div className="mt-8">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Subscribe to our newsletter</p>
            <div className="flex">
              <input placeholder="Your email" className="input-luxury text-sm flex-1 rounded-r-none" />
              <button className="btn-gold px-4 text-sm rounded-none rounded-r-sm">→</button>
            </div>
          </div>
        </div>
      </div>

      <div className="divider" />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>© 2024 LuxeWear. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>We accept:</span>
          {['VISA', 'Mastercard', 'Razorpay', 'UPI'].map(p => (
            <span key={p} className="px-2 py-1 border border-white/10 text-xs text-gray-400">{p}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
