const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

//Our personal middleware functions
let tokenauth = require("./middleware/tokenauth.js");
let certauth = require("./middleware/certauth");
let logger = require("./middleware/logger");

const router = require("./router");
const schedule = require("node-schedule");

let tokenModel = require("./models/Tokens");

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

//Calling logger and authentication
app.use(cors())
app.use(certauth);
app.use(tokenauth);
app.use(logger);

//Allow Origin
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Expose-Headers', '*');
  res.header('Timestamp', (Math.floor(Date.now())))
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json, Token');
  next();
});

app.options('*', (req, res) => {
  res.setHeader("Timestamp", 0).end()
});

app.use(router);

require('./sockets/chatsockets')(io)

http.listen(process.env.PORT || 5000, () => {
  if (process.env.PORT !== undefined) {
    console.log("Server gestart op poort " + process.env.PORT);
  } else {
    console.log("Server gestart op poort 5000");
  }
});

// job every 15 minute  to clear out tokens.
const j = schedule.scheduleJob('* 15 * * * *', function () {
  tokenModel.find({ ExpirationDate: { $lt: Date.now() } }, function (err, foundTokens) {
    if (err) { console.log(err); }
    foundTokens.forEach(t => t.remove())
  });
});

module.exports = app;
