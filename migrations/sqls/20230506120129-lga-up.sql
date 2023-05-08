/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS LGA (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  state_id INTEGER NOT NULL REFERENCES state(state_id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);