const postModel = require('../models/post-model.js');
const TextClassifier = require('../textClassifier.js');

// Создание поста
async function createPost(req, res, next) {
  const { post_content, topic_id } = req.body;
  const userId = Number(req.cookies.userId);
  if (!userId) return res.status(401).json({ error: 'Не авторизован' });
  if (!post_content) return res.status(400).json({ error: 'Нельзя отправить пустой комментарий' });
      if (!topic_id) return res.status(400).json({ error: 'Отсутствует ID темы' });

  try {
    // Берём уже инициализированный и обученный классификатор
    const classifier = req.app.locals.classifier;

    if (!classifier.model) {
      return res.status(500).json({ error: 'Классификатор не готов' });
    }

    const flag_score = await classifier.predict(post_content);
    const flag_flagged = flag_score >= 0.5;  

    const post = await postModel.createPost(post_content, userId, topic_id, flag_score, flag_flagged);
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}


// Получение всех постов по теме
async function getPostsByTopicId(req, res, next) {
  const { topicId } = req.params;

  try {
    const posts = await postModel.getPostsByTopicId(topicId);
    res.json(posts);
  } catch (err) {
    next(err);
  }
}

// Получение поста по ID
async function getPostById(req, res, next) {
  const { postId } = req.params;

  try {
    const post = await postModel.getPostById(postId);
    if (!post) return res.status(404).json({ message: 'Пост не найден' });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

// Обновление поста
async function updatePost(req, res, next) {
  const { postId } = req.params;
  const { post_content } = req.body;
  const userId = Number(req.cookies.userId);

  if (!userId) return res.status(401).json({ error: 'Не авторизован' });
  if (!post_content || post_content.trim().length === 0)
    return res.status(400).json({ error: 'Пост не может быть пустым' });


  try {
    const updatedPost = await postModel.updatePost(postId, post_content, userId);
    res.json(updatedPost);
  } catch (err) {
    next(err);
  }
}

// Удаление поста
async function deletePost(req, res, next) {
  const postId = Number(req.params.postId);
  const userId = Number(req.cookies.userId);

  try {
    await postModel.deletePost(postId, userId);
    res.status(200).json({ message: 'Сообщение удалено' });
  } catch (err) {
      if (err.status) {
        res.status(err.status).json({ error: err.message });
      } else {
        console.error('Ошибка удаления темы:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
      }
    }
  }

  async function getPostsByUser (req, res) {
      const userId = Number(req.cookies.userId); 
  
      if (isNaN(userId)) return res.status(400).json({ message: 'Некорректный ID пользователя' });
  
      try {
        const posts = await postModel.getPostsByUser(userId);
        res.json(posts);
      } catch (err) {
        console.error('Ошибка при получении тем пользователя:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
      }
    }

module.exports = {
  createPost,
  getPostsByTopicId,
  getPostById,
  updatePost,
  deletePost,
  getPostsByUser,
};


