const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const TourSchema = mongoose.Schema({
    code: { type: String, index: true, required: true, unique: true },
    name: { type: String, index: true, required: true },
    image: { type: [String], required: true },
    gallery: { type: [String], required: true },
    loc: { type: [String], required: true },
    landmark: { type: String, required: true },
    amount: { type: String, required: true },
    intro: { type: String, required: true },
    details: { type: String, required: true },
    locationid: { type: Schema.Types.ObjectId, ref: 'location', required: false },
    regionid: { type: Schema.Types.ObjectId, ref: 'region', required: false },
    countryid: { type: Schema.Types.ObjectId, ref: 'country', required: false },
    status: { type: Boolean, required: true, default: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

TourSchema.plugin(uniqueValidator);

module.exports = mongoose.model('tour', TourSchema);