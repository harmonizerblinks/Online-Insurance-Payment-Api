const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const BusfeeSchema = mongoose.Schema({
    start_point: { type: Schema.Types.ObjectId, ref: 'station', required: true },
    end_point: { type: Schema.Types.ObjectId, ref: 'station', required: true },
    price: { type: Schema.Types.Mixed, required: true, default: 0.0 },
    public_price: { type: Schema.Types.Mixed, required: true, default: 0 },
    hire_price: { type: Schema.Types.Mixed, required: false, default: 0 },
    fuel_cost: { type: Schema.Types.Mixed, required: false, default: 0 },
    locationid: { type: Schema.Types.ObjectId, ref: 'location', required: false },
    regionid: { type: Schema.Types.ObjectId, ref: 'region', required: false },
    countryid: { type: Schema.Types.ObjectId, ref: 'country', required: false },
    status: { type: Boolean, required: true, default: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

BusfeeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('busfee', BusfeeSchema);