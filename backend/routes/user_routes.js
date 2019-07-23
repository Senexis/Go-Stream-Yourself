var express = require('express');
var routes = express.Router();
var userController = require('../controllers/UserController');

routes.post('/update', userController.Update);
routes.get('/:id', userController.Get);
routes.get('/', userController.GetAll);


module.exports = routes;