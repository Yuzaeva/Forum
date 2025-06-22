const bcrypt = require('bcryptjs');
const userModel = require('../models/user-model.js');

async function register(req, res) {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const user = await userModel.createUser(name, email, hashedPassword);
    res.cookie("userId", user.user_id, { 
      httpOnly: true,
      sameSite: "lax"
    });
    res.redirect("/pages/profile.html"); // Прямой редирект
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: "Почта уже занята" });
    }
    console.error("Ошибка регистрации:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    res.cookie("userId", user.user_id, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({ 
      success: true,
      redirectUrl: "/pages/profile.html" 
    });
  } catch (error) {
    console.error("Ошибка при входе:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}

async function getProfile(req, res) {
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).json({ error: "Не авторизован" });

  try {
    const user = await userModel.getUserById(userId);
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

async function updateProfile(req, res) {
  const userId = req.cookies.userId;
  const { name, email } = req.body;
  if (!userId) return res.status(401).json({ error: "Не авторизован" });

  try {
    const updatedUser = await userModel.updateUserProfile(userId, name, email);
    res.json({
      name: updatedUser.name,
      email: updatedUser.email,
      photoPath: updatedUser.photopath ? `/images/${updatedUser.photopath.split('/').pop()}` : null,
    });
  } catch (err) {
    console.error("Ошибка обновления профиля:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
}

const path = require('path');

async function uploadPhoto(req, res) {
  const userId = req.cookies.userId;
  if (!userId || !req.file) return res.status(400).json({ error: "Ошибка загрузки" });

  try {
    // Получаем только имя файла, без локального пути
    const filename = path.basename(req.file.path);

    // Обновляем путь к фото в базе — сохраняем только имя файла (или относительный путь)
    const user = await userModel.updateUserPhoto(userId, filename);

    // Отправляем клиенту относительный URL для загрузки
    res.json({ photoPath: `/images/${filename}` });
  } catch (err) {
    console.error("Ошибка сохранения фото:", err);
    res.status(500).json({ error: "Не удалось сохранить фото" });
  }
}

async function checkAuth(req, res) {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.json({ user: null });
  }

  try {
    const user = await userModel.findUserById(userId); 
    if (!user) {
      return res.json({ user: null });
    }
    res.json({ user });
  } catch (err) {
    console.error("Ошибка проверки авторизации:", err);
    res.json({ user: null });
  }
}

async function logout(req, res) {
  res.clearCookie("userId");
  res.redirect("/");
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  uploadPhoto,
  checkAuth,
  logout,
};
