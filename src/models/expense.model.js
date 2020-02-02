const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const ExpenseSchema = mongoose.Schema({
    code: { type: String, minlength: 3, maxlength: 7, required: true, unique: true },
    type: { type: String, required: true },
    amount: { type: String, required: true },
    reference: { type: String, required: false },
    busid: { type: Schema.Types.ObjectId, ref: 'bus', required: false, default: null },
    status: { type: Boolean, required: true, default: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

ExpenseSchema.plugin(uniqueValidator);

module.exports = mongoose.model('expense', ExpenseSchema);