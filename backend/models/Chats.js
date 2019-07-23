const mongoose = require('../config/db');

const chatSchema = new mongoose.Schema({
    Content: {
        type: String,
        required: true,
        minlength: 1
    },
    Date: {
        type: String,
        required: true,
        minLength: 1,
        default: new Date()
    },
    Stream: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Streams',
        required: true,
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    }
});

const Chats = mongoose.model('Chats', chatSchema);

module.exports = Chats;