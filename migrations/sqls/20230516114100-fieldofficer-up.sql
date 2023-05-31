/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS field_officer (
  officer_id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(100) NOT NULL,
  sex VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  bvn VARCHAR(100) NOT NULL UNIQUE,
  nin VARCHAR(100) NOT NULL UNIQUE,
  state VARCHAR(255) NOT NULL,
  lga VARCHAR(255) NOT NULL,
  hub VARCHAR(255) NOT NULL,
  government_id VARCHAR(100) NOT NULL,
  government_id_type VARCHAR(100) NOT NULL,
  operator_id VARCHAR(255) NOT NULL REFERENCES operator(operator_id) ON DELETE CASCADE,
  government_id_card VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);