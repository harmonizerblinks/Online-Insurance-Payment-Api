const mongoose = require('mongoose');

const SliderSchema = mongoose.Schema({
    name: { type: String, required: true },
    tabindex: { type: Number, required: true },
    tabtitle: { type: String, required: true },
    imageurl: { type: String, required: true },
    description: { type: String, minlength: 18, required: true },
    link: { type: String, required: true },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});

module.exports = mongoose.model('slider', SliderSchema);