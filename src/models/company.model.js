const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const CompanySchema = mongoose.Schema({
    code: { type: String, minlength: 3, maxlength: 7, required: true, unique: true },
    name: { type: String, minlength: 3, maxlength: 50, required: true },
    logo: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, minlength: 8, maxlength: 15, required: true, unique: true },
    website: { type: String, required: false },
    locationid: { type: Schema.Types.ObjectId, ref: 'location', required: false },
    regionid: { type: Schema.Types.ObjectId, ref: 'region', required: false },
    countryid: { type: Schema.Types.ObjectId, ref: 'country', required: false },
    status: { type: Boolean, required: true, default: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

CompanySchema.plugin(uniqueValidator);

module.exports = mongoose.model('company', CompanySchema);