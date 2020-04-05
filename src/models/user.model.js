const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
    fullname: { type: String, minlength: 4, maxlength: 50, required: true },
    password: { type: String, required: true },
    image: { type: String, required: false, default: '' },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, minlength: 9, maxlength: 15, required: true, unique: true },
    isAdmin: { type: String, required: true, default: false },
    status: { type: Boolean, required: true, default: true },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', UserSchema);