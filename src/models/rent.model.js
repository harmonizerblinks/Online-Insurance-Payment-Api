const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const RentSchema = mongoose.Schema({
    code: { type: String, index: true, required: true, unique: true },
    name: { type: String, index: true, required: true },
    mobile: { type: String, index: true, required: true },
    email: { type: String, index: true, required: false },
    image: { type: String, required: false },
    loc: { type: [String], required: true },
    start_point: { type: Schema.Types.ObjectId, ref: 'location', required: false },
    end_point: { type: Schema.Types.ObjectId, ref: 'location', required: false },
    address: { type: String, required: true },
    seats: { type: Number, required: true },
    days: { type: String, required: true },
    amount: { type: String, required: true },
    date: { type: Date, required: true },
    note: { type: String, required: true },
    busid: { type: Schema.Types.ObjectId, ref: 'bus', required: true },
    locationid: { type: Schema.Types.ObjectId, ref: 'location', required: false },
    regionid: { type: Schema.Types.ObjectId, ref: 'region', required: false },
    countryid: { type: Schema.Types.ObjectId, ref: 'country', required: false },
    status: { type: Boolean, required: true, default: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

RentSchema.plugin(uniqueValidator);

module.exports = mongoose.model('rent', RentSchema);