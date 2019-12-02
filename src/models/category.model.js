const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: { type: String, required: true },
    imageurl: { type: String, required: true },
    description: String,
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});

module.exports = mongoose.model('category', CategorySchema);