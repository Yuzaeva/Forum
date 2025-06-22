const express = require('express');
const csrf = require('csurf');
const topicController = require('../controllers/topic-controller');

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

router.get('/', topicController.getTopics);
router.post('/', csrfProtection, topicController.createTopic);
router.put('/:topicId', csrfProtection, topicController.updateTopic);
router.delete('/:topicId', csrfProtection, topicController.deleteTopic);
router.get('/search', topicController.searchTopics);
router.get('/user/:userId', topicController.getTopicsByUser);
router.get('/:topicId/view', topicController.viewTopic);  

module.exports = router;
