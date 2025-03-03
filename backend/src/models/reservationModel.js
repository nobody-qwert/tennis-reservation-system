const db = require('../config/db');

const createReservation = async (userId, courtId, startTime, endTime) => {
  const { rows } = await db.query(
    'INSERT INTO reservations (user_id, court_id, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, courtId, startTime, endTime]
  );
  return rows[0];
};

const getReservationById = async (id) => {
  const { rows } = await db.query('SELECT * FROM reservations WHERE id = $1', [id]);
  return rows[0];
};

const getUserReservations = async (userId) => {
  const { rows } = await db.query(
    `SELECT r.*, c.name as court_name 
     FROM reservations r 
     JOIN courts c ON r.court_id = c.id 
     WHERE r.user_id = $1 
     ORDER BY r.start_time`,
    [userId]
  );
  return rows;
};

const getAllReservations = async () => {
  const { rows } = await db.query(
    `SELECT r.*, c.name as court_name, u.username 
     FROM reservations r 
     JOIN courts c ON r.court_id = c.id 
     JOIN users u ON r.user_id = u.id 
     ORDER BY r.start_time`
  );
  return rows;
};

const cancelReservation = async (id) => {
  const { rows } = await db.query(
    'DELETE FROM reservations WHERE id = $1 RETURNING *',
    [id]
  );
  return rows[0];
};

const checkAvailability = async (courtId, startTime, endTime) => {
  const { rows } = await db.query(
    `SELECT * FROM reservations 
     WHERE court_id = $1 
     AND ((start_time <= $2 AND end_time > $2) 
          OR (start_time < $3 AND end_time >= $3)
          OR (start_time >= $2 AND end_time <= $3))`,
    [courtId, startTime, endTime]
  );
  return rows.length === 0;
};

const getAvailableCourts = async (startTime, endTime) => {
  const { rows } = await db.query(
    `SELECT c.* FROM courts c 
     WHERE NOT EXISTS (
       SELECT 1 FROM reservations r 
       WHERE r.court_id = c.id 
       AND ((r.start_time <= $1 AND r.end_time > $1) 
            OR (r.start_time < $2 AND r.end_time >= $2)
            OR (r.start_time >= $1 AND r.end_time <= $2))
     )`,
    [startTime, endTime]
  );
  return rows;
};

module.exports = {
  createReservation,
  getReservationById,
  getUserReservations,
  getAllReservations,
  cancelReservation,
  checkAvailability,
  getAvailableCourts,
};