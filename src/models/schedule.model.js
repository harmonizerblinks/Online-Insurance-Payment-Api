const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const ScheduleSchema = mongoose.Schema({
    code: { type: String, index: true, required: true, unique: true },
    type: { type: String, index: true, required: true },
    loc: { type: [String], required: false },
    start_point: { type: Schema.Types.ObjectId, ref: 'station', required: false },
    end_point: { type: Schema.Types.ObjectId, ref: 'station', required: false },
    date: { type: Date, required: true },
    landmark: { type: String, required: true },
    amount: { type: Schema.Types.Mixed, required: true },
    total: { type: Schema.Types.Mixed, required: true, default: 0 },
    seats: { type: Number, required: true },
    seats_booked: { type: [Number], required: false, default: [] },
    intro: { type: String, required: false, default: 'Troski Bus' },
    notice: { type: String, required: false },
    status: { type: String, required: true, default: 'Upcoming' },
    completed: { type: Boolean, required: true, default: false },
    paid: { type: Boolean, required: true, default: true },
    haspickup: { type: Boolean, required: true },
    stations: { type: [Schema.Types.ObjectId], ref: 'station', required: false },
    driverid: { type: String, required: true },
    busid: { type: Schema.Types.ObjectId, ref: 'bus', required: false },
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