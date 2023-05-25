/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS Questions (
  id SERIAL PRIMARY KEY,
  question TEXT,
  category VARCHAR(255) NOT NULL,
  answer VARCHAR(255) NOT NULL,
  options VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
