const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const CustomerSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, index: true, required: true, unique: true },
    mobile: { type: String, index: true, required: true, unique: true },
    password: { type: String, required: false },
    address: { type: Object, required: false },
    carts: { type: Array, required: false },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});

CustomerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('customer', CustomerSchema);

function generateOTP() {
    var digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var otpLength = 8;
    var otp = '';

    for (let i = 1; i <= otpLength; i++) {
        var index = Math.floor(Math.random() * (digits.length));

        otp = otp + digits[index];
    }
    return otp.toUpperCase();
}