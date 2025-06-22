const pool = require('../db.js');

async function getProfile(req, res) {
  const userId = req.cookies.userId;
  console.log('Cookies:', req.cookies);
  if (!userId) return res.status(401).json({ error: "Не авторизован" });

  try {
    const user = await userModel.getUserById(userId);
    console.log('Найденный пользователь:', user);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    res.json({
      name: user.name,
      email: user.email,
      photoPath: user.photopath ? `/images/${user.photopath.split('/').pop()}` : null,
    });
  } catch (err) {
    console.error("Ошибка получения профиля:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
}

async function createUser(name, email, hashedPassword) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING user_id`,
    [name, email, hashedPassword]
  );
  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await pool.query(
    `SELECT user_id, name, email, password FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}

async function getUserById(userId) {
  const result = await pool.query(
    `SELECT user_id, name, email, photoPath FROM users WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
}

async function updateUserProfile(userId, name, email) {
  await pool.query(
    `UPDATE users SET name = $1, email = $2 WHERE user_id = $3`,
    [name, email, userId]
  );
  return getUserById(userId);
}

async function updateUserPhoto(userId, photoPath) {
  await pool.query(
    `UPDATE users SET photoPath = $1 WHERE user_id = $2`,
    [photoPath, userId]
  );
  return getUserById(userId);
}

async function findUserById(userId) {
  const result = await pool.query(
    `SELECT user_id, name, email FROM users WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0] || null;
}

module.exports = {
  getProfile,
  createUser,
  getUserByEmail,
  getUserById,
  updateUserProfile,
  updateUserPhoto,
  findUserById,
};
