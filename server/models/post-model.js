const pool = require('../db.js');

// Создание поста
async function createPost(post_content, userId, topic_id, flag_score,flag_flagged) {
  const result = await pool.query(
    `INSERT INTO posts (post_content, user_id, topic_id, flag_score, flag_flagged) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING post_id, post_content, user_id, topic_id, post_date, flag_score, flag_flagged`,
    [post_content, userId, topic_id, flag_score, flag_flagged]
  );
  return result.rows[0];
}

// Получение всех постов по topic_id
async function getPostsByTopicId(topic_id) {
  const query = `
    SELECT 
    p.post_id, p.post_content, p.post_date, p.user_id, p.topic_id,
    u.name AS author, u.photopath
  FROM posts p
  JOIN users u ON p.user_id = u.user_id
  WHERE p.topic_id = $1
  ORDER BY p.post_date DESC
  `;

  const result = await pool.query(query, [topic_id]);

  const posts = result.rows.map(post => ({
    ...post,
    photopath: post.photopath ? '/images/' + post.photopath : null
  }));

  return posts;
}

// Получение одного поста по ID
async function getPostById(post_id) {
  const query = `
    SELECT p.post_id, p.post_content, p.topic_id, p.user_id, p.post_date, 
           u.name as author_name, u.photopath as photopath
    FROM posts p
    JOIN users u ON p.user_id = u.user_id
    WHERE p.post_id = $1
  `;
  const result = await pool.query(query, [post_id]);
  return result.rows[0];
}

// Обновление поста (проверка владельца по user_id)
async function updatePost(post_id, post_content, userId) {
  const res = await pool.query(
    `UPDATE posts 
     SET post_content = $1 
     WHERE post_id = $2 AND user_id = $3 
     RETURNING *`,
    [post_content, post_id, userId]
  );
  if (res.rowCount === 0) {
    throw { status: 403, message: 'Нельзя редактировать чужой пост или пост не найден' };
  }
  return res.rows[0];
}

// Удаление поста
async function deletePost(post_id, userId) {
  const res = await pool.query(
    `DELETE FROM posts 
     WHERE post_id = $1 AND user_id = $2 
     RETURNING *`,
    [post_id, userId]
  );
  if (res.rowCount === 0) {
    throw { status: 403, message: 'Нельзя удалить чужой пост или пост не найден' };
  }
  return res.rows[0];
}
  async function getPostsByUser(userId) {
    const result = await pool.query(`
       SELECT 
      p.post_id, p.post_content, p.post_date, p.user_id,
      p.topic_id,                                  -- ← добавь это
      u.name AS author, u.photopath
    FROM posts p
    JOIN users u ON p.user_id = u.user_id
    WHERE p.user_id = $1
    ORDER BY p.post_date DESC
    `, [userId]);

    return result.rows.map(post => ({
      ...post,
      photopath: post.photopath ? '/images/' + post.photopath : null
    }));
  }

module.exports = {
  createPost,
  getPostsByTopicId,
  getPostById,
  updatePost,
  deletePost,
  getPostsByUser,
};
