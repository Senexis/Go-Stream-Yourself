const mongoose = require('../config/db');

const actionSchema = new mongoose.Schema({
    Method: {
        type: String,
        required: true,
        minlength: 1
    },
    Url: {
        type: String,
        required: true,
        minlength: 1
    },
    Date: {
        type: Date,
        required: true,
        minLength: 1
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    }
});

const Actions = mongoose.model('Actions', actionSchema);

module.exports = Actions;