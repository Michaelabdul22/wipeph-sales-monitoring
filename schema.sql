CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'staff')),
  email VARCHAR(255) NOT NULL UNIQUE,
  otp_code VARCHAR(6),
  otp_expiry TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS services_category (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS service_types (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES services_category(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS addons (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES services_category(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(20) PRIMARY KEY,
  transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  customer_name VARCHAR(255) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method VARCHAR(30) NOT NULL DEFAULT 'Cash',
  status VARCHAR(50) NOT NULL,
  inputted_by VARCHAR(100) DEFAULT 'System',
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  vat_percentage NUMERIC(5,2) NOT NULL DEFAULT 12
);

CREATE TABLE IF NOT EXISTS transaction_items (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(20) NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  service_type_id INTEGER NOT NULL REFERENCES service_types(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS transaction_addons (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(20) NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  addon_id INTEGER NOT NULL REFERENCES addons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transaction_status_history (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(20) NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  old_status VARCHAR(50) NOT NULL,
  new_status VARCHAR(50) NOT NULL,
  old_amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0,
  new_amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0,
  changed_by VARCHAR(100) NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  total_sales NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_transactions INTEGER NOT NULL DEFAULT 0,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO users (username, password, role, email, status)
VALUES
  ('admin', '$2a$10$LqPmvIuc1tKFxvf2aanf/.1W7IyzpgsETCnyKl8NMJfNy18JZnHHi', 'admin', 'admin@wipeph.local', 'active'),
  ('staff', '$2a$10$LqPmvIuc1tKFxvf2aanf/.1W7IyzpgsETCnyKl8NMJfNy18JZnHHi', 'staff', 'staff@wipeph.local', 'active')
ON CONFLICT (username) DO NOTHING;

INSERT INTO services_category (id, name) VALUES
  (1, 'BAG CLEANING'),
  (2, 'GOLF GEAR CLEANING'),
  (3, 'GOLF SPIKE REPLACEMENT'),
  (4, 'BUNDLE GOLF BAG & CLUBS'),
  (5, 'SHOE CLEANING'),
  (14, 'CAP CLEANING'),
  (15, 'HELMET CLEANING')
ON CONFLICT (id) DO NOTHING;

INSERT INTO service_types (id, category_id, name, price) VALUES
  (1, 1, 'Small', 1500.00),
  (2, 1, 'Medium', 2000.00),
  (3, 1, 'Large', 2000.00),
  (4, 1, 'Extra Large', 2000.00),
  (5, 2, 'Anti Rust', 200.00),
  (6, 2, 'Sanding', 400.00),
  (7, 2, 'Regrooving', 400.00),
  (8, 3, 'Own Spike', 399.00),
  (9, 3, 'Spike Replacement', 400.00),
  (10, 3, 'Package Price', 1198.00),
  (11, 4, 'Small', 1500.00),
  (12, 4, 'Medium', 2000.00),
  (13, 4, 'Large', 2000.00),
  (14, 4, 'Extra Large', 2000.00),
  (15, 5, 'Basic', 499.00),
  (16, 5, 'Regular', 699.00),
  (17, 5, 'Premium', 999.00),
  (22, 14, 'Basic', 499.00),
  (23, 15, 'Basic', 299.00),
  (24, 15, 'Regular', 499.00),
  (25, 15, 'Premium', 999.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO addons (id, category_id, name, price) VALUES
  (3, 5, 'unyellowing', 900.00),
  (17, 5, 'Water Repellant', 300.00),
  (18, 5, 'Sole Repaint', 1500.00),
  (19, 5, 'Wipe Shoe Lace', 300.00),
  (20, 5, 'Touch-up Repaint', 500.00),
  (21, 5, 'Wipe Insole', 200.00),
  (22, 5, 'Shoe Tree', 200.00)
ON CONFLICT (id) DO NOTHING;

SELECT setval('services_category_id_seq', GREATEST((SELECT MAX(id) FROM services_category), 1));
SELECT setval('service_types_id_seq', GREATEST((SELECT MAX(id) FROM service_types), 1));
SELECT setval('addons_id_seq', GREATEST((SELECT MAX(id) FROM addons), 1));
