const db = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async (username, email, password, isAdmin = false) => {
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const { rows } = await db.query(
    'INSERT INTO users (username, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING id, username, email, is_admin',
    [username, email, hashedPassword, isAdmin]
  );

  return rows[0];
};

const getUserByUsername = async (username) => {
  const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [
    username,
  ]);
  return rows[0];
};

const getUserByEmail = async (email) => {
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);
  return rows[0];
};

const getUserById = async (id) => {
  const { rows } = await db.query(
    'SELECT id, username, email, is_admin FROM users WHERE id = $1',
    [id]
  );
  return rows[0];
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserByEmail,
  getUserById,
};