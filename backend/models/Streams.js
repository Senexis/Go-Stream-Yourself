const mongoose = require('../config/db');

const streamSchema = new mongoose.Schema({
    Date: {
        type: Date,
        required: true,
        minLength: 1
    },
    Length: {
        type: Date,
        required: true,
        minLength: 1
    },
    Viewers: {
        type: Number,
        required: true,
        minLength: 1
    },
    Live: {
        type: Boolean,
        required: false,
        minlength: 1,
        default: false
    },
    Port: {
        type: Number,
        required: false,
        minlength: 1,
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    }
});

const Streams = mongoose.model('Streams', streamSchema);

module.exports = Streams;