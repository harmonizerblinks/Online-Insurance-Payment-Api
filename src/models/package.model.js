const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const PackageSchema = mongoose.Schema({
    code: { type: String, minlength: 4, maxlength: 8, required: true },
    name: { type: String, minlength: 6, maxlength: 50, required: true },
    period: { type: String, required: true },
    amount: { type: Schema.Types.Mixed, required: true },
    discount: { type: Boolean, required: true },
    percentage: { type: String, required: true },
    status: { type: Boolean, required: true, default: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

PackageSchema.plugin(uniqueValidator);

module.exports = mongoose.model('package', PackageSchema);