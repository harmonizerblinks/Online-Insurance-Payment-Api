const mongoose = require('mongoose');

const BlogSchema = mongoose.Schema({
    title: { type: String, required: true },
    postedby: { type: String, required: true },
    imageurl: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});

module.exports = mongoose.model('blogs', BlogSchema);