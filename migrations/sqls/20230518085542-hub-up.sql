/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS Hub (
  hub_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  state_id INTEGER NOT NULL REFERENCES state(state_id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);