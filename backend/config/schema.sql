-- ============================================
-- LUXE WEAR DATABASE SCHEMA
-- ============================================

CREATE DATABASE IF NOT EXISTS luxe_wear_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE luxe_wear_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2) DEFAULT NULL,
  category_id INT NOT NULL,
  image VARCHAR(500) NOT NULL,
  images JSON DEFAULT NULL,
  sizes JSON DEFAULT NULL,
  colors JSON DEFAULT NULL,
  stock INT DEFAULT 100,
  rating DECIMAL(3, 2) DEFAULT 4.00,
  review_count INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_category (category_id),
  INDEX idx_featured (featured),
  INDEX idx_trending (trending)
);

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  size VARCHAR(20) DEFAULT NULL,
  color VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_product (cart_id, product_id, size, color)
);

-- Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wishlist (user_id, product_id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_id VARCHAR(255) DEFAULT NULL,
  razorpay_order_id VARCHAR(255) DEFAULT NULL,
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  shipping_address JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_status (status)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT DEFAULT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  size VARCHAR(20) DEFAULT NULL,
  color VARCHAR(50) DEFAULT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ============================================
-- SEED DATA
-- ============================================

-- Admin User (password: Admin@123)
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin User', 'admin@luxewear.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFSBToNQsQpMHli', 'admin'),
('John Doe', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFSBToNQsQpMHli', 'user');

-- Categories
INSERT IGNORE INTO categories (name, slug, description, image) VALUES
('Men', 'men', 'Premium menswear collection', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'),
('Women', 'women', 'Elegant womenswear collection', 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400'),
('Kids', 'kids', 'Stylish kids collection', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400'),
('Accessories', 'accessories', 'Premium fashion accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
('Footwear', 'footwear', 'Designer footwear collection', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
('Activewear', 'activewear', 'Performance activewear', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400');

-- Products - Men's Collection
INSERT INTO products (name, description, price, original_price, category_id, image, sizes, colors, rating, review_count, featured, trending) VALUES
('Obsidian Slim-Fit Blazer', 'A masterfully tailored slim-fit blazer in premium Italian wool. Features structured shoulders, a two-button closure, and a sleek obsidian finish that commands attention in any room.', 12999.00, 18999.00, 1, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600', '["S","M","L","XL","XXL"]', '["Black","Navy","Charcoal"]', 4.8, 234, TRUE, TRUE),
('Silk Essence Dress Shirt', 'Crafted from 100% premium Egyptian cotton with a silk-like finish. Features mother-of-pearl buttons and a French cuff design for an elevated formal look.', 4999.00, 7500.00, 1, 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600', '["S","M","L","XL"]', '["White","Light Blue","Black"]', 4.6, 189, FALSE, TRUE),
('Carbon Jogger Pants', 'Ultra-premium jogger pants with tapered fit and carbon-fiber texture fabric. Features elastic waistband, zip pockets, and moisture-wicking technology.', 3499.00, 5000.00, 1, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600', '["S","M","L","XL","XXL"]', '["Black","Grey","Olive"]', 4.5, 312, FALSE, TRUE),
('Luxe Linen Summer Shirt', 'Breathable linen shirt with a relaxed fit, perfect for summer occasions. Features coconut shell buttons and a subtle textured weave.', 3299.00, 4500.00, 1, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600', '["S","M","L","XL"]', '["White","Beige","Sky Blue","Sage"]', 4.4, 156, TRUE, FALSE),
('Midnight Denim Jacket', 'Premium raw denim jacket with a vintage-inspired wash. Features copper rivets, a classic collar, and a modern slim silhouette.', 5999.00, 8500.00, 1, 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600', '["S","M","L","XL","XXL"]', '["Dark Blue","Black","Light Blue"]', 4.7, 278, FALSE, TRUE),
('Merino Turtleneck Sweater', 'Fine Merino wool turtleneck with ribbed cuffs and hem. Exceptionally soft against skin with excellent temperature regulation properties.', 4499.00, 6500.00, 1, 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600', '["S","M","L","XL"]', '["Camel","Charcoal","Cream","Forest Green"]', 4.9, 421, TRUE, FALSE),
('Phantom Chino Trousers', 'Slim-fit chino trousers in stretch cotton. Features a flat front, angled pockets and a clean silhouette that transitions seamlessly from casual to smart-casual.', 2999.00, 4000.00, 1, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600', '["28","30","32","34","36","38"]', '["Khaki","Navy","Olive","Stone"]', 4.3, 198, FALSE, FALSE),
('Cashmere V-Neck Pullover', 'Pure Grade-A cashmere V-neck pullover. Incredibly soft, lightweight, and warm. A timeless wardrobe essential crafted to last for years.', 8999.00, 13000.00, 1, 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600', '["S","M","L","XL"]', '["Navy","Burgundy","Camel","Grey"]', 4.8, 567, TRUE, FALSE);

-- Products - Women's Collection
INSERT INTO products (name, description, price, original_price, category_id, image, sizes, colors, rating, review_count, featured, trending) VALUES
('Aurora Wrap Dress', 'An ethereal wrap dress in fluid satin with a deep V-neckline and adjustable waist tie. Features a stunning iridescent finish that shifts between rose gold and champagne tones.', 7999.00, 11000.00, 2, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600', '["XS","S","M","L","XL"]', '["Rose Gold","Champagne","Midnight Blue","Emerald"]', 4.9, 445, TRUE, TRUE),
('Structured Power Blazer', 'A sharp, structured blazer with padded shoulders and a cinched waist. Crafted in premium stretch crepe for all-day comfort without compromising the silhouette.', 9999.00, 14000.00, 2, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', '["XS","S","M","L","XL"]', '["Black","Ivory","Camel","Red"]', 4.7, 312, TRUE, FALSE),
('Silk Slip Maxi Dress', 'A luxurious silk-satin slip dress with adjustable spaghetti straps and a bias cut that flows beautifully. Features lace trim at the hem and neckline.', 6499.00, 9000.00, 2, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600', '["XS","S","M","L"]', '["Champagne","Blush","Black","Silver"]', 4.8, 523, FALSE, TRUE),
('High-Rise Flared Jeans', 'Premium stretch denim jeans with a high-rise waist and flattering flared leg. Features a vintage-inspired stonewash and gold-tone hardware.', 4999.00, 7000.00, 2, 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600', '["24","25","26","27","28","29","30"]', '["Light Blue","Dark Blue","Black"]', 4.5, 678, FALSE, TRUE),
('Cashmere Cardigan', 'A cozy yet chic cashmere cardigan with pearl buttons and ribbed trim. Perfectly oversized for a relaxed, luxurious look when paired with high-waisted bottoms.', 6999.00, 10000.00, 2, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600', '["XS","S","M","L","XL"]', '["Ivory","Dusty Rose","Sage","Caramel"]', 4.6, 289, TRUE, FALSE),
('Corset Bralette Top', 'A fashion-forward corset bralette in premium brocade fabric. Features boning, lace-up back, and hook-and-eye closure for a perfectly sculpted silhouette.', 3499.00, 5000.00, 2, 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=600', '["XS","S","M","L"]', '["Black","Ivory","Burgundy","Gold"]', 4.4, 341, FALSE, TRUE),
('Pleated Midi Skirt', 'An elegant pleated midi skirt in lightweight chiffon. Features a high-rise elastic waistband and a 360-degree pleated design that creates beautiful movement.', 3999.00, 5500.00, 2, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600', '["XS","S","M","L","XL"]', '["Dusty Pink","Navy","Sage","Black","Camel"]', 4.7, 412, TRUE, TRUE),
('Oversized Graphic Tee', 'Premium heavyweight cotton oversized tee with artistic graphic prints. Features dropped shoulders and a relaxed silhouette that pairs perfectly with everything.', 1999.00, 2800.00, 2, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600', '["XS","S","M","L","XL","XXL"]', '["White","Black","Grey","Cream"]', 4.3, 892, FALSE, TRUE);

-- Products - Kids Collection
INSERT INTO products (name, description, price, original_price, category_id, image, sizes, colors, rating, review_count, featured, trending) VALUES
('Rainbow Dinosaur Hoodie', 'A super soft fleece hoodie featuring a fun embroidered dinosaur design with rainbow accents. Made from 80% organic cotton and 20% recycled polyester.', 1999.00, 2800.00, 3, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600', '["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"]', '["Blue","Pink","Green","Purple"]', 4.8, 324, TRUE, FALSE),
('Adventure Cargo Pants', 'Durable cargo pants with multiple pockets, reinforced knees, and an adjustable waistband. Perfect for outdoor adventures and everyday play.', 1499.00, 2200.00, 3, 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600', '["3-4Y","5-6Y","7-8Y","9-10Y","11-12Y"]', '["Khaki","Grey","Navy","Olive"]', 4.6, 256, FALSE, TRUE),
('Princess Tutu Dress', 'A magical tutu dress with layers of tulle and delicate floral embroidery. Features a comfortable cotton lining and adjustable back bow.', 2499.00, 3500.00, 3, 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600', '["2-3Y","4-5Y","6-7Y","8-9Y"]', '["Pink","Lilac","White","Peach"]', 4.9, 445, TRUE, TRUE),
('Space Explorer T-Shirt', 'A fun glow-in-the-dark space-themed t-shirt made from breathable organic cotton. Features cosmic graphics that glow softly in the dark.', 999.00, 1500.00, 3, 'https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=600', '["3-4Y","5-6Y","7-8Y","9-10Y","11-12Y"]', '["Navy","Black","Grey"]', 4.7, 567, FALSE, TRUE),
('Cozy Winter Parka', 'A warm and waterproof parka with faux fur trim hood and reflective safety strips. Features a cozy fleece lining and multiple secure pockets.', 3999.00, 5500.00, 3, 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600', '["3-4Y","5-6Y","7-8Y","9-10Y","11-12Y","12-13Y"]', '["Red","Navy","Pink","Yellow"]', 4.8, 289, TRUE, FALSE);

-- Products - Accessories
INSERT INTO products (name, description, price, original_price, category_id, image, sizes, colors, rating, review_count, featured, trending) VALUES
('Obsidian Leather Belt', 'Full-grain Italian leather belt with a sleek gunmetal buckle. Handcrafted with precision stitching and beveled edges for a refined finishing touch.', 2999.00, 4500.00, 4, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600', '["S","M","L","XL"]', '["Black","Tan","Brown"]', 4.7, 234, FALSE, FALSE),
('Silk Scarf Collection', 'Hand-printed silk scarf featuring exclusive artistic designs. Made from 100% pure mulberry silk with hand-rolled edges.', 3499.00, 5000.00, 4, 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600', '["One Size"]', '["Floral","Abstract","Geometric","Marble"]', 4.8, 312, TRUE, TRUE),
('Minimalist Canvas Tote', 'A versatile and sustainable canvas tote bag with reinforced handles and interior pockets. Features a water-resistant coating and magnetic snap closure.', 1999.00, 3000.00, 4, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', '["One Size"]', '["Cream","Black","Forest Green","Dusty Pink"]', 4.5, 456, FALSE, TRUE),
('Premium Leather Wallet', 'A slim bifold wallet crafted from full-grain leather with RFID blocking technology. Features multiple card slots and a cash compartment.', 3999.00, 5500.00, 4, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600', '["One Size"]', '["Black","Tan","Navy","Burgundy"]', 4.9, 678, TRUE, FALSE),
('Aviator Sunglasses', 'Classic aviator sunglasses with polarized lenses and a lightweight titanium frame. Offers 100% UV protection with a premium anti-reflective coating.', 4999.00, 7000.00, 4, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', '["One Size"]', '["Gold/Brown","Silver/Grey","Black/Black"]', 4.6, 523, FALSE, TRUE);

-- Products - Footwear
INSERT INTO products (name, description, price, original_price, category_id, image, sizes, colors, rating, review_count, featured, trending) VALUES
('Eclipse Leather Sneakers', 'Premium full-grain leather low-top sneakers with a cushioned insole and vulcanized rubber sole. A modern take on a classic silhouette with a refined aesthetic.', 8999.00, 12000.00, 5, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', '["6","7","8","9","10","11","12"]', '["White","Black","Grey","Tan"]', 4.8, 892, TRUE, TRUE),
('Chelsea Boots Elite', 'Handcrafted Chelsea boots in full-grain calfskin leather with elastic side panels and a block heel. Features a leather insole and non-slip rubber outsole.', 11999.00, 16000.00, 5, 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600', '["6","7","8","9","10","11"]', '["Black","Tan","Brown","Cognac"]', 4.9, 445, TRUE, FALSE),
('Strappy Sandals Luxe', 'Elegant strappy sandals with a sculpted block heel and genuine leather upper. Features an adjustable ankle strap and cushioned footbed for all-day comfort.', 5999.00, 8500.00, 5, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600', '["5","6","7","8","9","10"]', '["Nude","Black","Gold","Silver","Red"]', 4.6, 312, FALSE, TRUE),
('Running Performance Pro', 'Advanced running shoes with carbon-fiber plate technology and responsive foam midsole. Features an engineered mesh upper and dynamic support system.', 9999.00, 14000.00, 5, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', '["6","7","8","9","10","11","12"]', '["Black/Red","White/Blue","Grey/Orange"]', 4.7, 678, FALSE, TRUE),
('Loafer Signature', 'Hand-stitched penny loafers in supple calf leather with a leather-wrapped heel and leather insole. A wardrobe cornerstone that elevates any outfit.', 7999.00, 11000.00, 5, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600', '["6","7","8","9","10","11"]', '["Black","Brown","Burgundy","Navy"]', 4.8, 523, TRUE, FALSE);

-- Products - Activewear
INSERT INTO products (name, description, price, original_price, category_id, image, sizes, colors, rating, review_count, featured, trending) VALUES
('Pro-Fit Training Set', 'A matching training set featuring a compression top and high-waisted leggings. Made from 4-way stretch fabric with moisture-wicking and quick-dry technology.', 4999.00, 7000.00, 6, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600', '["XS","S","M","L","XL"]', '["Black","Navy","Grey","Teal"]', 4.8, 567, TRUE, TRUE),
('Ultra-Light Windbreaker', 'A packable, water-resistant windbreaker with taped seams and an adjustable hood. Packs into its own pocket for easy storage during workouts.', 3999.00, 5500.00, 6, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', '["S","M","L","XL","XXL"]', '["Black","Navy","Yellow","Red"]', 4.6, 389, FALSE, TRUE),
('Performance Sports Bra', 'A high-impact sports bra with underwire support and moisture-wicking fabric. Features a racerback design and adjustable straps for customizable fit.', 2499.00, 3500.00, 6, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600', '["XS","S","M","L","XL"]', '["Black","White","Coral","Teal","Purple"]', 4.7, 734, TRUE, FALSE),
('Flex Jogger Premium', 'Tapered jogger pants with a 4-way stretch fabric for maximum mobility. Features deep pockets, an elastic waistband with drawstring, and zippered ankles.', 3499.00, 5000.00, 6, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600', '["XS","S","M","L","XL","XXL"]', '["Black","Charcoal","Navy","Forest Green"]', 4.5, 456, FALSE, TRUE),
('Yoga Flow Leggings', 'Ultra-soft yoga leggings with a buttery-smooth feel and four-way stretch. Features a high-waist design, hidden pocket, and seamless construction for comfort.', 2999.00, 4200.00, 6, 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600', '["XS","S","M","L","XL"]', '["Black","Mauve","Sage","Navy","Burgundy"]', 4.9, 1023, TRUE, TRUE);

-- ============================================
-- USEFUL VIEWS
-- ============================================

CREATE OR REPLACE VIEW product_details AS
SELECT 
  p.*,
  c.name AS category_name,
  c.slug AS category_slug
FROM products p
JOIN categories c ON p.category_id = c.id;

CREATE OR REPLACE VIEW order_details AS
SELECT 
  o.*,
  u.name AS user_name,
  u.email AS user_email
FROM orders o
JOIN users u ON o.user_id = u.id;
