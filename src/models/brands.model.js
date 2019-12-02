const mongoose = require('mongoose');

const BrandSchema = mongoose.Schema({
    name: { type: String, required: true },
    imageurl: { type: String, required: true },
    description: { type: String, minlength: 18, required: true },
    promotions: { type: Array },
    categorys: { type: Array },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});

module.exports = mongoose.model('brands', BrandSchema);