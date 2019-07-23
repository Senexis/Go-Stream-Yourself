const userModel = require("./../models/Users");
let errors = require("./../libs/errorcodes");
const ObjectId = require('mongoose').Types.ObjectId
const signData = require('../libs/signature').signData

module.exports = {
    Get(req, res, next) {
        let $or = [ ]

        if (ObjectId.isValid(req.params.id)) $or.push({_id: req.params.id})
        $or.push({Name: req.params.id}) 

        userModel
            .findOne({ $or: $or })
            .populate("Streams")
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
    },
    GetAll(req, res, next) {
        userModel
            .find()
            .populate("Streams")
            .then((foundUsers, err) => {
                if (err || foundUsers === null || foundUsers === undefined || foundUsers === "") {
                    if(err) throw err
                    res.json("No users found");
                } else {
                    res.setHeader("Signature", signData(foundUsers))
                    res.status(200).json(foundUsers);
                }
            })
            .catch(err => {
                console.log(err)
            });
    },
    Update(req, res, next) {
        userModel
            .findOne({ Name: req.headers.name })
            .then((foundUser, err) => {
                if (err || foundUser === null || foundUser === undefined || foundUser === "") {
                    if(err) throw err
                    res.status(errors[1403].header).json(errors[1403]);
                } else {
                    updateData = {
                        Avatar: req.body.avatar,
                        Slogan: req.body.slogan
                    }
                    foundUser.update(updateData, function(err, affected){
                        if(err){ 
                            res.status(errors[1402].header).json(errors[1402])
                        } else {
                            const response = {message: "Succesfully updated"}
                            res.setHeader("Signature", signData(message))
                            res.status(200).json(message);
                        }
                    });
                }
            })
            .catch(err => {
                console.log(err)
            });
    }
}