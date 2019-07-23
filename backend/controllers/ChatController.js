var db = require('../config/db');
let chatModel = require("./../models/Chats");
let userModel = require("./../models/Users");
let io = require("./../app").io;
let errors = require('./../libs/errorcodes');
let moment = require('moment');
const signData = require('../libs/signature').signData;

module.exports = {
    Chat(req, res, next) {
        userModel.findOne({ Name: req.headers.name }, function(err, foundUser) {
            if (err || foundUser == null || foundUser == undefined || foundUser == "") {
              // handle error properly.
              return res.json(errors[1403]);
            }
            else{
                try {
                    const currentDate = moment().format();
                    let chatMessage = new chatModel({
                        Content: req.body.content,
                        Date: currentDate,
                        Stream: req.params.id,
                        User: foundUser._id
                    });
            
                    chatMessage.save(function(err, newChat) {
                        if (err){ 
                            return console.log(err);
                        } else{
                            const response = {response: "Message sent"}
                            res.setHeader("Signature", signData(response))
                            res.status(200).json(response);
                        }
                    });  
                } catch (err) { 
                    res.status(errors[1601].header).json(errors[1601]); 
                } 

            }
        });
    },
    GetStreamChat(req, res, next) {
        let query = { Stream: req.params.id }

        if(req.headers.timestamp && req.headers.timestamp !== "undefined" && req.headers.timestamp !== 0 && req.headers.timestamp !== "0") {
            query.Date = { $gte : new Date(parseInt(req.headers.timestamp,10))}
        }
        console.log(query, req.headers.timestamp)
        chatModel
            .find(query)
            .populate("User")
            .then((foundChat, err) => {
                if (err || foundChat === null || foundChat === undefined || foundChat === "") {
                    //if(err) throw err
                    return res.json("No chats found");
                } else {
                    res.setHeader("Signature", signData(foundChat))
                    res.status(200).json(foundChat);
                }
            }) 
            .catch(err => {
                console.log(err)
            });
    }
}