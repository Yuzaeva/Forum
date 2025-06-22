const topicModel = require('../models/topic-model.js');
const pool = require('../db.js');

  async function createTopic(req, res) {
    const { title, description, tags } = req.body;
    const userId = Number(req.cookies.userId);
    if (!userId) return res.status(401).json({ error: 'Не авторизован' });
    if (!title) return res.status(400).json({ error: 'Заголовок темы обязателен' });

    const tagsArray = Array.isArray(tags) ? tags : [];

    try {
      const topic = await topicModel.createTopic(title, description, userId, tagsArray);
      res.status(201).json(topic);
    } catch (err) {
      console.error('Ошибка создания темы:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  async function getTopics(req, res) {
    const userId = req.cookies.userId ? Number(req.cookies.userId) : null;
    try {
      const topics = await topicModel.getAllTopics(userId);
      res.json(topics);
    } catch (err) {
      console.error('Ошибка получения тем:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  async function updateTopic(req, res) {
    const userId = Number(req.cookies.userId);
    const topicId = Number(req.params.topicId);
    const { title, description, name_tag } = req.body;

    if (!userId) return res.status(401).json({ error: 'Не авторизован' });
    if (!title) return res.status(400).json({ error: 'Заголовок темы обязателен' });

    try {
      const updatedTopic = await topicModel.updateTopic(topicId, title, description, userId, name_tag);
      res.json(updatedTopic);
    } catch (err) {
      if (err.status) {
        res.status(err.status).json({ error: err.message });
      } else {
        console.error('Ошибка обновления темы:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
      }
    }
  }

  async function deleteTopic(req, res) {
    const userId = Number(req.cookies.userId);
    const topicId = Number(req.params.topicId);

    if (!userId) return res.status(401).json({ error: 'Не авторизован' });

    try {
      await topicModel.deleteTopic(topicId, userId);
      res.status(200).json({ message: 'Тема удалена' });
    } catch (err) {
      if (err.status) {
        res.status(err.status).json({ error: err.message });
      } else {
        console.error('Ошибка удаления темы:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
      }
    }
  }

  async function getTopicsByUser (req, res) {
    const userId = Number(req.cookies.userId); 

    if (isNaN(userId)) return res.status(400).json({ message: 'Некорректный ID пользователя' });

    try {
      const topics = await topicModel.getTopicsByUser(userId);
      res.json(topics);
    } catch (err) {
      console.error('Ошибка при получении тем пользователя:', err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  async function searchTopics(req, res) {
    const { tag } = req.query;

    try {
      const topics = tag
        ? await topicModel.getTopicsByTag(tag)
        : await topicModel.getAllTopics();
      res.json(topics);
    } catch (err) {
      console.error("Ошибка при поиске тем:", err);
      res.status(500).json({ error: "Ошибка при поиске тем" });
    }
  }

  async function viewTopic(req, res, next) {
  const { topicId } = req.params;
  const client = await pool.connect();
  
  try {
    // Получаем основную информацию о теме
    const topicQuery = `
      SELECT 
        t.topic_id, t.title, t.description, t.created_at, 
        u.user_id, u.name as author_name,
        u.photopath, 
        COUNT(p.post_id) as posts_count
      FROM topics t
      JOIN users u ON t.user_id = u.user_id
      LEFT JOIN posts p ON p.topic_id = t.topic_id
      WHERE t.topic_id = $1
      GROUP BY t.topic_id, u.user_id, u.photopath, u.name
    `;
    const topicResult = await client.query(topicQuery, [topicId]);
    
    if (topicResult.rowCount === 0) {
      return res.status(404).json({ error: 'Тема не найдена' });
    }

    const topic = topicResult.rows[0];

    // Получаем теги темы
    const tagsQuery = `
      SELECT tg.name_tag 
      FROM topic_tags tt
      JOIN tags tg ON tt.tag_id = tg.tag_id
      WHERE tt.topic_id = $1
    `;
    const tagsResult = await client.query(tagsQuery, [topicId]);
    topic.tags = tagsResult.rows.map(row => row.name_tag);

    res.json(topic);
  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
}

module.exports = {
  createTopic,
  getTopics,
  updateTopic,
  deleteTopic,
  searchTopics,
  viewTopic,
  getTopicsByUser,
};
