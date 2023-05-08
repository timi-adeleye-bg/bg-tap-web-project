/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS Seed (
  seed_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  product_id INTEGER NOT NULL REFERENCES products(product_id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);