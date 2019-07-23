let actionModel = require("./../models/Actions");
let userModel = require("./../models/Users");

function Logger(req, res, next) {
  const name = req.headers.name;
  // find user based on name in the header.
  userModel.findOne({ Name: name }, function (err, foundUser) {
    if (err || foundUser == null || foundUser == undefined || foundUser == "") {
      // handle error properly when user is not found.
    }
    else {
      let action = new actionModel({
        Method: req.method,
        Url: req.url,
        Date: Date.now(),
        User: foundUser
      });

      action.save(function (err, newAction) {
        if (err) {
          return console.log("Error saving the action: " + err);
        }
      });
    }
  });
  next();
}

module.exports = Logger;