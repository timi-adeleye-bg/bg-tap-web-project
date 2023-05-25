/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS Session (
  session_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  operator_id VARCHAR(255) NOT NULL REFERENCES operator(operator_id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);