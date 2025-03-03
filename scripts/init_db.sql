-- Drop tables if they exist
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS courts;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courts table
CREATE TABLE courts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  surface VARCHAR(50) NOT NULL,
  is_indoor BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations table
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  court_id INTEGER REFERENCES courts(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_reservations_court_time ON reservations(court_id, start_time, end_time);
CREATE INDEX idx_reservations_user ON reservations(user_id);

-- Insert some sample courts
INSERT INTO courts (name, surface, is_indoor) VALUES
('Court 1', 'Hard', FALSE),
('Court 2', 'Clay', FALSE),
('Court 3', 'Hard', TRUE),
('Court 4', 'Grass', FALSE),
('Court 5', 'Hard', TRUE);

-- Create admin user (password: admin123)
-- Using a different hash format that should work more reliably
INSERT INTO users (username, email, password, is_admin) VALUES
('admin', 'admin@tennis.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE),
('test', 'test@tennis.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', FALSE);