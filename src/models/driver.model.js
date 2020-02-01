const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const DriverSchema = mongoose.Schema({
    code: { type: String, minlength: 3, maxlength: 7, required: true, unique: true },
    name: { type: String, minlength: 4, maxlength: 50, required: true },
    image: { type: String, required: false },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, minlength: 8, maxlength: 15, required: true, unique: true },
    licence: { type: String, required: false },
    // budid: { type: Schema.Types.ObjectId, ref: 'bus', required: false, default: null },
    locationid: { type: Schema.Types.ObjectId, ref: 'location', required: false },
    regionid: { type: Schema.Types.ObjectId, ref: 'region', required: false },
    countryid: { type: Schema.Types.ObjectId, ref: 'country', required: false },
    status: { type: Boolean, required: true, default: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

DriverSchema.plugin(uniqueValidator);

module.exports = mongoose.model('driver', DriverSchema);