const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: { type: String, required: true },
    imageurl: { type: String, required: false },
    description: { type: String, required: false },
    status: { type: Boolean, required: true },
    products: { type: Array, required: false },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});


module.exports = mongoose.model('category', CategorySchema);