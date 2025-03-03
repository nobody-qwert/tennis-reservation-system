const express = require('express');
const router = express.Router();
const {
  createReservation,
  getUserReservations,
  getAllReservations,
  cancelReservation,
  getAvailableCourts,
} = require('../controllers/reservationController');
const { protect, admin } = require('../middleware/authMiddleware');

// Create a new reservation
router.post('/', protect, createReservation);

// Get user reservations
router.get('/', protect, getUserReservations);

// Get all reservations (admin only)
router.get('/all', protect, admin, getAllReservations);

// Get available courts for a specific time
router.get('/available', protect, getAvailableCourts);

// Cancel a reservation
router.delete('/:id', protect, cancelReservation);

module.exports = router;