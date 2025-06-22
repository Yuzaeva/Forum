const express = require('express');
const router = express.Router();
const csrfProtection = require('csurf')({ cookie: true });
const {
  toggleFavourite,
  getUserFavourites,
  removeFavourites,
} = require('../controllers/favourite-controller');

router.post('/favourites/:topicId', csrfProtection, toggleFavourite);
router.get('/favourites', getUserFavourites);
router.delete('/favourites/:topicId', csrfProtection, removeFavourites);

module.exports = router;
