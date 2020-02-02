const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const BusSchema = mongoose.Schema({
    code: { type: String, minlength: 3, maxlength: 7, index: true, required: true, unique: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    gallery: { type: [String], required: true },
    model: { type: String, required: true },
    plateno: { type: String, required: true },
    engine: { type: String, required: false },
    seats: { type: String, required: true },
    color: { type: String, required: true },
    amount: { type: String, required: true, default: 0 },
    ownerid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    brandid: { type: Schema.Types.ObjectId, ref: 'brand', required: true },
    driverid: { type: Schema.Types.ObjectId, ref: 'driver', required: true },
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

BusSchema.plugin(uniqueValidator);

module.exports = mongoose.model('bus', BusSchema);