const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const StationSchema = mongoose.Schema({
    code: { type: String, index: true, required: true, unique: true },
    name: { type: String, index: true, required: true, unique: true },
    loc: { type: [String], index: true, required: false },
    suherb: { type: String, index: true, required: false, unique: true },
    image: { type: String, required: false },
    locationid: { type: Schema.Types.ObjectId, ref: 'location', required: true },
    regionid: { type: Schema.Types.ObjectId, ref: 'region', required: true },
    countryid: { type: Schema.Types.ObjectId, ref: 'country', required: true },
    status: { type: Boolean, required: true, default: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

StationSchema.plugin(uniqueValidator);

module.exports = mongoose.model('station', StationSchema);