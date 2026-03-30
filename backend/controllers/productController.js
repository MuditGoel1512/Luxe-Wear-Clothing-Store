const { pool } = require('../config/db');

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, featured, trending, search, page = 1, limit = 12, sort = 'created_at', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;
    const allowedSorts = ['price', 'rating', 'created_at', 'name'];
    const sortField = allowedSorts.includes(sort) ? sort : 'created_at';
    const orderDir = order === 'ASC' ? 'ASC' : 'DESC';

    // Build WHERE conditions array
    let whereConditions = [];
    let params = [];

    if (category) { 
      whereConditions.push('c.slug = ?'); 
      params.push(category); 
    }
    if (featured === 'true') { 
      whereConditions.push('p.featured = 1'); 
    }
    if (trending === 'true') { 
      whereConditions.push('p.trending = 1'); 
    }
    if (search) { 
      whereConditions.push('(p.name LIKE ? OR p.description LIKE ?)'); 
      params.push(`%${search}%`, `%${search}%`); 
    }

    // Build WHERE clause
    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Count query
    const countQuery = `SELECT COUNT(*) as total FROM products p JOIN categories c ON p.category_id = c.id ${whereClause}`;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Get products - use LIMIT and OFFSET as separate numbers, not in the params array
    const offset_val = Number(offset);
    const limit_val = Number(limit);
    const selectQuery = `SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id ${whereClause} ORDER BY p.${sortField} ${orderDir} LIMIT ${limit_val} OFFSET ${offset_val}`;
    const [products] = await pool.execute(selectQuery, params);

    // Parse JSON fields
    const parsed = products.map(p => {
      let sizes = [];
      let colors = [];
      let images = [];
      
      // Handle sizes
      if (Array.isArray(p.sizes)) {
        sizes = p.sizes;
      } else if (typeof p.sizes === 'string' && p.sizes) {
        try {
          sizes = JSON.parse(p.sizes);
        } catch {
          sizes = p.sizes.split(',').map(s => s.trim());
        }
      }
      
      // Handle colors
      if (Array.isArray(p.colors)) {
        colors = p.colors;
      } else if (typeof p.colors === 'string' && p.colors) {
        try {
          colors = JSON.parse(p.colors);
        } catch {
          colors = p.colors.split(',').map(c => c.trim());
        }
      }
      
      // Handle images
      if (Array.isArray(p.images)) {
        images = p.images;
      } else if (typeof p.images === 'string' && p.images) {
        try {
          images = JSON.parse(p.images);
        } catch {
          images = p.images.split(',').map(i => i.trim());
        }
      }
      
      return {
        ...p,
        sizes,
        colors,
        images,
      };
    });

    res.json({ success: true, products: parsed, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const [products] = await pool.execute(
      'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [req.params.id]
    );
    if (!products.length) return res.status(404).json({ success: false, message: 'Product not found' });

    const p = products[0];
    let sizes = [];
    let colors = [];
    let images = [];
    
    // Handle sizes
    if (Array.isArray(p.sizes)) {
      sizes = p.sizes;
    } else if (typeof p.sizes === 'string' && p.sizes) {
      try {
        sizes = JSON.parse(p.sizes);
      } catch {
        sizes = p.sizes.split(',').map(s => s.trim());
      }
    }
    
    // Handle colors
    if (Array.isArray(p.colors)) {
      colors = p.colors;
    } else if (typeof p.colors === 'string' && p.colors) {
      try {
        colors = JSON.parse(p.colors);
      } catch {
        colors = p.colors.split(',').map(c => c.trim());
      }
    }
    
    // Handle images
    if (Array.isArray(p.images)) {
      images = p.images;
    } else if (typeof p.images === 'string' && p.images) {
      try {
        images = JSON.parse(p.images);
      } catch {
        images = p.images.split(',').map(i => i.trim());
      }
    }
    
    res.json({
      success: true,
      product: {
        ...p,
        sizes,
        colors,
        images,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create product (admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, original_price, category_id, image, sizes, colors, stock, featured, trending } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO products (name, description, price, original_price, category_id, image, sizes, colors, stock, featured, trending) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [name, description, price, original_price || null, category_id, image,
       JSON.stringify(sizes || []), JSON.stringify(colors || []), stock || 100,
       featured ? 1 : 0, trending ? 1 : 0]
    );
    const [newProduct] = await pool.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Product created', product: newProduct[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update product (admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, original_price, category_id, image, sizes, colors, stock, featured, trending } = req.body;
    await pool.execute(
      'UPDATE products SET name=?, description=?, price=?, original_price=?, category_id=?, image=?, sizes=?, colors=?, stock=?, featured=?, trending=? WHERE id=?',
      [name, description, price, original_price || null, category_id, image,
       JSON.stringify(sizes || []), JSON.stringify(colors || []), stock || 100,
       featured ? 1 : 0, trending ? 1 : 0, req.params.id]
    );
    res.json({ success: true, message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
const getFeaturedProducts = async (req, res) => {
  try {
    const [products] = await pool.execute(
      'SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.featured = 1 LIMIT 8',
      []
    );
    const parsed = products.map(p => {
      let sizes = [];
      let colors = [];
      
      // Handle sizes
      if (Array.isArray(p.sizes)) {
        sizes = p.sizes;
      } else if (typeof p.sizes === 'string' && p.sizes) {
        try {
          sizes = JSON.parse(p.sizes);
        } catch {
          sizes = p.sizes.split(',').map(s => s.trim());
        }
      }
      
      // Handle colors
      if (Array.isArray(p.colors)) {
        colors = p.colors;
      } else if (typeof p.colors === 'string' && p.colors) {
        try {
          colors = JSON.parse(p.colors);
        } catch {
          colors = p.colors.split(',').map(c => c.trim());
        }
      }
      
      return {
        ...p,
        sizes,
        colors,
      };
    });
    res.json({ success: true, products: parsed });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getFeaturedProducts };
