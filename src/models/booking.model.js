const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const BookingSchema = mongoose.Schema({
    code: { type: String, index: true, required: true, unique: true },
    name: { type: String, index: true, required: true },
    image: { type: String, required: false },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    loc: { type: [String], required: true },
    pickup: { type: Boolean, required: true },
    station: { type: Schema.Types.ObjectId, ref: 'station', required: false },
    dropoff: { type: Schema.Types.ObjectId, ref: 'station', required: false },
    seats: { type: Number, required: true },
    amount: { type: Schema.Types.Decimal128, required: true },
    schedule: { type: Schema.Types.ObjectId, ref: 'schedule', required: false },
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

BookingSchema.plugin(uniqueValidator);

module.exports = mongoose.model('booking', BookingSchema);