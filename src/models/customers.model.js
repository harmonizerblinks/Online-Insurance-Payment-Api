const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const CustomerSchema = mongoose.Schema({
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