const userModel = require("./../models/Users");

module.exports = {
    checkAuthentication(req, res, next){
        userModel
            .findOne({ Name: req.headers.name })
            .then((foundUser, err) => {
                if (err || foundUser === null || foundUser === undefined || foundUser === "") {
                    if(err) throw err
                    res.json("No users found");
                } else {
                    res.setHeader("Signature", signData(foundUser))
                    res.status(200).json(foundUser);
                }
            })
            .catch(err => {
                console.log(err)
            });
    }
}