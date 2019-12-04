const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const CustomerSchema = mongoose.Schema({
    code: { type: String, unique: true, default: generateOTP() },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    address: { type: Object, required: false },
    carts: { type: Array, required: false },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});

CustomerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('customers', CustomerSchema);

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