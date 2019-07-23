var express = require('express');
var routes = express.Router();
var chatController = require('../controllers/ChatController');

module.exports = {}

routes.post('/:id', chatController.Chat);
routes.get('/:id', chatController.GetStreamChat);

module.exports = routes;