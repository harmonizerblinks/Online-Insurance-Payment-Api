const mongoose = require('mongoose');

const ProductSizesSchema = mongoose.Schema({
    name: { type: String, required: true },
    imageurl: { type: String, required: false },
    amount: { type: String, required: true },
    status: { type: Boolean, required: true },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});

const ProductColorsSchema = mongoose.Schema({
    name: { type: String, required: true },
    imageurl: { type: String, required: true },
    status: { type: Boolean, required: true },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});

const ProductImagesSchema = mongoose.Schema({
    imageurl: { type: String, required: true },
    created: { type: Date, index: true, default: Date.now },
});

const ProductCategorySchema = mongoose.Schema({
    name: { type: String, required: true },
    imageurl: { type: String, required: true },
    description: String,
    created: { type: Date, index: true, default: Date.now }
});

const ProductSchema = mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    imageurl: { type: String, required: true },
    images: { type: [ProductImagesSchema], required: false },
    categoryid: { type: String, required: true },
    category: { type: ProductCategorySchema, required: false },
    introduction: { type: String, required: false },
    description: { type: String, required: false },
    amount: { type: String, required: true, default: 0 },
    sizes: { type: [ProductSizesSchema], required: false },
    colors: { type: [ProductColorsSchema], required: false },
    status: { type: Boolean, required: true },
    discount: { type: Boolean, required: true, default: false },
    percentage: { type: Number, required: true, default: 0 },
    quantity: { type: Number, min: 0, max: 10000, required: true },
    userid: { type: String, required: true },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: String, required: false },
    updated: { type: Date, index: true, default: Date.now }
});


module.exports = mongoose.model('products', ProductSchema);