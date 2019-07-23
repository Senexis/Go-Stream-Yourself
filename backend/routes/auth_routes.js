const express = require('express')
const routes = express.Router()

const chatboxcontroller = require('../controllers/AuthController')
routes.get('/', chatboxcontroller.checkAuthentication)

module.exports = routes