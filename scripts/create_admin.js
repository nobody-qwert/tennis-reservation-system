const bcrypt = require('bcrypt');

async function generatePasswordHash() {
  // Generate a salt
  const salt = await bcrypt.genSalt(10);
  
  // Hash the password
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, salt);
  
  console.log(`
  -- Run this SQL to create a new admin user:
  INSERT INTO users (username, email, password, is_admin) VALUES
  ('admin2', 'admin2@tennis.com', '${hashedPassword}', TRUE);
  
  -- Admin credentials:
  -- Username: admin2
  -- Password: admin123
  `);
}

generatePasswordHash();