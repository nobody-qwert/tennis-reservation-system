const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Database connection details for Docker container
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',  // Use localhost if containers are network-exposed, otherwise container name
  database: 'tennis_reservation',
  password: 'postgres',
  port: 5432, // This should be the exposed port, check docker-compose.yml
});

async function createAdminUser() {
  try {
    // Create the admin password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Check if admin user already exists
    const checkQuery = 'SELECT * FROM users WHERE username = $1';
    const checkResult = await pool.query(checkQuery, ['admin']);
    
    if (checkResult.rows.length > 0) {
      console.log('Admin user already exists.');
      
      // Update the admin password
      const updateQuery = 'UPDATE users SET password = $1, is_admin = TRUE WHERE username = $2';
      await pool.query(updateQuery, [hashedPassword, 'admin']);
      console.log('Admin password has been updated.');
    } else {
      // Create a new admin user
      const insertQuery = 'INSERT INTO users (username, email, password, is_admin) VALUES ($1, $2, $3, $4)';
      await pool.query(insertQuery, ['admin', 'admin@tennis.com', hashedPassword, true]);
      console.log('Admin user created successfully.');
    }
    
    console.log('Login credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    pool.end();
  }
}

createAdminUser();