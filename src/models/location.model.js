const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const LocationSchema = mongoose.Schema({
    name: { type: String, index: true, required: true, unique: true },
    regionid: { type: Schema.Types.ObjectId, ref: 'region', required: true },
    status: { type: Boolean, required: true, default: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

LocationSchema.plugin(uniqueValidator);

module.exports = mongoose.model('location', LocationSchema);