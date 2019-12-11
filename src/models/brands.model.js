const mongoose = require('mongoose');

const BrandSchema = mongoose.Schema({
    name: { type: String, index: true, required: true, unique: true },
    logo: { type: String, required: true },
    banner: { type: String, required: true },
    imageurl: { type: String, required: false },
    description: { type: String, minlength: 18, required: true },
    promotions: { type: [String], required: false },
    categoryid: { type: [String], required: false },
    categorys: { type: Array },
    status: { type: Boolean, required: true, default: true },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});

module.exports = mongoose.model('brand', BrandSchema);