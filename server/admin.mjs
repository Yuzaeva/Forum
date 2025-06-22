// admin.js (в стиле ES Modules)

import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';
import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';

// Подключаем адаптер
AdminJS.registerAdapter(AdminJSSequelize);

// Подключение к БД
const sequelize = new Sequelize('forum_app', 'postgres', '324322', {
  host: 'localhost',
  dialect: 'postgres',
});

// Модель User
const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photopath: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'users',     
  timestamps: false,      
});

const FlaggedMessage = sequelize.define('Post', {
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
  flag_score: { type: DataTypes.FLOAT },
  flag_flagged:  {type: DataTypes.BOOLEAN}
}, {
  tableName: 'posts',
  timestamps: false
});

// AdminJS конфигурация
const adminJs = new AdminJS({
  resources: [
    {
      resource: User,
      options: {
        properties: {
          password: { isVisible: { list: false, filter: false, show: false, edit: true } },
        }
      }
    },
    {
      resource: FlaggedMessage,
      options: {
        listProperties: ['post_id', 'post_content', 'flag_score', 'post_date', 'topic_id', 'user_id',  'flag_flagged ']
      }
    }
  ],
  rootPath: '/admin',
});


// Express и AdminJS router
const app = express();
const router = AdminJSExpress.buildRouter(adminJs);
app.use(adminJs.options.rootPath, router);

// Синхронизация и запуск
app.listen(3000, () => {
  console.log('AdminJS is running on http://localhost:3000/admin');
});

