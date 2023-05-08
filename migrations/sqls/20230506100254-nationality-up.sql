/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS Nationality (
  id SERIAL PRIMARY KEY,
  country VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
