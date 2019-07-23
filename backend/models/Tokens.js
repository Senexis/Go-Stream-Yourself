const mongoose = require('../config/db');

const tokenSchema = new mongoose.Schema({
    Token: {
        type: String,
        required: true,
        minlength: 1
    },
    ExpirationDate: { 
        type: Date,
        required: true,
        minlength: 1
    }
});

const Tokens = mongoose.model('Tokens', tokenSchema);

module.exports = Tokens;