const pool = require('../db.js');

async function createTopic(title, description, userId, tags = []) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertTopicText = `
      INSERT INTO topics (title, description, user_id) VALUES ($1, $2, $3) RETURNING topic_id, title, description, user_id, created_at
    `;
    const topicResult = await client.query(insertTopicText, [title, description, userId]);
    const topic = topicResult.rows[0];

    if (tags.length > 0) {
      for (const tagName of tags) {
        let tagResult = await client.query(`SELECT tag_id FROM tags WHERE name_tag = $1`, [tagName]);
        
        let tagId;
        if (tagResult.rowCount === 0) {
          const insertTag = await client.query(
            `INSERT INTO tags (name_tag) VALUES ($1) RETURNING tag_id`,
            [tagName]
          );
          tagId = insertTag.rows[0].tag_id;
        } else {
          tagId = tagResult.rows[0].tag_id;
        }

        await client.query(
          `INSERT INTO topic_tags (topic_id, tag_id) VALUES ($1, $2)`,
          [topic.topic_id, tagId]
        );
      }
    }

    await client.query('COMMIT');
    return topic;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getAllTopics(userId = null) {
  const query = `
    SELECT 
      t.topic_id, t.description, t.title, t.created_at, t.user_id, u.name AS author, u.photopath,
      CASE WHEN f.user_id IS NOT NULL THEN true ELSE false END AS is_favourited
    FROM topics t
    JOIN users u ON t.user_id = u.user_id
    LEFT JOIN favourites f ON f.topic_id = t.topic_id AND f.user_id = $1
    ORDER BY t.created_at DESC
  `;
  const result = await pool.query(query, [userId]);
  const topics = result.rows.map(topic => ({
    ...topic,
    photopath: topic.photopath ? '/images/' + topic.photopath : null
  }));
  return topics;
}

async function getTopicById(topicId) {
  const result = await pool.query(
    `SELECT 
       t.topic_id, t.title, t.description, t.user_id, t.created_at,
       u.name AS author,
       u.photopath
     FROM topics t
     JOIN users u ON t.user_id = u.user_id
     WHERE t.topic_id = $1`,
    [topicId]
  );
  return result.rows[0];
}

  async function getTopicsByUser(userId) {
    const result = await pool.query(`
      SELECT 
        t.topic_id, t.title, t.description, t.created_at, t.user_id,
        u.name AS author, u.photopath
      FROM topics t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.user_id = $1
      ORDER BY t.created_at DESC
    `, [userId]);

    return result.rows.map(topic => ({
      ...topic,
      photopath: topic.photopath ? '/images/' + topic.photopath : null
    }));
  }


  async function updateTopic(topicId, title, description, userId, tags = []) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Проверка, что пользователь владеет темой
      const ownerRes = await client.query(`SELECT user_id FROM topics WHERE topic_id = $1`, [topicId]);
      if (ownerRes.rowCount === 0) throw { status: 404, message: 'Тема не найдена' };
      if (ownerRes.rows[0].user_id !== userId) throw { status: 403, message: 'Нельзя редактировать чужую тему' };

      // Обновляем заголовок темы
      await client.query(`UPDATE topics SET title = $1, description = $2 WHERE topic_id = $3`, [title, description, topicId]);

      if (Array.isArray(tags)) {
        // Удаляем старые связи тегов
        await client.query(`DELETE FROM topic_tags WHERE topic_id = $1`, [topicId]);

        for (const tagName of tags) {
          // Проверка, существует ли тег
          let tagResult = await client.query(`SELECT tag_id FROM tags WHERE name_tag = $1`, [tagName]);
          let tagId;

          if (tagResult.rowCount === 0) {
            // Создаём новый тег
            const insertTag = await client.query(
              `INSERT INTO tags (name_tag) VALUES ($1) RETURNING tag_id`,
              [tagName]
            );
            tagId = insertTag.rows[0].tag_id;
          } else {
            tagId = tagResult.rows[0].tag_id;
          }

          // Добавляем связь между темой и тегом
          await client.query(`INSERT INTO topic_tags (topic_id, tag_id) VALUES ($1, $2)`, [topicId, tagId]);
        }
      }

      await client.query('COMMIT');

      const updatedTopic = await getTopicById(topicId);
      return updatedTopic;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

async function deleteTopic(topicId, userId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const ownerRes = await client.query(`SELECT user_id FROM topics WHERE topic_id = $1`, [topicId]);
    if (ownerRes.rowCount === 0) throw { status: 404, message: 'Тема не найдена' };
    if (ownerRes.rows[0].user_id !== userId) throw { status: 403, message: 'Нельзя удалить чужую тему' };

    await client.query(`DELETE FROM topics WHERE topic_id = $1`, [topicId]);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

  async function getTopicsByTag(tag) {
    const result = await pool.query(`
      SELECT t.topic_id, t.title, t.created_at, u.name AS author, t.user_id
      FROM topics t
      JOIN users u ON t.user_id = u.user_id
      LEFT JOIN topic_tags tt ON t.topic_id = tt.topic_id
      LEFT JOIN tags tg ON tt.tag_id = tg.tag_id
      WHERE tg.name_tag = $1
      ORDER BY t.created_at DESC
    `, [tag]);
    return result.rows;
  }

module.exports = {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopic,
  deleteTopic,
  getTopicsByTag,
  getTopicsByUser,
};
