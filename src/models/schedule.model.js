const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const ScheduleSchema = mongoose.Schema({
    code: { type: String, index: true, required: true, unique: true },
    // name: { type: String, index: true, required: true },
    loc: { type: [String], required: true },
    start_point: { type: Schema.Types.ObjectId, ref: 'station', required: false },
    end_point: { type: Schema.Types.ObjectId, ref: 'station', required: false },
    date: { type: Date, required: true },
    landmark: { type: String, required: true },
    amount: { type: String, required: true },
    seats: { type: Number, required: true },
    currency: { type: String, required: true },
    intro: { type: String, required: true },
    notice: { type: String, required: true },
    status: { type: String, required: true, default: 'Upcoming' },
    haspickup: { type: Boolean, required: true },
    stations: { type: [Schema.Types.ObjectId], ref: 'station', required: false },
    locationid: { type: Schema.Types.ObjectId, ref: 'location', required: false },
    regionid: { type: Schema.Types.ObjectId, ref: 'region', required: false },
    countryid: { type: Schema.Types.ObjectId, ref: 'country', required: false },
    available: { type: Boolean, required: true, default: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

ScheduleSchema.plugin(uniqueValidator);

module.exports = mongoose.model('schedule', ScheduleSchema);