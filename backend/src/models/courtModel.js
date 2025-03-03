const db = require('../config/db');

const getAllCourts = async () => {
  const { rows } = await db.query('SELECT * FROM courts ORDER BY id');
  return rows;
};

const getCourtById = async (id) => {
  const { rows } = await db.query('SELECT * FROM courts WHERE id = $1', [id]);
  return rows[0];
};

const createCourt = async (name, surface, isIndoor) => {
  const { rows } = await db.query(
    'INSERT INTO courts (name, surface, is_indoor) VALUES ($1, $2, $3) RETURNING *',
    [name, surface, isIndoor]
  );
  return rows[0];
};

const updateCourt = async (id, name, surface, isIndoor) => {
  const { rows } = await db.query(
    'UPDATE courts SET name = $2, surface = $3, is_indoor = $4 WHERE id = $1 RETURNING *',
    [id, name, surface, isIndoor]
  );
  return rows[0];
};

const deleteCourt = async (id) => {
  const { rows } = await db.query(
    'DELETE FROM courts WHERE id = $1 RETURNING *',
    [id]
  );
  return rows[0];
};

module.exports = {
  getAllCourts,
  getCourtById,
  createCourt,
  updateCourt,
  deleteCourt,
};