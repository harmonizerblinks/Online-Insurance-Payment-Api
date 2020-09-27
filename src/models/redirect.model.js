const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');

const RedirectSchema = mongoose.Schema({
    name: { type: String, minlength: 4, maxlength: 50, required: true },
    type: { type: String, required: true },
    count: { type: Number, required: true },
    status: { type: Boolean, required: true, default: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

RedirectSchema.plugin(uniqueValidator);

module.exports = mongoose.model('redirect', RedirectSchema);