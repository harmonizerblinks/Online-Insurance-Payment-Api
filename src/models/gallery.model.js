const mongoose = require('mongoose');

const GallerySchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    imageurl: { type: String, required: false },
    created: { type: Date, index: true, default: Date.now }
});

module.exports = mongoose.model('gallery', GallerySchema);