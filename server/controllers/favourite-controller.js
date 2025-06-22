const {
  checkFavourite,
  addFavourite,
  removeFavourite,
  getFavouritesByUser,
} = require('../models/favourite-model.js');

const toggleFavourite = async (req, res) => {
  const userId = req.cookies.userId;
  const { topicId } = req.params;

  if (!userId) return res.status(401).json({ error: "Не авторизован" });

  try {
    const isFavourite = await checkFavourite(userId, topicId);

    if (isFavourite) {
      await removeFavourite(userId, topicId);
      res.json({ favourited: false });
    } else {
      await addFavourite(userId, topicId);
      res.json({ favourited: true });
    }
  } catch (err) {
    console.error("Ошибка работы с избранным:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

const getUserFavourites = async (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).json({ error: "Не авторизован" });

  try {
    const favourites = await getFavouritesByUser(userId);
    res.json(favourites);
  } catch (err) {
    console.error("Ошибка получения избранного:", err);
    res.status(500).json({ error: "Ошибка получения избранного" });
  }
};

const removeFavourites = async(req, res) => {
  const userId = req.cookies.userId;
  const { topicId } = req.params;
  if (!userId) return res.status(401).json({ error: "Не авторизован" });

  try {
    await removeFavourite(userId, topicId);
    res.status(204).send(); 
  } catch (err) {
    console.error('Ошибка при удалении избранного:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

module.exports = {
  toggleFavourite,
  getUserFavourites,
  removeFavourites,
};
