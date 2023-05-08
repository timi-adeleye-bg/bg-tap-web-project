/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS Selection (
  id SERIAL PRIMARY KEY,
  operator_id VARCHAR(255) NOT NULL REFERENCES operator(operator_id),
  product_id INTEGER NOT NULL REFERENCES products(product_id),
  seed_id INTEGER NOT NULL REFERENCES seed(seed_id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);