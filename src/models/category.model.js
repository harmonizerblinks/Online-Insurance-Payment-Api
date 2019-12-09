const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: { type: String, index: true, required: true, unique: true },
    banner: { type: String, required: false },
    imageurl: { type: String, required: false },
    description: { type: String, required: false },
    status: { type: Boolean, required: true, default: true },
    products: { type: Array, required: false },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});


module.exports = mongoose.model('category', CategorySchema);