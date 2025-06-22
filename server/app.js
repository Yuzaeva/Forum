const { texts, labels } = require('./text-labels.js');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const { Sequelize, DataTypes } = require('sequelize');
const userRoutes = require('./routes/user-routes.js');
const topicRoutes = require('./routes/topic-routes.js');
const favouriteRoutes = require('./routes/favourite-routes.js');
const postRoutes = require('./routes/post-routes.js');
const TextClassifier = require('./textClassifier');

const app = express();
const PORT = 3000;
const classifier = new TextClassifier();

// Инициализация Sequelize
const sequelize = new Sequelize('forum_app', 'postgres', '324322', {
  host: 'localhost',
  dialect: 'postgres',
});

// Определение модели Post
const Post = sequelize.define('Post', {
  post_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  post_content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  topic_id: { type: DataTypes.INTEGER },
  user_id: { type: DataTypes.INTEGER },
  post_date: { type: DataTypes.DATE },
  flag_score: { type: DataTypes.FLOAT }
}, {
  tableName: 'posts',
  timestamps: false
});

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(csrf({ cookie: true }));

// Установка XSRF-токена
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

// Статические файлы
app.use(express.static(__dirname));
// app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'images'), {
//   setHeaders: (res) => {
//     res.set('Access-Control-Allow-Origin', '*');
//   }
// }));
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/src', express.static(path.join(__dirname, '../src')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use(express.static(path.join(__dirname, '..')));
app.use('/pages', express.static(path.join(__dirname, '../pages'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.set('Content-Type', 'text/html');
    }
  }
}));

// Роут для отображения страницы комментариев
const commentsPagePath = path.join(__dirname, '../pages/comments.html');
app.get('/comments/:topicId', (req, res) => {
  res.sendFile(commentsPagePath);
});

// Основной POST-роут
app.post('/send-message', async (req, res) => {
  try {
    const { message, topic_id, user_id } = req.body;
    const score = await classifier.predict(message);

    console.log('Predicted score:', score);

    await Post.create({
      post_content: message,
      topic_id,
      user_id,
      post_date: new Date(),
      flag_score: score,
      flag_flagged: flag_flagged
    });

    if (score >= 0.5) {
      return res.status(403).json({ error: 'Сообщение содержит запрещённый контент' });
    }

    res.json({ status: 'Сообщение принято' });
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Роуты
app.use(userRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api', favouriteRoutes);
app.use('/api/posts', postRoutes);

// Обработка CSRF-ошибок
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Некорректный CSRF токен' });
  }
  next(err);
});

// Запуск после обучения модели
const startServer = async () => {
  try {
    await classifier.init();

    await classifier.train(texts, labels);
    console.log('Классификатор обучен. Запускаем сервер...');

    app.locals.classifier = classifier;

    await sequelize.authenticate();
    console.log('Подключение к БД прошло успешно');

    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Ошибка инициализации:', err);
  }
};

startServer();
