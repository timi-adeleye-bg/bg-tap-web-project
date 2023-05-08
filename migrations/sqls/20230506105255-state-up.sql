/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS State (
  state_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  country_id INTEGER NOT NULL REFERENCES nationality(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);