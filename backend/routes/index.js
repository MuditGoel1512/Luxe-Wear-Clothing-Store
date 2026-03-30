// routes/cart.js
const express = require('express');
const cartRouter = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

cartRouter.get('/', protect, getCart);
cartRouter.post('/', protect, addToCart);
cartRouter.put('/:itemId', protect, updateCartItem);
cartRouter.delete('/clear', protect, clearCart);
cartRouter.delete('/:itemId', protect, removeFromCart);

// routes/wishlist.js
const wishlistRouter = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/extraControllers');

wishlistRouter.get('/', protect, getWishlist);
wishlistRouter.post('/', protect, addToWishlist);
wishlistRouter.delete('/:productId', protect, removeFromWishlist);

// routes/orders.js
const orderRouter = express.Router();
const { createRazorpayOrder, verifyPayment, getOrders, getAllOrders, updateOrderStatus } = require('../controllers/extraControllers');
const { adminOnly } = require('../middleware/auth');

orderRouter.post('/create-razorpay-order', protect, createRazorpayOrder);
orderRouter.post('/verify-payment', protect, verifyPayment);
orderRouter.get('/my-orders', protect, getOrders);
orderRouter.get('/all', protect, adminOnly, getAllOrders);
orderRouter.put('/:id/status', protect, adminOnly, updateOrderStatus);

// routes/categories.js
const categoryRouter = express.Router();
const { getCategories, createCategory, deleteCategory, getAdminStats } = require('../controllers/extraControllers');

categoryRouter.get('/', getCategories);
categoryRouter.post('/', protect, adminOnly, createCategory);
categoryRouter.delete('/:id', protect, adminOnly, deleteCategory);

// routes/admin.js
const adminRouter = express.Router();
adminRouter.get('/stats', protect, adminOnly, getAdminStats);

module.exports = { cartRouter, wishlistRouter, orderRouter, categoryRouter, adminRouter };
