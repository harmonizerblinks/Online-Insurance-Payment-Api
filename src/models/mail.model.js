const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');

const MailSchema = mongoose.Schema({
    website: { type: String, required: true },
    // from: { type: String, required: true },
    to: { type: String, required: true },
    name: { type: String, minlength: 4, maxlength: 50, required: true },
    email: { type: String, required: true },
    mobile: { type: String, minlength: 9, maxlength: 15, required: true },
    subject: { type: String, required: true },
    location: { type: String, required: false },
    text: { type: String, required: false },
    body: { type: String, required: true },
    status: { type: Boolean, required: true, default: true },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});

MailSchema.plugin(uniqueValidator);

module.exports = mongoose.model('mail', MailSchema);