const Reservation = require('../models/reservationModel');
const Court = require('../models/courtModel');

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
  try {
    const { courtId, startTime, endTime } = req.body;
    const userId = req.user.id;

    // Check if all required fields are provided
    if (!courtId || !startTime || !endTime) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate that the time slot is 1 hour
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInHours = (end - start) / (1000 * 60 * 60);

    if (diffInHours !== 1) {
      return res.status(400).json({ message: 'Reservation must be exactly 1 hour' });
    }

    // Check if the court exists
    const court = await Court.getCourtById(courtId);
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    // Check if the court is available at the requested time
    const isAvailable = await Reservation.checkAvailability(courtId, startTime, endTime);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Court is not available at the requested time' });
    }

    // Create the reservation
    const reservation = await Reservation.createReservation(userId, courtId, startTime, endTime);

    res.status(201).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user reservations
// @route   GET /api/reservations
// @access  Private
const getUserReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const reservations = await Reservation.getUserReservations(userId);
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all reservations
// @route   GET /api/reservations/all
// @access  Private/Admin
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.getAllReservations();
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel a reservation
// @route   DELETE /api/reservations/:id
// @access  Private
const cancelReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    
    // Check if the reservation exists
    const reservation = await Reservation.getReservationById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if the user is authorized to cancel this reservation
    // Allow cancellation if the user is the owner or an admin
    if (reservation.user_id !== req.user.id && !req.user.is_admin) {
      return res.status(401).json({ message: 'Not authorized to cancel this reservation' });
    }

    // Delete the reservation
    const cancelledReservation = await Reservation.cancelReservation(reservationId);
    res.json({ message: 'Reservation cancelled successfully', reservation: cancelledReservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get available courts for a specific time
// @route   GET /api/reservations/available
// @access  Private
const getAvailableCourts = async (req, res) => {
  try {
    const { startTime, endTime } = req.query;
    
    if (!startTime || !endTime) {
      return res.status(400).json({ message: 'Please provide start and end times' });
    }

    const courts = await Reservation.getAvailableCourts(startTime, endTime);
    res.json(courts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createReservation,
  getUserReservations,
  getAllReservations,
  cancelReservation,
  getAvailableCourts,
};