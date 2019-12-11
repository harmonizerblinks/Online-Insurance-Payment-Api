const mongoose = require('mongoose');

const VideoSchema = mongoose.Schema({
    name: { type: String, index: true, required: true, unique: true },
    url: { type: String, required: false },
    created: { type: Date, index: true, default: Date.now }
});

module.exports = mongoose.model('video', VideoSchema);