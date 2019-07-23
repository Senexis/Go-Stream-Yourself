const crypto = require("crypto");
let UserModel = require("./../models/Users");
let errors = require('./../libs/errorcodes');
let fs = require('fs');
let path = require('path');
const verifyData = require('../libs/signature').verifyData

function certauth(req, res, next) {
  if (req.url == "/login" && req.method == "GET") {
    if (req.headers.token != null && req.headers.token != "" && req.headers.token != undefined) {
      if ((req.headers.name != null || req.headers.name != undefined) && (req.headers.signature != null || req.headers.signature != undefined || req.headers.signature != "")) {
        auth(req, res, function (bool) {
          if (bool) {
            next();
          } else {
            res.status(errors[1402].header).json(errors[1402]);
          }
        });
      } else {
        res.status(errors[1402].header).json(errors[1402]);
      }
    } else {
      next();
    }
  } else {
    if ((req.headers.name != null || req.headers.name != undefined) && (req.headers.signature != null || req.headers.signature != undefined || req.headers.signature != "")) {
      auth(req, res, function (bool) {
        if (bool) {
          next()
        } else {
          res.status(errors[1402].header).json(errors[1402]);
        }
      });
    } else {
      res.status(errors[1402].header).json(errors[1402]);
    }
  }
}

function auth(req, res, cb) {
  let sign = req.headers.signature;
  let name = req.headers.name;
  let data
  if (Object.keys(req.body).length === 0) data = { token: req.headers.token }
  else data = req.body
  //DB get pubkey by name;
  UserModel.findOne({ "Name": name }, function (err, user) {
    if (err)
      console.log(err);
    try {
      verifyData(data, sign, user.PublicKey, user.Name, function (result) {
        if (result) {
          cb(result);
        } else {
          return res.status(errors[1402].header).json(errors[1402]);
        }
      });
    } catch (error) {
      return res.status(errors[1402].header).json(errors[1402]);
    }
  });
}

module.exports = certauth;
