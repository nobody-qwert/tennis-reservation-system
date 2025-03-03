const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const courtRoutes = require('./routes/courtRoutes');
const User = require('./models/userModel');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure admin user exists
const ensureAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.getUserByUsername('admin');
    
    if (!adminExists) {
      console.log('Creating default admin user...');
      // Create admin user with password 'admin123'
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.createUser('admin', 'admin@tennis.com', hashedPassword, true);
      console.log('Default admin user created: admin/admin123');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error ensuring admin exists:', error);
  }
};

// Routes
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/courts', courtRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Tennis Court Reservation API is running');
});

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Ensure admin user exists on startup
  await ensureAdmin();
});