let errors = require("./../libs/errorcodes");
let tokenHelper = require("./../helpers/tokenHelper");
let tokenModel = require("./../models/Tokens");

function tokenauth(req, res, next) {
  if (req.url == "/login") {
    let newToken = tokenHelper.genToken();
    newToken.save(function (err, newToken) {
      if (err) return console.log(err);
    });
    res.setHeader("Token", newToken.Token);
    next();
  } else if (req.headers.token == "" || req.headers.token == undefined) {
    res.status(errors[1401].header).json(errors[1401]);
  } else {
    let token = req.headers.token;
    // Find token
    tokenModel.findOne({ Token: token , ExpirationDate: {$gte : new Date()} }, function (err, foundToken) {
      if (err || foundToken == null || foundToken == undefined || foundToken == "") {
        return res.status(errors[1401].header).json(errors[1401]);
      }
      else {
        // delete token
        //foundToken.remove();
        // generate new token and add to db.
        let newToken = tokenHelper.genToken();
        newToken.save(function (err, newToken) {
          if (err) return console.log(err);
        });
        res.setHeader("Token", newToken.Token);
        next();
      }
    });
  }
}

module.exports = tokenauth;
