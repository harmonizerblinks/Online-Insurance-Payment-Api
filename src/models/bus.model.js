const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const BusSchema = mongoose.Schema({
    type: { type: String, required: true },
    code: { type: String, minlength: 3, maxlength: 7, index: true, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    gallery: { type: [String], required: true },
    model: { type: String, required: true },
    plateno: { type: String, required: true },
    engine: { type: String, required: false },
    seats: { type: Number, required: true },
    color: { type: String, required: true },
    amount: { type: Schema.Types.Mixed, required: true, default: 0 },
    companyid: { type: Schema.Types.ObjectId, ref: 'company', required: false },
    brandid: { type: Schema.Types.ObjectId, ref: 'brand', required: true },
    driverid: { type: String, required: true },
    locationid: { type: Schema.Types.ObjectId, ref: 'location', required: false },
    regionid: { type: Schema.Types.ObjectId, ref: 'region', required: false },
    countryid: { type: Schema.Types.ObjectId, ref: 'country', required: false },
    rental: { type: Boolean, required: true, default: true },
    status: { type: Boolean, required: true, default: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

// BusSchema.plugin(uniqueValidator);

module.exports = mongoose.model('bus', BusSchema);