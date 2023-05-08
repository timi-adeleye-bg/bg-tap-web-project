/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS Operator (
  id SERIAL PRIMARY KEY,
  operator_id VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255) NOT NULL,
  nationality VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  lga VARCHAR(255) NOT NULL,
  sex VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  nin VARCHAR(255) NOT NULL UNIQUE,
  user_id INTEGER REFERENCES users(user_id) UNIQUE,
  is_verified BOOLEAN DEFAULT true,
  user_picture VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
