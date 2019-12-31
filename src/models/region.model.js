const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const RegionSchema = mongoose.Schema({
    code: { type: String, index: true, required: true, unique: true },
    name: { type: String, index: true, required: true },
    countryid: { type: Schema.Types.ObjectId, ref: 'country', required: true },
    status: { type: Boolean, required: true, default: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

RegionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('region', RegionSchema);