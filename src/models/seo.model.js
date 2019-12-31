const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const SeoSchema = mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    meta_tag: { type: String, required: false },
    meta_keyword: { type: String, required: false },
    meta_description: { type: String, minlength: 10, required: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

SeoSchema.plugin(uniqueValidator);

module.exports = mongoose.model('seo', SeoSchema);