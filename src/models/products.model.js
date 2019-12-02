const mongoose = require('mongoose');

const ProductSizes = mongoose.Schema({
    name: { type: String, required: true },
    imageurl: { type: String, required: false },
    amount: { type: String, required: true },
    status: { type: Boolean, required: true },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});

const ProductColors = mongoose.Schema({
    name: { type: String, required: true },
    imageurl: { type: String, required: true },
    status: { type: Boolean, required: true },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});

const ProductImages = mongoose.Schema({
    imageurl: { type: String, required: true },
    created: { type: Date, index: true, default: Date.now },
});


const ProductSchema = mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    imageurl: { type: String, required: true },
    images: { type: [ProductImages], required: false },
    introduction: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: String, required: true },
    sizes: { type: [ProductSizes], required: false },
    colors: { type: [ProductColors], required: false },
    status: { type: Boolean, required: true },
    quantity: { type: Number, min: 0, max: 10000, required: true },
    userid: { type: String, required: true },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: String, required: true },
    updated: { type: Date, index: true, default: Date.now }
});


module.exports = mongoose.model('products', ProductSchema);