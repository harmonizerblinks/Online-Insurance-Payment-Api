const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const DriverSchema = mongoose.Schema({
    fullname: { type: String, minlength: 8, maxlength: 50, required: true },
    username: { type: String, minlength: 8, maxlength: 15, required: true, unique: true },
    password: { type: String, required: true },
    code: { type: String, minlength: 6, maxlength: 10, required: true, unique: true },
    mobile: { type: String, minlength: 8, maxlength: 15, required: true, unique: true },
    status: { type: Boolean, required: true, default: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

DriverSchema.plugin(uniqueValidator);

module.exports = mongoose.model('transaction', DriverSchema);