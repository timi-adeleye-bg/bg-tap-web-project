/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS test_results (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL UNIQUE REFERENCES session(session_id) ON DELETE CASCADE,
  question_ids INTEGER[] NOT NULL,
  answers VARCHAR[] NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


