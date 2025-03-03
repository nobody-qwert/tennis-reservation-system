const Court = require('../models/courtModel');

// @desc    Get all courts
// @route   GET /api/courts
// @access  Private
const getAllCourts = async (req, res) => {
  try {
    const courts = await Court.getAllCourts();
    res.json(courts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a court by ID
// @route   GET /api/courts/:id
// @access  Private
const getCourtById = async (req, res) => {
  try {
    const court = await Court.getCourtById(req.params.id);
    
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }
    
    res.json(court);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new court
// @route   POST /api/courts
// @access  Private/Admin
const createCourt = async (req, res) => {
  try {
    const { name, surface, isIndoor } = req.body;
    
    if (!name || !surface) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const court = await Court.createCourt(name, surface, isIndoor || false);
    res.status(201).json(court);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a court
// @route   PUT /api/courts/:id
// @access  Private/Admin
const updateCourt = async (req, res) => {
  try {
    const { name, surface, isIndoor } = req.body;
    const courtId = req.params.id;
    
    // Check if the court exists
    const court = await Court.getCourtById(courtId);
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }
    
    // Update the court
    const updatedCourt = await Court.updateCourt(
      courtId,
      name || court.name,
      surface || court.surface,
      isIndoor !== undefined ? isIndoor : court.is_indoor
    );
    
    res.json(updatedCourt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a court
// @route   DELETE /api/courts/:id
// @access  Private/Admin
const deleteCourt = async (req, res) => {
  try {
    const courtId = req.params.id;
    
    // Check if the court exists
    const court = await Court.getCourtById(courtId);
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }
    
    // Delete the court
    const deletedCourt = await Court.deleteCourt(courtId);
    res.json({ message: 'Court deleted successfully', court: deletedCourt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllCourts,
  getCourtById,
  createCourt,
  updateCourt,
  deleteCourt,
};