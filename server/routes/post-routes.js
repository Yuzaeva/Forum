const express = require('express');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const router = express.Router();
const postsController = require('../controllers/post-controller.js');
const postModel = require('../models/post-model.js');

router.get('/post/:postId', postsController.getPostById);

router.post('/', csrfProtection, postsController.createPost);

router.put('/:postId', csrfProtection, postsController.updatePost);

router.delete('/:postId', csrfProtection, postsController.deletePost);
router.get('/user/:userId', postsController.getPostsByUser);

router.get('/topic/:topicId/view', async (req, res, next) => {
  try {
    const topicId = req.params.topicId;
    const posts = await postModel.getPostsByTopicId(topicId);

    res.json({ posts }); 
  } catch (err) {
    next(err);
  }
});

module.exports = router;
