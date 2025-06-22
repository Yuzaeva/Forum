// server/routes/userRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/user-controller.js');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const router = express.Router();

const uploadDir = path.join(__dirname, '..', '..', 'images');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const sanitizedName = file.originalname.replace(/[^\w.-]/g, '_');
    const uniqueName = `user_${Date.now()}_${sanitizedName}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.get('/', csrfProtection, (req, res) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  res.sendFile(path.join(__dirname, '..', '..', 'pages', 'main.html'));
});

router.post('/register', csrfProtection, userController.register);
router.post('/login', csrfProtection, userController.login);
router.get('/profile', csrfProtection, (req, res) => {
  if (!req.cookies.userId) {
    console.log('Не авторизован, возвращаем 401');
    return res.status(401).json({ error: 'Не авторизован' });
  }
  res.sendFile(path.join(__dirname, '..', '..', 'pages', 'profile.html'));
});
router.get('/api/profile', userController.getProfile);
router.put('/api/profile', csrfProtection, userController.updateProfile);
router.post('/api/upload-photo', upload.single('photo'), userController.uploadPhoto);
router.get("/api/check-auth", userController.checkAuth);
router.get("/logout", userController.logout);

module.exports = router;
