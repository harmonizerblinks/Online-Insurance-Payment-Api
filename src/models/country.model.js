const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const CountrySchema = mongoose.Schema({
    code: { type: String, required: true },
    icon: { type: String, required: false },
    name: { type: String, index: true, required: true, unique: true },
    // symbol: { type: String, required: true },
    currency: { type: String, required: true, minlength: 2 },
    status: { type: Boolean, required: true, default: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

CountrySchema.plugin(uniqueValidator);

module.exports = mongoose.model('country', CountrySchema);