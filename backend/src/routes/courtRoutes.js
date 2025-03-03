const express = require('express');
const router = express.Router();
const {
  getAllCourts,
  getCourtById,
  createCourt,
  updateCourt,
  deleteCourt,
} = require('../controllers/courtController');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all courts
router.get('/', protect, getAllCourts);

// Get a court by ID
router.get('/:id', protect, getCourtById);

// Create a new court (admin only)
router.post('/', protect, admin, createCourt);

// Update a court (admin only)
router.put('/:id', protect, admin, updateCourt);

// Delete a court (admin only)
router.delete('/:id', protect, admin, deleteCourt);

module.exports = router;