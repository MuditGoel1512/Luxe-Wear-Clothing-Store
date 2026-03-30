import React from 'react';
import { motion } from 'framer-motion';

export const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className={`${sizes[size]} border-2 border-white/10 border-t-gold-400 rounded-full animate-spin`} />
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-obsidian-950">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      className="w-16 h-16 border-2 border-white/5 border-t-gold-400 rounded-full"
    />
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-6 text-sm tracking-widest uppercase text-gray-500"
    >
      Loading LuxeWear
    </motion.p>
  </div>
);

export const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-[3/4] bg-obsidian-800 rounded-sm" />
    <div className="p-4 space-y-2">
      <div className="h-3 bg-obsidian-800 rounded w-1/3" />
      <div className="h-4 bg-obsidian-800 rounded w-3/4" />
      <div className="h-3 bg-obsidian-800 rounded w-1/2" />
    </div>
  </div>
);

export default Spinner;
