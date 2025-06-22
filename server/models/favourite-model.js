const pool = require('../db'); 

const checkFavourite = async (userId, topicId) => {
  const res = await pool.query(
    `SELECT * FROM favourites WHERE user_id = $1 AND topic_id = $2`,
    [userId, topicId]
  );
  return res.rows.length > 0;
};

const addFavourite = async (userId, topicId) => {
  await pool.query(
    `INSERT INTO favourites (user_id, topic_id) VALUES ($1, $2)`,
    [userId, topicId]
  );
};

const removeFavourite = async (userId, topicId) => {
  await pool.query(
    `DELETE FROM favourites WHERE user_id = $1 AND topic_id = $2`,
    [userId, topicId]
  );
};

const getFavouritesByUser = async (userId) => {
  const res = await pool.query(
    `SELECT t.topic_id, t.title, t.created_at, u.name AS author
     FROM favourites f
     JOIN topics t ON f.topic_id = t.topic_id
     JOIN users u ON t.user_id = u.user_id
     WHERE f.user_id = $1
     ORDER BY t.created_at DESC`,
    [userId]
  );
  return res.rows;
};

module.exports = {
  checkFavourite,
  addFavourite,
  removeFavourite,
  getFavouritesByUser,
};
