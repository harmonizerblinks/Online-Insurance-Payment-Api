const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const BusSchema = mongoose.Schema({
    code: { type: String, index: true, required: true, unique: true },
    type: { type: String, required: true },
    brand: { type: String, required: true },
    image: { type: [String], required: true },
    gallery: { type: [String], required: true },
    model: { type: String, required: true },
    plateno: { type: String, required: true },
    engine: { type: String, required: true },
    seats: { type: String, required: true },
    color: { type: String, required: true },
    amount: { type: Schema.Types.Decimal128, required: true },
    brandid: { type: Schema.Types.ObjectId, ref: 'brand', required: false },
    driverid: { type: Schema.Types.ObjectId, ref: 'driver', required: false },
    locationid: { type: Schema.Types.ObjectId, ref: 'location', required: false },
    regionid: { type: Schema.Types.ObjectId, ref: 'region', required: false },
    countryid: { type: Schema.Types.ObjectId, ref: 'country', required: false },
    status: { type: Boolean, required: true, default: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

BusSchema.plugin(uniqueValidator);

module.exports = mongoose.model('bus', BusSchema);