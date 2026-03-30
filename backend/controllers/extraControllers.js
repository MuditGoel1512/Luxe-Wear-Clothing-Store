// ============ WISHLIST CONTROLLER ============
const { pool } = require('../config/db');

const getWishlist = async (req, res) => {
  try {
    const [items] = await pool.execute(
      `SELECT w.id, p.id as product_id, p.name, p.price, p.image, p.rating, c.name as category_name
       FROM wishlist w JOIN products p ON w.product_id = p.id JOIN categories c ON p.category_id = c.id
       WHERE w.user_id = ?`,
      [req.user.id]
    );
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const addToWishlist = async (req, res) => {
  const { product_id } = req.body;
  try {
    await pool.execute('INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?,?)', [req.user.id, product_id]);
    res.json({ success: true, message: 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    await pool.execute('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId]);
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ ORDER CONTROLLER ============
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
  const { amount, currency = 'INR' } = req.body;
  try {
    const options = { amount: Math.round(amount * 100), currency, receipt: `receipt_${Date.now()}` };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment initiation failed', error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart_items, shipping_address } = req.body;
  try {
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex');

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const total = cart_items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [orderResult] = await pool.execute(
      'INSERT INTO orders (user_id, total_price, status, payment_id, razorpay_order_id, payment_status, shipping_address) VALUES (?,?,?,?,?,?,?)',
      [req.user.id, total, 'confirmed', razorpay_payment_id, razorpay_order_id, 'paid', JSON.stringify(shipping_address)]
    );

    const orderId = orderResult.insertId;
    for (const item of cart_items) {
      await pool.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price, size, color) VALUES (?,?,?,?,?,?)',
        [orderId, item.product_id, item.quantity, item.price, item.size || null, item.color || null]
      );
    }

    // Clear cart
    const [cart] = await pool.execute('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    if (cart.length) await pool.execute('DELETE FROM cart_items WHERE cart_id = ?', [cart[0].id]);

    res.json({ success: true, message: 'Payment verified & order placed', order_id: orderId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const [items] = await pool.execute(
        `SELECT oi.*, p.name, p.image FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`,
        [order.id]
      );
      return { ...order, shipping_address: order.shipping_address ? JSON.parse(order.shipping_address) : null, items };
    }));

    res.json({ success: true, orders: ordersWithItems });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT o.*, u.name as user_name, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC`
    );
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ CATEGORY CONTROLLER ============
const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.execute('SELECT * FROM categories ORDER BY name');
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createCategory = async (req, res) => {
  const { name, slug, description, image } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO categories (name, slug, description, image) VALUES (?,?,?,?)',
      [name, slug, description || '', image || '']
    );
    res.status(201).json({ success: true, message: 'Category created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await pool.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ ADMIN STATS CONTROLLER ============
const getAdminStats = async (req, res) => {
  try {
    const [[{ total_users }]] = await pool.execute('SELECT COUNT(*) as total_users FROM users WHERE role = "user"');
    const [[{ total_products }]] = await pool.execute('SELECT COUNT(*) as total_products FROM products');
    const [[{ total_orders }]] = await pool.execute('SELECT COUNT(*) as total_orders FROM orders');
    const [[{ total_revenue }]] = await pool.execute('SELECT COALESCE(SUM(total_price), 0) as total_revenue FROM orders WHERE payment_status = "paid"');
    const [recent_orders] = await pool.execute(
      `SELECT o.id, o.total_price, o.status, o.created_at, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 5`
    );
    res.json({ success: true, stats: { total_users, total_products, total_orders, total_revenue, recent_orders } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getWishlist, addToWishlist, removeFromWishlist,
  createRazorpayOrder, verifyPayment, getOrders, getAllOrders, updateOrderStatus,
  getCategories, createCategory, deleteCategory,
  getAdminStats
};
