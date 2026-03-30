const { pool } = require('../config/db');

// @desc    Get cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    const [cart] = await pool.execute('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    if (!cart.length) {
      await pool.execute('INSERT INTO cart (user_id) VALUES (?)', [req.user.id]);
      return res.json({ success: true, items: [], total: 0 });
    }

    const [items] = await pool.execute(
      `SELECT ci.id, ci.quantity, ci.size, ci.color, p.id as product_id, p.name, p.price, p.image, p.stock
       FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = ?`,
      [cart[0].id]
    );

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ success: true, items, total });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Add to cart
// @route   POST /api/cart
const addToCart = async (req, res) => {
  const { product_id, quantity = 1, size, color } = req.body;
  try {
    let [cart] = await pool.execute('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    if (!cart.length) {
      const [result] = await pool.execute('INSERT INTO cart (user_id) VALUES (?)', [req.user.id]);
      cart = [{ id: result.insertId }];
    }

    const [existing] = await pool.execute(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ? AND size <=> ? AND color <=> ?',
      [cart[0].id, product_id, size || null, color || null]
    );

    if (existing.length) {
      await pool.execute('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?', [quantity, existing[0].id]);
    } else {
      await pool.execute(
        'INSERT INTO cart_items (cart_id, product_id, quantity, size, color) VALUES (?,?,?,?,?)',
        [cart[0].id, product_id, quantity, size || null, color || null]
      );
    }

    res.json({ success: true, message: 'Added to cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/:itemId
const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  try {
    if (quantity <= 0) {
      await pool.execute('DELETE FROM cart_items WHERE id = ?', [req.params.itemId]);
      return res.json({ success: true, message: 'Item removed from cart' });
    }
    await pool.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, req.params.itemId]);
    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Remove from cart
// @route   DELETE /api/cart/:itemId
const removeFromCart = async (req, res) => {
  try {
    await pool.execute('DELETE FROM cart_items WHERE id = ?', [req.params.itemId]);
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    const [cart] = await pool.execute('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    if (cart.length) await pool.execute('DELETE FROM cart_items WHERE cart_id = ?', [cart[0].id]);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
